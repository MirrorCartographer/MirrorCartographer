import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_REPAIR_CATEGORY_MAP_PATH,
  RepairCategoryMapError,
  assertValidRepairCategoryMap,
  categoryForValidatorKeyword,
  loadRepairCategoryMap,
} from "./repair-category-map-loader.mjs";

test("loads the governed repair category map and builds stable indexes", () => {
  const loaded = loadRepairCategoryMap(DEFAULT_REPAIR_CATEGORY_MAP_PATH);
  assert.equal(loaded.map.schema_version, "repair-category-map.v1");
  assert.ok(loaded.indexes.categoriesById.missing_required_field);
  assert.equal(loaded.indexes.mappingsByKeyword.required.canonical_category_id, "missing_required_field");
  assert.deepEqual([...loaded.indexes.activeCategoryIds], [...loaded.indexes.activeCategoryIds].sort());
});

test("maps known and unknown validator keywords through the same governed source", () => {
  const loaded = loadRepairCategoryMap();
  const known = categoryForValidatorKeyword("required", loaded);
  const unknown = categoryForValidatorKeyword("futureValidatorKeyword", loaded);

  assert.equal(known.category.category_id, "missing_required_field");
  assert.equal(unknown.category.category_id, "unmapped_validator_signal");
  assert.equal(unknown.mapping.validator_keyword, "unknown");
});

test("rejects mappings that point at unknown categories", () => {
  const loaded = loadRepairCategoryMap();
  const broken = structuredClone(loaded.map);
  broken.keyword_mappings = [
    ...broken.keyword_mappings,
    {
      validator_keyword: "brokenKeyword",
      canonical_category_id: "not_a_real_category",
      mapping_confidence: "boundary",
      notes: "intentional test failure",
    },
  ];

  assert.throws(() => assertValidRepairCategoryMap(broken), (error) => {
    assert.ok(error instanceof RepairCategoryMapError);
    assert.equal(error.code, "UNKNOWN_CATEGORY_REFERENCE");
    return true;
  });
});

test("rejects duplicate validator keyword mappings", () => {
  const loaded = loadRepairCategoryMap();
  const broken = structuredClone(loaded.map);
  broken.keyword_mappings.push({ ...broken.keyword_mappings[0] });

  assert.throws(() => assertValidRepairCategoryMap(broken), (error) => {
    assert.ok(error instanceof RepairCategoryMapError);
    assert.equal(error.code, "DUPLICATE_KEYWORD_MAPPING");
    return true;
  });
});
