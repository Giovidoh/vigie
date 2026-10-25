import { OVERRIDE_PREFIX } from './engine.js';

const TEXT = {
  en: {
    categories: {
      'child-safety': 'child safety',
      'sexual-content': 'sexually explicit content',
      'cbrn-weapons': 'chemical, biological, radiological or nuclear weapons',
      weapons: 'explosives and weapons',
      malware: 'malicious software',
      'safeguard-circumvention': "circumventing the assistant's safeguards",
      fraud: 'fraud and deception',
      surveillance: 'privacy and surveillance',
      violence: 'harm to others',
      'self-harm': 'personal distress',
    },
    blockedCritical: (cats, provider) =>
      `Vigie blocked this prompt (category: ${cats}).\n` +
      `The provider's usage policy (${provider}) prohibits this content in every context. The prompt was not sent.`,
    blockedHigh: (cats, provider) =>
      `Vigie blocked this prompt (category: ${cats}).\n` +
      `The provider's usage policy (${provider}) restricts this content. The prompt was not sent.\n` +
      `If your use is legitimate, resend it starting with ${OVERRIDE_PREFIX}.`,
    policy: (url) => `Usage policy: ${url}`,
    overridden: (cats) => `Vigie: prompt sent at your request despite the category: ${cats}.`,
    moderate: (cats) => `Vigie: sensitive topic under the usage policy (category: ${cats}). The prompt was sent.`,
    support:
      'If you are going through a hard time, you can find a free, confidential helpline near you at https://findahelpline.com.',
    supportSent: 'Your message was sent normally.',
    unavailable: 'Vigie: analysis unavailable. The prompt was sent without being checked.',
  },
  fr: {
    categories: {
      'child-safety': "protection de l'enfance",
      'sexual-content': 'contenu sexuel explicite',
      'cbrn-weapons': 'armes chimiques, biologiques, radiologiques ou nucléaires',
      weapons: 'explosifs et armes',
      malware: 'logiciels malveillants',
      'safeguard-circumvention': "contournement des protections de l'assistant",
      fraud: 'fraude et tromperie',
      surveillance: 'vie privée et surveillance',
      violence: 'atteinte à autrui',
      'self-harm': 'détresse personnelle',
    },
    blockedCritical: (cats, provider) =>
      `Vigie a bloqué ce prompt (catégorie : ${cats}).\n` +
      `La politique d'usage du fournisseur (${provider}) interdit ce contenu dans tous les contextes. Le prompt n'a pas été envoyé.`,
    blockedHigh: (cats, provider) =>
      `Vigie a bloqué ce prompt (catégorie : ${cats}).\n` +
      `La politique d'usage du fournisseur (${provider}) restreint ce contenu. Le prompt n'a pas été envoyé.\n` +
      `Si votre usage est légitime, renvoyez-le en le commençant par ${OVERRIDE_PREFIX}.`,
    policy: (url) => `Politique d'usage : ${url}`,
    overridden: (cats) => `Vigie : prompt envoyé à votre demande malgré la catégorie : ${cats}.`,
    moderate: (cats) =>
      `Vigie : sujet sensible au regard de la politique d'usage (catégorie : ${cats}). Le prompt a été envoyé.`,
    support:
      'Si vous traversez un moment difficile, vous pouvez appeler le 3114 (numéro national de prévention du suicide, gratuit, 24 h/24).',
    supportSent: 'Votre message a été envoyé normalement.',
    unavailable: 'Vigie : analyse indisponible. Le prompt a été envoyé sans vérification.',
  },
};

export function resolveLanguage(env = process.env) {
  const tag = env.VIGIE_LANG || Intl.DateTimeFormat().resolvedOptions().locale || 'en';
  return tag.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function unavailableMessage(lang) {
  return TEXT[lang].unavailable;
}

// Turns a check result into the text shown to the user: a reason when
// the prompt is blocked, a notice when it is sent with a warning.
export function formatResult(result, ruleSet, lang) {
  const t = TEXT[lang];
  const categories = (level) => {
    const names = result.findings
      .filter((finding) => finding.level === level)
      .map((finding) => t.categories[finding.category] ?? finding.category);
    return [...new Set(names)].join(', ');
  };
  const has = (level) => result.findings.some((finding) => finding.level === level);
  const support = has('support') ? t.support : null;

  if (result.action === 'block') {
    const lines = has('critical')
      ? [t.blockedCritical(categories('critical'), ruleSet.provider)]
      : [t.blockedHigh(categories('high'), ruleSet.provider)];
    lines.push(t.policy(ruleSet.policyUrl));
    if (support) lines.push(support);
    return { reason: lines.join('\n') };
  }

  const lines = [];
  if (has('high')) lines.push(t.overridden(categories('high')));
  if (has('moderate')) lines.push(t.moderate(categories('moderate')));
  if (support) lines.push(support, t.supportSent);
  return lines.length ? { notice: lines.join('\n') } : {};
}
