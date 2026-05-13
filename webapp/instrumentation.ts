export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startWorker } = await import("./lib/worker");
    const { startSeedancePoller } = await import("./lib/poller");
    startWorker();
    startSeedancePoller();
  }
}
