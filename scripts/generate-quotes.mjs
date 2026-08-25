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

const curatedSelfLoveQuotes = [
  ['You yourself, as much as anybody in the entire universe, deserve your love and affection.', 'Buddha'],
  ['To love oneself is the beginning of a lifelong romance.', 'Oscar Wilde'],
  ['Owning our story and loving ourselves through that process is the bravest thing that we will ever do.', 'Brené Brown'],
  ['How you love yourself is how you teach others to love you.', 'Rupi Kaur'],
  ['Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.', 'Audre Lorde'],
  ['Love yourself and you can heal your life.', 'Louise Hay'],
  ["If you don’t love yourself, how in the hell are you gonna love somebody else?", 'RuPaul'],
  ['The most terrifying thing is to accept oneself completely.', 'Carl Jung'],
  ['Daring to set boundaries is about having the courage to love ourselves even when we risk disappointing others.', 'Brené Brown'],
  ['One of the best guides to how to be self-loving is to give ourselves the love we are often dreaming about receiving from others.', 'bell hooks'],
  ["Until you value yourself, you won’t value your time. Until you value your time, you will not do anything with it.", 'M. Scott Peck'],
  ['To fall in love with yourself is the first secret to happiness.', 'Robert Morley'],
  ['Self-love is not selfish; you cannot truly love another until you know how to love yourself.', 'RuPaul'],
  ['Be faithful to that which exists within yourself.', 'André Gide'],
  ['I must undertake to love myself and to respect myself as though my very life depends upon self-love and self-respect.', 'Maya Angelou'],
  ["Loving yourself isn’t vanity. It’s sanity.", 'Katrina Mayer'],
  ['You are enough just as you are.', 'Meghan Markle'],
  ['If we do not know how to take care of ourselves and to love ourselves, we cannot take care of the people we love.', 'Thich Nhat Hanh'],
  ['Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.', 'Rumi'],
  ['Drop the idea of becoming someone, because you are already a masterpiece.', 'Osho'],
  ['Talk to yourself like you would to someone you love.', 'Brené Brown'],
  ['You are imperfect, permanently and inevitably flawed. And you are beautiful.', 'Amy Bloom'],
  ['The most powerful relationship you will ever have is the relationship with yourself.', 'Steve Maraboli'],
  ['Be yourself; everyone else is already taken.', 'Oscar Wilde'],
  ['Self-care is how you take your power back.', 'Lalah Delia'],
  ["You don’t have to be perfect to be worthy of love.", 'Unknown'],
  ['I now choose to recognize the beauty and magnificence of who I am.', 'Louise Hay'],
  ["To be beautiful means to be yourself. You don’t need to be accepted by others. You need to accept yourself.", 'Thich Nhat Hanh'],
  ['Your relationship with yourself sets the tone for every other relationship you have.', 'Unknown'],
  ['Stop abandoning yourself for the sake of others.', 'Unknown'],
  ['You alone are enough. You have nothing to prove to anybody.', 'Maya Angelou'],
  ['The privilege of a lifetime is being who you are.', 'Joseph Campbell'],
  ["You have been criticizing yourself for years and it hasn’t worked. Try approving of yourself and see what happens.", 'Louise Hay'],
  ['Self-love is the source of all our other loves.', 'Pierre Corneille'],
  ["Don’t forget to love yourself.", 'Søren Kierkegaard'],
  ['When you recover or discover something that nourishes your soul and brings joy, care enough about yourself to make room for it in your life.', 'Jean Shinoda Bolen'],
  ["It is not selfish to love yourself, take care of yourself, and make your happiness a priority. It’s necessary.", 'Mandy Hale'],
  ['Find the love you seek by first finding the love within yourself.', 'Sri Sri Ravi Shankar'],
  ['You are allowed to be both a masterpiece and a work in progress simultaneously.', 'Unknown'],
  ['The greatest gift you can give yourself is a little bit of your own attention.', 'Anthony J. D’Angelo'],
];

