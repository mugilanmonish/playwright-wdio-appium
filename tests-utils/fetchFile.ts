import { execSync } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/**
 * Try multiple places where UDID might be present in capabilities/session.
 * Pass the WDIO/Appium "browser" or "driver" object if available.
 */
export function findUdidFromSession(sessionObj?: any): string | null {
  if (!sessionObj) return null;
  const caps = sessionObj.capabilities ?? sessionObj;
  if (caps.udid) {
    return String(caps["udid"]);
  }
  try {
    if (caps.device && caps.device.udid) return String(caps.device.udid);
    if (caps["device"]?.udid) return String(caps["device"].udid);
  } catch {
    // ignore
  }

  return null;
}

function run(cmd: string) {
  return execSync(cmd, { encoding: "utf8" }).toString();
}

function decodeFileUrl(fileUrl: string) {
  if (!fileUrl) return fileUrl;
  if (fileUrl.startsWith("file://")) {
    try {
      const withoutScheme = fileUrl.replace(/^file:\/\//, "");
      return decodeURIComponent(withoutScheme);
    } catch {
      return fileUrl.replace(/^file:\/\//, "");
    }
  }
  return fileUrl;
}

/**
 * Main helper:
 *  - gets UDID (from session if possible, otherwise from `xcrun`)
 *  - finds Files.app group container
 *  - looks for `fileName` inside "File Provider Storage"
 *  - copies it to `~/Documents/Kit/<fileName>`
 *
 * Usage:
 *   await fetchMyDocFromSimulator("MyFile.zip", browser);
 */
export async function fetchMyDocFromSimulator(
  fileName: string,
  sessionObj?: any
) {
  if (!fileName) {
    throw new Error("fileName is required (e.g. 'MyFile.zip').");
  }

  // 1) Try to get udid from session/capabilities
  let udid: string | null = findUdidFromSession(
    sessionObj ?? (global as any).browser ?? null
  );

  // 2) If not found, fallback to first Booted UDID from xcrun
  if (!udid) {
    const devices = run("xcrun simctl list devices");
    const udidMatch = devices.match(/\(([0-9A-Fa-f-]{36})\)\s*\(Booted\)/);
    if (!udidMatch) {
      throw new Error(
        "No UDID found in session and no Booted simulator detected."
      );
    }
    udid = udidMatch[1];
  }

  // 3) listapps for that udid
  const appsOutput = run(`xcrun simctl listapps ${udid}`);

  // find start of com.apple.DocumentsApp block
  const appKey = `"com.apple.DocumentsApp"`;
  const idx = appsOutput.indexOf(appKey);
  if (idx === -1) {
    throw new Error(
      `${appKey} not found in simctl listapps output for UDID ${udid}`
    );
  }

  const appBlock = appsOutput.slice(idx);

  // find GroupContainers block inside appBlock
  const groupIdx = appBlock.indexOf("GroupContainers");
  if (groupIdx === -1) {
    throw new Error("GroupContainers not found in DocumentsApp block.");
  }

  // find block braces (simple brace balance)
  const startBrace = appBlock.indexOf("{", groupIdx);
  if (startBrace === -1) {
    throw new Error("Malformed GroupContainers block (no opening brace).");
  }

  let depth = 0;
  let endPos = -1;
  for (let i = startBrace; i < appBlock.length; i++) {
    const ch = appBlock[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endPos = i;
        break;
      }
    }
  }
  if (endPos === -1) {
    throw new Error("Couldn't find end of GroupContainers block.");
  }

  const groupBlock = appBlock.slice(startBrace, endPos + 1);

  // parse "key" = "value"; lines
  const groupRegex = /"([^"]+)"\s*=\s*"([^"]+)";/g;
  const groups: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = groupRegex.exec(groupBlock)) !== null) {
    groups[m[1]] = m[2];
  }

  if (Object.keys(groups).length === 0) {
    throw new Error("No GroupContainers parsed.");
  }

  // prefer FileProvider.LocalStorage
  const preferredKey =
    Object.keys(groups).find((k) => k.includes("FileProvider.LocalStorage")) ||
    Object.keys(groups).find((k) => k.includes("FileProvider")) ||
    Object.keys(groups)[0];

  const groupUrl = groups[preferredKey];
  const groupPath = decodeFileUrl(groupUrl).replace(/\/+$/, "");

  // file provider storage path
  const fpStorage = path.join(groupPath, "File Provider Storage");

  // unment below if need to debug
  /*
  try {
    run(`open "${fpStorage}"`);
  } catch(error) {
    throw new Error(error)
  } */

  // 4) Copy <fileName> from that folder to ~/Documents/Kit/<fileName>
  const srcZip = path.join(fpStorage, fileName);
  const destDir = path.join(os.homedir(), "Documents", "RecoveryKit");
  const destZip = path.join(destDir, fileName);

  let copied = false;

  if (fs.existsSync(srcZip)) {
    // ensure ~/Documents/RecoveryKit exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcZip, destZip);
    copied = true;
  }

  console.log({
    udid,
    groupKey: preferredKey,
    groupPath,
    copied,
    srcPath: copied ? srcZip : undefined,
    destPath: copied ? destZip : undefined,
  });
}
