/**
 * Patches @distube/yt-dlp to fix two bugs:
 * 1. json() wrapper mixes stderr into stdout, so deprecation warnings break JSON.parse
 * 2. resolve()/getStreamURL() pass --no-call-home which yt-dlp has deprecated
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "node_modules", "@distube", "yt-dlp", "dist", "index.js");

let src = fs.readFileSync(file, "utf8");

// Fix 1: separate stderr from stdout in json() wrapper
src = src.replace(
  /let output = "";\s*process2\.stdout\?\.on\("data",\s*\(chunk\)\s*=>\s*\{\s*output \+= chunk;\s*\}\);\s*process2\.stderr\?\.on\("data",\s*\(chunk\)\s*=>\s*\{\s*output \+= chunk;\s*\}\);\s*process2\.on\("close",\s*\(code\)\s*=>\s*\{\s*if \(code === 0\) resolve\(JSON\.parse\(output\)\);\s*else reject\(new Error\(output\)\);/,
  `let stdout = "";
    let stderr = "";
    process2.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    process2.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    process2.on("close", (code) => {
      if (code === 0) resolve(JSON.parse(stdout));
      else reject(Object.assign(new Error(stderr || stdout), { stderr }));`
);

// Fix 2: remove deprecated --no-call-home flag
src = src.replace(/\s*noCallHome:\s*true,?\n/g, "\n");

fs.writeFileSync(file, src, "utf8");
console.log("Patched @distube/yt-dlp successfully.");
