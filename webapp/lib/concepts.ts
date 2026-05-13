import fs from "node:fs";

export type ConceptKind = "power" | "idle";

export type ConceptBlock = {
  id: string;            // e.g. "P1", "I2"
  kind: ConceptKind;
  title: string;         // "Ground Slam"
  slug: string;          // "P1_Ground_Slam"
  rawMarkdown: string;   // includes the "#### P1: Title" line + body until next #### or ---
};

const HEADING_RE = /^#{3,4}\s+([PI])(\d+)\s*[:\-—]\s*(.+?)\s*$/;

export function parseConcepts(md: string): ConceptBlock[] {
  const lines = md.split(/\r?\n/);
  const blocks: ConceptBlock[] = [];
  let current: { idLetter: "P" | "I"; idNum: string; title: string; bodyStart: number } | null = null;

  const flush = (endIdx: number) => {
    if (!current) return;
    const id = `${current.idLetter}${current.idNum}`;
    const slug = `${id}_${current.title.replace(/[^\w]+/g, "_").replace(/^_|_$/g, "")}`;
    const rawMarkdown = lines.slice(current.bodyStart - 1, endIdx).join("\n").trimEnd();
    blocks.push({
      id,
      kind: current.idLetter === "P" ? "power" : "idle",
      title: current.title,
      slug,
      rawMarkdown,
    });
    current = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = HEADING_RE.exec(line);
    if (m) {
      flush(i);
      current = {
        idLetter: m[1] as "P" | "I",
        idNum: m[2],
        title: m[3].trim(),
        bodyStart: i + 1, // 1-based start of header line
      };
      continue;
    }
    // Section terminator: a top-level "## " heading or "---" *after* current block started
    if (current && (/^##\s/.test(line) || line.trim() === "---")) {
      flush(i);
    }
  }
  flush(lines.length);
  return blocks;
}

export function readConcepts(filePath: string): ConceptBlock[] {
  if (!fs.existsSync(filePath)) return [];
  const md = fs.readFileSync(filePath, "utf8");
  return parseConcepts(md);
}

/**
 * Replace the body of one concept block in concepts.md and write it back.
 * Preserves the rest of the file byte-for-byte (other blocks, frontmatter, structure).
 */
export function writeConceptBlock(filePath: string, conceptId: string, newRawMarkdown: string): void {
  const md = fs.readFileSync(filePath, "utf8");
  const lines = md.split(/\r?\n/);
  let startIdx = -1;
  let endIdx = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const m = HEADING_RE.exec(lines[i]);
    if (!m) continue;
    const id = `${m[1]}${m[2]}`;
    if (id === conceptId && startIdx === -1) {
      startIdx = i;
    } else if (startIdx !== -1) {
      endIdx = i;
      break;
    }
  }
  if (startIdx === -1) throw new Error(`Concept ${conceptId} not found in ${filePath}`);

  // Walk back from endIdx to skip trailing blank lines and a possible "---" separator
  // that belongs to the *next* section, so we don't eat it.
  let realEnd = endIdx;
  // realEnd is exclusive — we replace lines [startIdx, realEnd)
  // Trim trailing blanks of the block we are replacing (so re-insert keeps spacing clean).
  while (realEnd > startIdx + 1 && lines[realEnd - 1].trim() === "") realEnd--;

  const eol = md.includes("\r\n") ? "\r\n" : "\n";
  const before = lines.slice(0, startIdx).join(eol);
  const after = lines.slice(realEnd).join(eol);
  const middle = newRawMarkdown.replace(/\r?\n/g, eol).trimEnd();

  const out = [before, middle, after].filter(s => s.length > 0).join(eol) + (md.endsWith("\n") ? eol : "");
  fs.writeFileSync(filePath, out, "utf8");
}