const curatedConfidenceQuotes = readFileSync(
  fileURLToPath(new URL('../src/assets/db/confidence-quotes.txt', import.meta.url)),
  'utf8',
).trim().split('\n').map(line => {
  const [text, author] = line.split('” — ');
  return [text.replace(/^“/, ''), author.startsWith('(') ? 'Unknown' : author];
});

const curatedFocusQuotes = readFileSync(
  fileURLToPath(new URL('../src/assets/db/focus-quotes.txt', import.meta.url)),
  'utf8',
).trim().split('\n').map(line => {
  const [text, author] = line.split('” — ');
  return [text.replace(/^“/, ''), author];
});

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

const firstSelfLoveIndex = quotes.findIndex(quote => quote.topicIds[0] === 'self-love');
quotes.splice(firstSelfLoveIndex, 100);

const selfLoveQuotes = curatedSelfLoveQuotes.map(([text, author], index) => {
  const number = index + 1;
  const palette = palettes[index % palettes.length];
  const fontSize = text.length > 120 ? 24 : text.length > 95 ? 26 : 29;

  return {
    id: `self-love-${String(number).padStart(3, '0')}`,
    type: 'text',
    text,
    topicIds: ['self-love'],
    author: { name: author },
    style: {
      color: palette.text,
      fontFamily: quoteFont,
      fontSize,
      lineHeight: Math.round(fontSize * 1.35),
      textAlign: alignments[index % alignments.length],
    },
    segments: [{ text }],
    decoration: decorations[index % decorations.length],
    backgroundColor: palette.background,
    backgroundImageUrl: null,
    imageUrl: null,
    updatedAt: '2026-08-17T00:00:00Z',
  };
});

quotes.splice(firstSelfLoveIndex, 0, ...selfLoveQuotes);

const firstConfidenceIndex = quotes.findIndex(quote => quote.topicIds[0] === 'confidence');
const confidenceQuotes = curatedConfidenceQuotes.map(([text, author], index) => {
  const template = selfLoveQuotes[index % selfLoveQuotes.length];
  const fontSize = text.length > 120 ? 24 : text.length > 95 ? 26 : 29;

  return {
    ...template,
    id: 'confidence-' + String(index + 1).padStart(3, '0'),
    text,
    topicIds: ['confidence'],
    author: { name: author },
    style: {
      ...template.style,
      fontSize,
      lineHeight: Math.round(fontSize * 1.35),
    },
    segments: [{ text }],
  };
});
quotes.splice(firstConfidenceIndex, 100, ...confidenceQuotes);

const firstFocusIndex = quotes.findIndex(quote => quote.topicIds[0] === 'focus');
const focusQuotes = curatedFocusQuotes.map(([text, author], index) => {
  const template = selfLoveQuotes[index % selfLoveQuotes.length];
  const fontSize = text.length > 120 ? 24 : text.length > 95 ? 26 : 29;

  return {
    ...template,
    id: 'focus-' + String(index + 1).padStart(3, '0'),
    text,
    topicIds: ['focus'],
    author: { name: author },
    style: {
      ...template.style,
      fontSize,
      lineHeight: Math.round(fontSize * 1.35),
    },
    segments: [{ text }],
  };
});
quotes.splice(firstFocusIndex, 100, ...focusQuotes);

const quoteBackground = '#242424';
const quoteTextColor = '#FAFAFC';

for (const quote of quotes) {
  const fontSize =
    quote.text.length > 160
      ? 23
      : quote.text.length > 115
        ? 25
        : quote.text.length > 75
          ? 28
          : 31;

  quote.backgroundColor = quoteBackground;
  quote.style = {
    color: quoteTextColor,
    fontFamily: quoteFont,
    fontSize,
    lineHeight: Math.round(fontSize * 1.38),
    textAlign: 'center',
  };
  quote.updatedAt = '2026-08-25T00:00:00Z';
}

writeFileSync(quotesPath, `${JSON.stringify(quotes, null, 2)}\n`);
console.log(`Generated ${quotes.length} original quotes across ${topics.length} topics`);
