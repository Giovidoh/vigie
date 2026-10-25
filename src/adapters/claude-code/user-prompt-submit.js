#!/usr/bin/env node
// Claude Code UserPromptSubmit hook: checks the prompt before it is sent.
import { readFileSync } from 'node:fs';
import { check, loadRuleSet } from '../../core/engine.js';
import { formatResult, resolveLanguage, unavailableMessage } from '../../core/messages.js';

const lang = resolveLanguage();
let output = null;

try {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const ruleSet = loadRuleSet();
  const result = check(String(input.prompt ?? ''), ruleSet);
  const { reason, notice } = formatResult(result, ruleSet, lang);
  if (result.action === 'block') output = { decision: 'block', reason };
  else if (notice) output = { systemMessage: notice };
} catch {
  // Fail open: a broken check must never stop the user from working.
  output = { systemMessage: unavailableMessage(lang) };
}

if (output) process.stdout.write(JSON.stringify(output));
