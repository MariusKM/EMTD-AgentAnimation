export function parsePromptDuration(raw: string): number | null {
  const header = raw.match(/\*\*Duration target\*\*:\s*(\d+)\s*s/i);
  if (header) {
    const n = parseInt(header[1], 10);
    if (n >= 3 && n <= 15) return n;
  }
  const inline = raw.match(/\b(\d+)s,\s*seamless loop/i);
  if (inline) {
    const n = parseInt(inline[1], 10);
    if (n >= 3 && n <= 15) return n;
  }
  return null;
}

export function parsePromptAspect(raw: string): string | null {
  const m = raw.match(/\*\*Aspect\*\*:\s*(\d+:\d+)/i);
  return m ? m[1] : null;
}
