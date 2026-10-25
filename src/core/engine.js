import { readFileSync } from 'node:fs';
import { normalize } from './normalize.js';

// Ordered from least to most severe.
export const LEVELS = ['support', 'moderate', 'high', 'critical'];

// A prompt starting with this prefix is sent despite High findings.
export const OVERRIDE_PREFIX = '!jassume';

const rank = (level) => LEVELS.indexOf(level);

function assertLevel(level, ruleId) {
  if (!LEVELS.includes(level)) {
    throw new Error(`Rule "${ruleId}": unknown level "${level}"`);
  }
}

export function compileRuleSet(raw) {
  const compile = (source) => new RegExp(source, 'u');
  const rules = raw.rules.map((rule) => {
    assertLevel(rule.level, rule.id);
    if (!rule.anyOf?.length && !rule.allOf?.length) {
      throw new Error(`Rule "${rule.id}": needs anyOf or allOf`);
    }
    if (rule.unless) assertLevel(rule.unlessLevel, rule.id);
    return {
      id: rule.id,
      category: rule.category,
      level: rule.level,
      anyOf: (rule.anyOf ?? []).map(compile),
      allOf: (rule.allOf ?? []).map(compile),
      unless: rule.unless ? compile(rule.unless) : null,
      unlessLevel: rule.unlessLevel ?? null,
    };
  });
  return { provider: raw.provider, policyUrl: raw.policyUrl, rules };
}

export function loadRuleSet(provider = 'anthropic') {
  if (!/^[a-z0-9-]+$/.test(provider)) {
    throw new Error(`Invalid provider name "${provider}"`);
  }
  const url = new URL(`../../rules/${provider}.json`, import.meta.url);
  return compileRuleSet(JSON.parse(readFileSync(url, 'utf8')));
}

// A rule matches when one of its anyOf patterns and all of its allOf
// patterns match. Its unless pattern lowers the level instead of
// cancelling the finding.
export function analyze(text, ruleSet) {
  const normalized = normalize(text);
  const findings = [];
  for (const rule of ruleSet.rules) {
    const anyMatch = rule.anyOf.length === 0 || rule.anyOf.some((re) => re.test(normalized));
    const allMatch = rule.allOf.every((re) => re.test(normalized));
    if (!anyMatch || !allMatch) continue;
    const level = rule.unless?.test(normalized) ? rule.unlessLevel : rule.level;
    findings.push({ ruleId: rule.id, category: rule.category, level });
  }
  const level = findings.reduce(
    (top, finding) => (rank(finding.level) > rank(top) ? finding.level : top),
    null,
  );
  return { findings, level };
}

// Critical findings always block. High findings block unless the user
// resent the prompt with the override prefix.
export function check(prompt, ruleSet) {
  const overridden = prompt.trimStart().toLowerCase().startsWith(OVERRIDE_PREFIX);
  const { findings, level } = analyze(prompt, ruleSet);
  const blocks = findings.some(
    (finding) => finding.level === 'critical' || (finding.level === 'high' && !overridden),
  );
  return { action: blocks ? 'block' : 'allow', level, findings, overridden };
}
