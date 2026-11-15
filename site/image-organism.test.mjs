import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const html = readFileSync(new URL("./image-organism.html", import.meta.url), "utf8");

test("Image Organism has the complete generation and export surface", () => {
  for (const id of ["prompt", "style", "format", "seed", "density", "fracture", "depth", "grain", "generate", "mutate", "newSeed", "save", "exportSvg", "exportPng", "downloadSpec", "canvas", "saved"]) {
    assert.match(html, new RegExp('id="' + id + '"'), "missing control: " + id);
  }
  assert.match(html, /function makeSvg\(s\)/);
  assert.match(html, /image\/svg\+xml/);
  assert.match(html, /image\/png/);
  assert.match(html, /localStorage\.setItem\('mcImageOrganism'/);
});

test("inline engine JavaScript parses without executing browser effects", () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
  assert.equal(scripts.length, 1, "expected one self-contained engine script");
  assert.doesNotThrow(() => new Function(scripts[0]));
});
