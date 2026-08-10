import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const categoriesPath = fileURLToPath(
  new URL('../src/assets/db/categories.json', import.meta.url),
);
const quotesPath = fileURLToPath(
  new URL('../src/assets/db/quotes.json', import.meta.url),
);

const categoryGroups = JSON.parse(readFileSync(categoriesPath, 'utf8'));

const actions = {
  'keep-going': 'take one more step',
  'starting-again': 'begin again with what you know now',
  'difficult-days': 'meet a difficult day with kindness',
  'positive-thinking': 'make room for a hopeful thought',
  'never-give-up': 'keep trying when the path feels slow',
  courage: 'move with fear instead of waiting for it to disappear',
  'personal-growth': 'grow beyond an old version of yourself',
  confidence: 'trust your ability to learn as you go',
  discipline: 'do what matters even when motivation is quiet',
  consistency: 'return to the work with steady effort',
  habits: 'repeat a small choice that serves you',
  'self-love': 'treat yourself with the love you freely give others',
  'self-respect': 'honor your needs without apology',
  boundaries: 'protect your peace with a clear boundary',
  'knowing-your-worth': 'remember that your worth is not up for debate',
  'choosing-yourself': 'choose yourself without abandoning your compassion',
  healing: 'give healing the time and honesty it needs',
  'moving-on': 'move forward without denying what mattered',
  'letting-go': 'release what no longer belongs in your future',
  heartbreak: 'carry a tender heart through loss',
  'walking-away': 'walk away from what keeps diminishing you',
  'starting-over': 'build again from a wiser foundation',
  overthinking: 'return from your thoughts to the present moment',
  'inner-peace': 'protect the quiet within you',
  calm: 'slow down before choosing your response',
  rest: 'allow yourself to rest without earning it first',
  mindfulness: 'notice this moment without trying to change it',
  gratitude: 'notice the good that is already here',
  'healthy-love': 'choose love that feels safe, honest, and mutual',
  breakups: 'accept the ending without losing yourself',
  friendship: 'show up for friendship with care and honesty',
  trust: 'build trust through truth and consistent action',
  relationships: 'make room for two whole people in a relationship',
  focus: 'give your full attention to what matters now',
  productivity: 'turn intention into one useful action',
  ambition: 'pursue a meaningful goal without losing yourself',
  success: 'define success by values as well as results',
  'life-lessons': 'let experience make you wiser rather than harder',
  change: 'welcome change without needing every answer',
  time: 'spend your time on what deserves your life',
  philosophy: 'question deeply while living simply',
  purpose: 'follow the work that gives your effort meaning',
};

const openings = [
  action => `Each time you ${action},`,
  action => `When you ${action},`,
  action => `Learning to ${action}`,
  action => `Choosing to ${action}`,
  action => `The moment you ${action},`,
  action => `Give yourself permission to ${action};`,
  action => `It takes quiet strength to ${action}, and`,
  action => `Even a small decision to ${action}`,
  action => `Your willingness to ${action}`,
  action => `Today is a good day to ${action};`,
];

const endings = [
  'you teach your future self what is possible.',
  'progress begins before confidence arrives.',
  'the smallest honest effort still counts.',
  'you make space for a life that feels more like yours.',
  'clarity grows from the step directly in front of you.',
  'steady intention becomes stronger than uncertainty.',
  'you honor both where you are and where you are going.',
  'change starts quietly before it becomes visible.',
  'you do not need perfection to create momentum.',
  'today becomes part of the story you are building.',
];

const palettes = [
  { background: '#27313D', text: '#F4F6F9', accent: '#B5C2D4' },
  { background: '#3D3444', text: '#FFF7FC', accent: '#E8C5DC' },
  { background: '#30413C', text: '#F3FFF9', accent: '#B8D8CA' },
  { background: '#463B31', text: '#FFF9F1', accent: '#E5C9A8' },
  { background: '#253B4A', text: '#F2FAFF', accent: '#AFCFE3' },
];

const fonts = [
  'DMSerifDisplay-Regular',
  'LibreBaskerville-Regular',
  'Lora-SemiBold',
  'PlayfairDisplay-SemiBold',
  'CormorantGaramond-SemiBold',
];

const alignments = ['left', 'center', 'right'];
const symbolAlignments = ['left', 'center', 'right'];
const updatedAt = '2026-08-10T00:00:00Z';
const quotes = [];

for (const group of categoryGroups) {
  for (const category of group.categories) {
    const action = actions[category.id];

    if (!action) {
      throw new Error(`Missing writing direction for ${category.id}`);
    }

    for (let openingIndex = 0; openingIndex < openings.length; openingIndex += 1) {
      for (let endingIndex = 0; endingIndex < endings.length; endingIndex += 1) {
        const number = openingIndex * endings.length + endingIndex + 1;
        const palette = palettes[(number - 1) % palettes.length];
        const text = `${openings[openingIndex](action)} ${endings[endingIndex]}`;
        const fontSize = text.length > 120 ? 27 : text.length > 95 ? 29 : 32;
        const textAlign = alignments[(number - 1) % alignments.length];

        quotes.push({
          id: `${category.id}-${String(number).padStart(3, '0')}`,
          type: 'text',
          text,
          category: category.id,
          author: {
            name: '',
            style: {
              color: palette.accent,
              fontFamily: 'Manrope-SemiBold',
              fontSize: 16,
              lineHeight: 23,
              textAlign,
            },
          },
          style: {
            color: palette.text,
            fontFamily: fonts[(number - 1) % fonts.length],
            fontSize,
            lineHeight: fontSize + 12,
            textAlign,
          },
          segments: [{ text }],
          symbol: {
            icon: `quote-${((number - 1) % 5) + 1}`,
            placement: 'top',
            alignment: symbolAlignments[(number - 1) % symbolAlignments.length],
            size: 54,
          },
          backgroundColor: palette.background,
          backgroundImageUrl: null,
          imageUrl: null,
          updatedAt,
        });
      }
    }
  }
}

writeFileSync(quotesPath, `${JSON.stringify(quotes, null, 2)}\n`);
console.log(`Generated ${quotes.length} original quotes across ${Object.keys(actions).length} categories`);
