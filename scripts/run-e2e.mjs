import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const npxCommand = isWindows ? "npx.cmd" : "npx";
const port = 3100;
const ui = process.argv.includes("--ui");

const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-anon-key",
  OPENAI_API_KEY: "e2e-openai-key",
  NEXT_PUBLIC_E2E_MODE: "1",
  E2E_MODE: "1",
  PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH || ".playwright-browsers",
};

function spawnProcess(command, args, options = {}) {
  const finalCommand = isWindows ? "cmd.exe" : command;
  const finalArgs = isWindows ? ["/c", command, ...args] : args;
  return spawn(finalCommand, finalArgs, {
    stdio: options.stdio || "inherit",
    shell: false,
    env,
  });
}

async function waitForServer(url, timeoutMs = 60_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function killTree(child) {
  if (!child.pid) return;
  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
}

const server = spawnProcess(npmCommand, ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)]);

try {
  await waitForServer(`http://127.0.0.1:${port}`);
  const args = ["playwright", "test"];
  if (ui) args.push("--ui");
  const tests = spawnProcess(npxCommand, args);
  const exitCode = await new Promise((resolve) => {
    tests.on("exit", (code) => resolve(code ?? 1));
  });
  killTree(server);
  process.exit(exitCode);
} catch (error) {
  killTree(server);
  console.error(error);
  process.exit(1);
}
