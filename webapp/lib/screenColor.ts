import { spawnSync } from "node:child_process";
import type { ScreenColor } from "./meta";

/**
 * Detect whether a raw Seedance mp4 was generated against a green or blue
 * chroma background by sampling the first frame.
 *
 * Strategy: dump a single 32×32 RGB frame via ffmpeg and look at the four
 * corner patches (top-left, top-right, bottom-left, bottom-right). The hero
 * sits in the middle of the frame so the corners are pure background. Whichever
 * of G or B dominates the corner average is the screen color.
 *
 * Returns null on any failure — callers should fall back to "green" (the
 * pre-existing default) so no clip is left unkeyable just because ffmpeg
 * couldn't be spawned.
 */
export function detectScreenColor(rawMp4: string): ScreenColor | null {
  try {
    const r = spawnSync(
      "ffmpeg",
      [
        "-v", "error",
        "-i", rawMp4,
        "-vframes", "1",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-vf", "scale=32:32",
        "pipe:1",
      ],
      { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1024 * 1024 },
    );
    if (r.status !== 0 || !r.stdout || r.stdout.length < 32 * 32 * 3) return null;
    const buf = r.stdout;
    const W = 32;
    const PATCH = 6; // top-left/right + bottom-left/right 6×6 patches
    let sumR = 0, sumG = 0, sumB = 0, n = 0;
    const corners: [number, number][] = [
      [0, 0],
      [W - PATCH, 0],
      [0, W - PATCH],
      [W - PATCH, W - PATCH],
    ];
    for (const [cx, cy] of corners) {
      for (let y = cy; y < cy + PATCH; y++) {
        for (let x = cx; x < cx + PATCH; x++) {
          const i = (y * W + x) * 3;
          sumR += buf[i];
          sumG += buf[i + 1];
          sumB += buf[i + 2];
          n++;
        }
      }
    }
    const avgR = sumR / n;
    const avgG = sumG / n;
    const avgB = sumB / n;
    // If one of G/B is well clear of R AND clearly dominant over the other,
    // call it. Otherwise (washed-out / non-chroma frame) bail to null.
    const gDom = avgG - avgR;
    const bDom = avgB - avgR;
    if (Math.max(gDom, bDom) < 30) return null;
    return gDom > bDom ? "green" : "blue";
  } catch {
    return null;
  }
}
