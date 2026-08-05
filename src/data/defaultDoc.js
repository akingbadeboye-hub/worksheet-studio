export function defaultDoc(ageGroup) {
  const today = new Date().toISOString().slice(0, 10)
  const base = {
    ageGroup,
    weekDate: today,
    theme: 'Walking With Jesus',
    topic: 'Heroes of the Walk – Name of Hero',
    bibleText: ageGroup === 'young' ? 'Genesis 6:9; 7:1' : 'Genesis 6:9-14; 7:1',
    prayer: ageGroup === 'young'
      ? 'Dear God, help me be kind and listen to You, just like Noah. Amen.'
      : 'Dear Lord, give me the courage to walk with You, even when the crowd walks the other way. Help me to be blameless and faithful. Amen.',
  }

  if (ageGroup === 'young') {
    return {
      ...base,
      verseText: '"Noah walked faithfully with God."',
      verseRef: '— Genesis 6:9',
      songTitle: 'Rise and Shine (Arky Arky)',
      song1: "The Lord told Noah there's going to be a floody, floody. Get those children out of the muddy, muddy — children of the Lord.",
      song2: 'So rise and shine, and give God the glory, glory! The animals came in by twosies, twosies — children of the Lord.',
      coloringImage: null,
      parentTitle: '"Boats"',
      parentB1: 'Build a "boat" with pillows in your living room and read Genesis 6 together.',
      parentB2: 'Read the memory verse with your child every morning and bedtime.',
    }
  }

  return {
    ...base,
    verseText: '"Noah was a righteous man, blameless among the people of his time, and he walked faithfully with God."',
    verseRef: '— Genesis 6:9',
    songTitle: 'Oceans (Where Feet May Fail)',
    song1: 'You call me out upon the waters, the great unknown where feet may fail — and there I find You in the mystery.',
    song2: 'Spirit lead me where my trust is without borders; let me walk upon the waters, wherever You would call me.',
    discuss: 'What are some "cultural pressures" we face today? Brainstorm ways your family can choose to "walk with God" instead of following the crowd.',
    homeworkB1: 'Write down one area of your life where you feel pressure to "fit in" and pray for strength to stand for God instead.',
    homeworkB2: 'Read one (1) chapter of the Bible daily.',
    wsWords: 'NOAH, ARK, BOAT, WALK, RAINBOW, BUILD, FAITH, RAIN, GOD, OBEY, STAND, SAFE',
    wsState: null,
  }
}
