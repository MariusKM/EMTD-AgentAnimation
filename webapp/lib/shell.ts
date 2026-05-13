import { spawn, ChildProcessWithoutNullStreams } from "node:child_process";
import fs from "node:fs";

export type SpawnResult = {
  child: ChildProcessWithoutNullStreams;
  done: Promise<{ code: number | null; stdoutTail: string; stderrTail: string }>;
};

/**
 * Spawn a command with stdout+stderr tee'd to a log file.
 * Returns the child handle (for cancellation) and a promise resolving on exit.
 */
export function spawnLogged(
  cmd: string,
  args: string[],
  opts: { cwd?: string; env?: NodeJS.ProcessEnv; logPath: string; shell?: boolean | string } = { logPath: "" },
): SpawnResult {
  const stream = fs.createWriteStream(opts.logPath, { flags: "a" });
  stream.write(`\n[${new Date().toISOString()}] $ ${cmd} ${args.join(" ")}\n`);

  const child = spawn(cmd, args, {
    cwd: opts.cwd,
    env: { ...process.env, ...opts.env },
    shell: opts.shell ?? false,
    windowsHide: true,
  }) as ChildProcessWithoutNullStreams;

  let stdoutTail = "";
  let stderrTail = "";
  const tail = (s: string, line: string) => (s + line).slice(-4000);

  child.stdout.on("data", (d: Buffer) => {
    const s = d.toString();
    stream.write(s);
    stdoutTail = tail(stdoutTail, s);
  });
  child.stderr.on("data", (d: Buffer) => {
    const s = d.toString();
    stream.write(s);
    stderrTail = tail(stderrTail, s);
  });

  const done = new Promise<{ code: number | null; stdoutTail: string; stderrTail: string }>((resolve) => {
    child.on("close", (code) => {
      stream.write(`\n[exit ${code}]\n`);
      stream.end();
      resolve({ code, stdoutTail, stderrTail });
    });
    child.on("error", (err) => {
      stream.write(`\n[spawn error] ${err.message}\n`);
    });
  });

  return { child, done };
}
