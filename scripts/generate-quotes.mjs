import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const topicsPath = fileURLToPath(
  new URL('../src/assets/db/topics.json', import.meta.url),
);
const quotesPath = fileURLToPath(
  new URL('../src/assets/db/quotes.json', import.meta.url),
);

const topics = JSON.parse(readFileSync(topicsPath, 'utf8'));

const actions = {
  motivation: 'take one more meaningful step',
  'self-love': 'treat yourself with compassion and respect',
  peace: 'return to a calmer state of mind',
  confidence: 'trust your ability to learn as you go',
  focus: 'give your attention to what matters now',
  resilience: 'keep moving through a difficult moment',
  relationships: 'build connection with care and honesty',
  'personal-growth': 'grow beyond an old version of yourself',
  healing: 'give healing the time and honesty it needs',
  gratitude: 'notice the good that is already here',
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
  { background: '#27313D', text: '#F4F6F9' },
  { background: '#3D3444', text: '#FFF7FC' },
  { background: '#30413C', text: '#F3FFF9' },
  { background: '#463B31', text: '#FFF9F1' },
  { background: '#253B4A', text: '#F2FAFF' },
];

const quoteFont = 'Lora-SemiBold';

const alignments = ['left', 'center'];
const decorations = ['block', 'classic', 'compact', 'soft', 'round'];
const updatedAt = '2026-08-10T00:00:00Z';
const quotes = [];

for (const topic of topics) {
    const action = actions[topic.id];

    if (!action) {
      throw new Error(`Missing writing direction for ${topic.id}`);
    }

    for (let openingIndex = 0; openingIndex < openings.length; openingIndex += 1) {
      for (let endingIndex = 0; endingIndex < endings.length; endingIndex += 1) {
        const number = openingIndex * endings.length + endingIndex + 1;
        const palette = palettes[(number - 1) % palettes.length];
        const text = `${openings[openingIndex](action)} ${endings[endingIndex]}`;
        const fontSize = text.length > 120 ? 24 : text.length > 95 ? 26 : 29;
        const textAlign = alignments[(number - 1) % alignments.length];

        quotes.push({
          id: `${topic.id}-${String(number).padStart(3, '0')}`,
          type: 'text',
          text,
          topicIds: [topic.id],
          author: {
            name: '',
          },
          style: {
            color: palette.text,
            fontFamily: quoteFont,
            fontSize,
            lineHeight: Math.round(fontSize * 1.35),
            textAlign,
          },
          segments: [{ text }],
          decoration: decorations[(number - 1) % decorations.length],
          backgroundColor: palette.background,
          backgroundImageUrl: null,
          imageUrl: null,
          updatedAt,
        });
      }
    }
}

writeFileSync(quotesPath, `${JSON.stringify(quotes, null, 2)}\n`);
console.log(`Generated ${quotes.length} original quotes across ${topics.length} topics`);
