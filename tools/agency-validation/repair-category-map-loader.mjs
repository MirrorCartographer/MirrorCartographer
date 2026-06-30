import { loadJsonFile, getAjvSchema } from "./schema-registry.mjs";

export const DEFAULT_REPAIR_CATEGORY_MAP_PATH = "mind/config/repair-category-map.v1.json";
export const REPAIR_CATEGORY_MAP_SCHEMA_ID = "https://mirrorcartographer.dev/schemas/repair-category-map.v1.schema.json";

export class RepairCategoryMapError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "RepairCategoryMapError";
    this.code = code;
    this.details = details;
  }
}

function stableObjectFromEntries(entries) {
  return Object.fromEntries([...entries].sort(([left], [right]) => left.localeCompare(right)));
}

export function assertValidRepairCategoryMap(map, { sourcePath = DEFAULT_REPAIR_CATEGORY_MAP_PATH } = {}) {
  const validate = getAjvSchema(REPAIR_CATEGORY_MAP_SCHEMA_ID);
  if (!validate(map)) {
    throw new RepairCategoryMapError("SCHEMA_INVALID", "Repair category map does not match repair-category-map.v1.schema.json.", {
      sourcePath,
      errors: validate.errors ?? [],
    });
  }

  const categories = new Map();
  for (const category of map.categories) {
    if (categories.has(category.category_id)) {
      throw new RepairCategoryMapError("DUPLICATE_CATEGORY", `Duplicate category_id: ${category.category_id}`, { sourcePath });
    }
    categories.set(category.category_id, category);
  }

  const activeCount = [...categories.values()].filter((category) => category.status === "active").length;
  if (activeCount > map.category_policy.max_active_categories) {
    throw new RepairCategoryMapError("ACTIVE_CATEGORY_LIMIT", "Active category count exceeds category_policy.max_active_categories.", {
      sourcePath,
      activeCount,
      maxActiveCategories: map.category_policy.max_active_categories,
    });
  }

  const keywordMappings = new Map();
  for (const mapping of map.keyword_mappings) {
    if (!categories.has(mapping.canonical_category_id)) {
      throw new RepairCategoryMapError("UNKNOWN_CATEGORY_REFERENCE", `Keyword ${mapping.validator_keyword} references unknown category ${mapping.canonical_category_id}.`, { sourcePath });
    }
    if (keywordMappings.has(mapping.validator_keyword)) {
      throw new RepairCategoryMapError("DUPLICATE_KEYWORD_MAPPING", `Duplicate validator_keyword mapping: ${mapping.validator_keyword}`, { sourcePath });
    }
    keywordMappings.set(mapping.validator_keyword, mapping);
  }

  return map;
}

export function buildRepairCategoryMapIndexes(map) {
  assertValidRepairCategoryMap(map);
  const categoriesById = stableObjectFromEntries(map.categories.map((category) => [category.category_id, category]));
  const mappingsByKeyword = stableObjectFromEntries(map.keyword_mappings.map((mapping) => [mapping.validator_keyword, mapping]));
  const activeCategoryIds = map.categories
    .filter((category) => category.status === "active")
    .map((category) => category.category_id)
    .sort();

  return Object.freeze({
    schemaVersion: map.schema_version,
    categoriesById: Object.freeze(categoriesById),
    mappingsByKeyword: Object.freeze(mappingsByKeyword),
    activeCategoryIds: Object.freeze(activeCategoryIds),
  });
}

export function loadRepairCategoryMap(mapPath = DEFAULT_REPAIR_CATEGORY_MAP_PATH) {
  const map = loadJsonFile(mapPath);
  assertValidRepairCategoryMap(map, { sourcePath: mapPath });
  return Object.freeze({
    sourcePath: mapPath,
    map,
    indexes: buildRepairCategoryMapIndexes(map),
  });
}

export function categoryForValidatorKeyword(validatorKeyword, loadedMap = loadRepairCategoryMap()) {
  const mapping = loadedMap.indexes.mappingsByKeyword[validatorKeyword] ?? loadedMap.indexes.mappingsByKeyword.unknown;
  if (!mapping) {
    throw new RepairCategoryMapError("NO_FALLBACK_MAPPING", "Repair category map must include an unknown fallback mapping.", {
      validatorKeyword,
      sourcePath: loadedMap.sourcePath,
    });
  }
  const category = loadedMap.indexes.categoriesById[mapping.canonical_category_id];
  if (!category) {
    throw new RepairCategoryMapError("BROKEN_MAPPING_INDEX", `Mapping ${validatorKeyword} resolved to missing category ${mapping.canonical_category_id}.`, {
      validatorKeyword,
      sourcePath: loadedMap.sourcePath,
    });
  }
  return { mapping, category };
}
