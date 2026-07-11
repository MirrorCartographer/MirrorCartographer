export const REQUIRED_RESEARCH_SURFACE_MARKERS = Object.freeze([
  '<title>Mirror Cartographer Research Field</title>',
  'Build theories that can survive contact with evidence.',
  'Theory instrument'
]);

export function inspectResearchSurfaceIdentity(body, { status = 200, resolvedUrl = null } = {}) {
  const source = typeof body === 'string' ? body : '';
  const missingMarkers = REQUIRED_RESEARCH_SURFACE_MARKERS.filter((marker) => !source.includes(marker));
  const validStatus = Number.isInteger(status) && status >= 200 && status < 400;
  return {
    schema_version: '1.0.0',
    resolved_url: resolvedUrl,
    status,
    valid_status: validStatus,
    missing_markers: missingMarkers,
    ok: validStatus && missingMarkers.length === 0
  };
}
