import test from "node:test";
import assert from "node:assert/strict";
import { assertSafeRepoRelativePath, repoRelativeDisplayPath, REPO_ROOT } from "./path-authority.mjs";

test("accepts repo-relative JSON path", () => {
  const resolved = assertSafeRepoRelativePath("mind/schemas/canonical-validation-error.v1.schema.json", { mustEndWith: ".json" });
  assert.ok(resolved.startsWith(REPO_ROOT));
});

test("rejects absolute paths", () => {
  assert.throws(() => assertSafeRepoRelativePath("/tmp/schema.json"), /ABSOLUTE_PATH/);
});

test("rejects URL-shaped paths before validation", () => {
  assert.throws(() => assertSafeRepoRelativePath("file:///tmp/schema.json"), /URL_OR_DRIVE_PATH/);
  assert.throws(() => assertSafeRepoRelativePath("https://example.com/schema.json"), /URL_OR_DRIVE_PATH/);
});

test("rejects parent traversal outside the repo", () => {
  assert.throws(() => assertSafeRepoRelativePath("../../schema.json"), /REPO_ESCAPE/);
});

test("rejects Windows separators for stable report paths", () => {
  assert.throws(() => assertSafeRepoRelativePath("mind\\schemas\\x.json"), /WINDOWS_SEPARATOR/);
});

test("normalizes display paths to forward slashes", () => {
  const resolved = assertSafeRepoRelativePath("tools/agency-validation/path-authority.mjs");
  assert.equal(repoRelativeDisplayPath(resolved), "tools/agency-validation/path-authority.mjs");
});
