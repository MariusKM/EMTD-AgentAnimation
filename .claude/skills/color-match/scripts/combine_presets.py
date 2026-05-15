"""
Combine multiple saved Color Match presets into a single averaged preset.

Reinhard: equal-weight mean of the 4 stat vectors (src_mean, src_std, tgt_mean,
          tgt_std) across selected presets. Each preset contributes equally.
Hist:     pointwise mean of the 3 per-channel LUTs, clipped back to uint8.

All selected presets must share the same method. Shares the preset format and
directory with the ComfyUI node - presets live in ../presets/.

Usage:
  python combine_presets.py --presets moneybags diana spy --save universal
  python combine_presets.py --all --save pooled_all
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np


PRESETS_DIR = Path(__file__).resolve().parent / "presets"


def _sanitize_name(name: str) -> str:
    return "".join(c for c in name if c.isalnum() or c in ("-", "_")).strip()


def deserialize_model(d: dict):
    method = d["method"]
    if method == "hist":
        luts = [np.array(lut, dtype=np.uint8) for lut in d["luts"]]
        return ("hist", {"luts": luts})
    return ("reinhard", {
        "src_mean": np.array(d["src_mean"], dtype=np.float32),
        "src_std": np.array(d["src_std"], dtype=np.float32),
        "tgt_mean": np.array(d["tgt_mean"], dtype=np.float32),
        "tgt_std": np.array(d["tgt_std"], dtype=np.float32),
    })


def serialize_model(model) -> dict:
    method, data = model
    if method == "hist":
        return {"method": "hist", "luts": [lut.tolist() for lut in data["luts"]]}
    return {
        "method": "reinhard",
        "src_mean": data["src_mean"].tolist(),
        "src_std": data["src_std"].tolist(),
        "tgt_mean": data["tgt_mean"].tolist(),
        "tgt_std": data["tgt_std"].tolist(),
    }


def combine_reinhard(models):
    keys = ("src_mean", "src_std", "tgt_mean", "tgt_std")
    acc = {k: np.zeros(3, dtype=np.float64) for k in keys}
    for _, data in models:
        for k in keys:
            acc[k] += data[k].astype(np.float64)
    n = len(models)
    return ("reinhard", {k: (acc[k] / n).astype(np.float32) for k in keys})


def combine_hist(models):
    acc = [np.zeros(256, dtype=np.float64) for _ in range(3)]
    for _, data in models:
        for c in range(3):
            acc[c] += data["luts"][c].astype(np.float64)
    n = len(models)
    luts = [np.clip(a / n, 0, 255).astype(np.uint8) for a in acc]
    return ("hist", {"luts": luts})


def main():
    ap = argparse.ArgumentParser(
        prog="combine_presets",
        description="Average multiple Color Match presets into a new preset",
    )
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--presets", nargs="+", help="Preset names to combine (>=2)")
    g.add_argument("--all", action="store_true",
                   help="Combine every preset in the presets directory")
    ap.add_argument("--save", required=True, help="Name for the combined preset")
    ap.add_argument("--no-overwrite", action="store_true",
                    help="Fail if the save name already exists")
    args = ap.parse_args()

    if args.all:
        names = sorted(p.stem for p in PRESETS_DIR.glob("*.json"))
        names = [n for n in names if n != _sanitize_name(args.save)]
    else:
        names = list(dict.fromkeys(args.presets))  # dedupe, preserve order

    if len(names) < 2:
        print("error: need at least 2 distinct presets to combine", file=sys.stderr)
        sys.exit(1)

    models = []
    methods = set()
    for n in names:
        p = PRESETS_DIR / f"{n}.json"
        if not p.exists():
            print(f"error: preset not found: {p}", file=sys.stderr)
            sys.exit(1)
        m = deserialize_model(json.loads(p.read_text()))
        methods.add(m[0])
        models.append(m)

    if len(methods) > 1:
        print(f"error: presets use mixed methods ({methods}); can only combine same-method presets",
              file=sys.stderr)
        sys.exit(1)
    method = methods.pop()

    combined = combine_reinhard(models) if method == "reinhard" else combine_hist(models)

    safe = _sanitize_name(args.save)
    if not safe:
        print("error: --save name must contain at least one alphanumeric char",
              file=sys.stderr)
        sys.exit(1)
    out_path = PRESETS_DIR / f"{safe}.json"
    if out_path.exists() and args.no_overwrite:
        print(f"error: preset '{safe}' exists and --no-overwrite was set",
              file=sys.stderr)
        sys.exit(1)
    out_path.write_text(json.dumps(serialize_model(combined), indent=2))
    print(f"combined {len(names)} presets ({method}) -> {out_path}")
    print("  sources: " + ", ".join(names))


if __name__ == "__main__":
    main()
