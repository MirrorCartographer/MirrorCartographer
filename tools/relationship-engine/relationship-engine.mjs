/**
 * Mirror Cartographer: deterministic relationship-structure engine.
 * Ranks candidate bridge nodes; does not infer causation or truth.
 */
export function analyzeGraph(graph) {
  if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) throw new TypeError('graph.nodes and graph.edges must be arrays');
  const nodes = new Map();
  for (const node of graph.nodes) {
    if (!node.id || nodes.has(node.id)) throw new Error(`missing or duplicate node id: ${node.id}`);
    nodes.set(node.id, { ...node, domain: node.domain ?? 'unclassified' });
  }
  const adjacency = new Map([...nodes.keys()].map(id => [id, new Set()]));
  for (const edge of graph.edges) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) throw new Error(`edge references unknown node: ${edge.from} -> ${edge.to}`);
    if (edge.from === edge.to) continue;
    if (!['observed', 'supported'].includes(edge.status)) continue;
    adjacency.get(edge.from).add(edge.to); adjacency.get(edge.to).add(edge.from);
  }
  const ids = [...nodes.keys()], centrality = new Map(ids.map(id => [id, 0]));
  // Brandes betweenness centrality for an unweighted, undirected graph.
  for (const source of ids) {
    const stack = [], predecessors = new Map(ids.map(id => [id, []]));
    const sigma = new Map(ids.map(id => [id, 0])), distance = new Map(ids.map(id => [id, -1]));
    sigma.set(source, 1); distance.set(source, 0); const queue = [source];
    while (queue.length) {
      const v = queue.shift(); stack.push(v);
      for (const w of adjacency.get(v)) {
        if (distance.get(w) < 0) { queue.push(w); distance.set(w, distance.get(v) + 1); }
        if (distance.get(w) === distance.get(v) + 1) { sigma.set(w, sigma.get(w) + sigma.get(v)); predecessors.get(w).push(v); }
      }
    }
    const delta = new Map(ids.map(id => [id, 0]));
    while (stack.length) {
      const w = stack.pop();
      for (const v of predecessors.get(w)) delta.set(v, delta.get(v) + (sigma.get(v) / sigma.get(w)) * (1 + delta.get(w)));
      if (w !== source) centrality.set(w, centrality.get(w) + delta.get(w));
    }
  }
  const n = ids.length, norm = n > 2 ? 1 / ((n - 1) * (n - 2)) : 0;
  const results = ids.map(id => {
    const neighbors = [...adjacency.get(id)], domains = [...new Set(neighbors.map(x => nodes.get(x).domain))].sort();
    const betweenness = Number((centrality.get(id) * norm).toFixed(4));
    return { id, label: nodes.get(id).label ?? id, domain: nodes.get(id).domain, degree: neighbors.length,
      neighboringDomains: domains, crossDomainReach: domains.length, betweenness,
      candidateBridge: domains.length >= 2 && betweenness > 0,
      interpretation: domains.length >= 2 && betweenness > 0 ? 'structural bridge candidate; inspect evidence and rival explanations' : 'no cross-domain bridge signal under this graph and relation filter' };
  }).sort((a,b) => b.betweenness-a.betweenness || b.crossDomainReach-a.crossDomainReach || a.id.localeCompare(b.id));
  return { graph: { nodeCount:n, acceptedEdgeCount:graph.edges.filter(e=>['observed','supported'].includes(e.status)).length,
      excludedEdgeCount:graph.edges.filter(e=>!['observed','supported'].includes(e.status)).length },
    candidates:results.filter(x=>x.candidateBridge), nodes:results,
    limits:['Topology is not causality.','A bridge score depends on sampling, node definitions, relation selection, and graph completeness.',
      'Hypothesis and speculative edges are excluded from structural scoring.','A missing edge is not evidence that no relationship exists.'] };
}
