import { deserializeWsState } from './wordsearch'

// Fills in any missing fields on a Firestore worksheet document with safe
// defaults, so the editor/preview components always have every key they
// expect regardless of which fields happen to be set on a given doc.
export function normalizeDoc(data) {
  return {
    ageGroup: data.ageGroup,
    weekDate: data.weekDate || '',
    theme: data.theme || '',
    topic: data.topic || '',
    verseText: data.verseText || '',
    verseRef: data.verseRef || '',
    bibleText: data.bibleText || '',
    songTitle: data.songTitle || '',
    song1: data.song1 || '',
    song2: data.song2 || '',
    prayer: data.prayer || '',
    coloringImage: data.coloringImage || null,
    parentTitle: data.parentTitle || '',
    parentB1: data.parentB1 || '',
    parentB2: data.parentB2 || '',
    discuss: data.discuss || '',
    homeworkB1: data.homeworkB1 || '',
    homeworkB2: data.homeworkB2 || '',
    wsWords: data.wsWords || '',
    wsState: deserializeWsState(data.wsState),
  }
}
