import {readFile} from 'node:fs/promises';

// Missing scope means the historical full audit. An explicitly supplied corrupt
// scope is an error, never a silently empty or reduced audit.
export function integrationScope(config, impact = null) {
  const all = config.targets || config.representatives;
  if (!Array.isArray(all) || !all.length || new Set(all).size !== all.length) throw Error('Invalid integration targets');
  if (!impact) return {scope: 'all', targets: all};
  if (!['all', 'selected'].includes(impact.scope) || !Array.isArray(impact.affectedTargets)) throw Error('Invalid article impact report');
  const selected = impact.affectedTargets;
  if (!selected.length || new Set(selected).size !== selected.length || selected.some(p => !all.includes(p))) throw Error('Invalid impact target coverage');
  if (impact.scope === 'all' && (selected.length !== all.length || all.some(p => !selected.includes(p)))) throw Error('Incomplete full impact coverage');
  return {scope: impact.scope, targets: all.filter(p => selected.includes(p))};
}
export async function loadIntegrationScope(config) {
  const path = process.env.ARTICLE_IMPACT_FILE;
  return integrationScope(config, path ? JSON.parse(await readFile(path, 'utf8')) : null);
}
export function integrationWidths(config, path, scope) {
  return scope === 'selected' || config.representatives.includes(path) ? [320,390,768,1024,1440] : [390,768,1440];
}
export function integrationSuffix(shardIndex, shardCount, explicitShard = process.env.REVIEW_SHARD_COUNT !== undefined) {
  return explicitShard || shardCount > 1 ? '-shard-' + shardIndex : '';
}
