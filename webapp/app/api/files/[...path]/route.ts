import fs from "node:fs";
import path from "node:path";
import { HEROANIM_ROOT } from "@/lib/paths";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
  ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8",
};

export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  if (!parts || parts.length === 0) return new Response("Bad request", { status: 400 });

  const requested = parts.map((p) => decodeURIComponent(p)).join("/");
  const root = path.posix.normalize(HEROANIM_ROOT.replace(/\\/g, "/"));
  const full = path.posix.normalize(path.posix.join(root, requested));

  if (!full.toLowerCase().startsWith(root.toLowerCase())) {
    return new Response("Forbidden", { status: 403 });
  }
  if (!fs.existsSync(full)) return new Response("Not found", { status: 404 });

  const stat = fs.statSync(full);
  if (!stat.isFile()) return new Response("Not a file", { status: 400 });

  const ext = path.extname(full).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";

  const range = req.headers.get("range");
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      const start = m[1] === "" ? 0 : parseInt(m[1], 10);
      const end = m[2] === "" ? stat.size - 1 : parseInt(m[2], 10);
      if (start >= stat.size || end >= stat.size || start > end) {
        return new Response("Range not satisfiable", { status: 416, headers: { "Content-Range": `bytes */${stat.size}` } });
      }
      const stream = fs.createReadStream(full, { start, end });
      return new Response(streamToWeb(stream), {
        status: 206,
        headers: {
          "Content-Type": mime,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "no-cache",
        },
      });
    }
  }

  const stream = fs.createReadStream(full);
  return new Response(streamToWeb(stream), {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache",
    },
  });
}

function streamToWeb(node: NodeJS.ReadableStream): ReadableStream<Uint8Array> {
  // @ts-ignore — Node 18+ supports Readable.toWeb
  return (require("node:stream").Readable as any).toWeb(node) as ReadableStream<Uint8Array>;
}
