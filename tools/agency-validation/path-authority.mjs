import { realpathSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = typeof import.meta.dirname === "string" ? import.meta.dirname : path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = realpathSync(path.resolve(moduleDir, "../.."));
const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;

export class PathAuthorityError extends Error {
  constructor(code, input, message) {
    super(message);
    this.name = "PathAuthorityError";
    this.code = code;
    this.input = input;
  }
}

export function assertSafeRepoRelativePath(input, options = {}) {
  const { mustEndWith } = options;
  if (typeof input !== "string" || input.trim() === "") throw new PathAuthorityError("EMPTY_PATH", input, "Path must be a non-empty string.");
  if (input.includes(String.fromCharCode(0))) throw new PathAuthorityError("NUL_BYTE", input, "Path must not contain a NUL byte.");
  if (SCHEME.test(input)) throw new PathAuthorityError("URL_OR_DRIVE_PATH", input, "Path must be repo-relative, not URL-shaped or drive-shaped.");
  if (path.isAbsolute(input) || path.win32.isAbsolute(input) || input.startsWith("/")) throw new PathAuthorityError("ABSOLUTE_PATH", input, "Path must be repo-relative, not absolute.");
  if (input.includes("\\")) throw new PathAuthorityError("WINDOWS_SEPARATOR", input, "Path must use forward slashes for stable CI diffs.");
  if (mustEndWith && !input.endsWith(mustEndWith)) throw new PathAuthorityError("BAD_EXTENSION", input, `Path must end with ${mustEndWith}.`);
  const resolved = path.resolve(REPO_ROOT, input);
  const relative = path.relative(REPO_ROOT, resolved);
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) throw new PathAuthorityError("REPO_ESCAPE", input, "Path must resolve inside the repository root.");
  return resolved;
}

export function repoRelativeDisplayPath(absolutePath) {
  const resolved = path.resolve(absolutePath);
  const relative = path.relative(REPO_ROOT, resolved);
  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) throw new PathAuthorityError("DISPLAY_REPO_ESCAPE", absolutePath, "Display path must resolve inside the repository root.");
  return relative.split(path.sep).join("/");
}
