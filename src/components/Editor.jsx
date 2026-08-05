import { useEffect, useMemo, useRef } from 'react'
import WorksheetPage from './WorksheetPage'
import { buildWordsearch, parseWords } from '../utils/wordsearch'
import { defaultDoc } from '../data/defaultDoc'

const FIELD_KEYS = [
  'theme', 'topic', 'verseText', 'verseRef', 'bibleText',
  'songTitle', 'song1', 'song2', 'prayer',
  'parentTitle', 'parentB1', 'parentB2',
  'discuss', 'homeworkB1', 'homeworkB2',
]

function makeRefBag() {
  const bag = {}
  FIELD_KEYS.forEach(k => { bag[k] = { current: null } })
  return bag
}

export default function Editor({ editState, onSave, status }) {
  const {
    ageTab, setAgeTab,
    weekDate, setWeekDate,
    youngInitial, olderInitial,
    youngResetToken, olderResetToken,
    youngImage, setYoungImage,
    olderWsWords, setOlderWsWords,
    olderWsState, setOlderWsState,
    editingId, resetDoc,
  } = editState

  const youngRefs = useMemo(makeRefBag, [])
  const olderRefs = useMemo(makeRefBag, [])
  const lastWsSize = useRef({ w: 700, h: 420 })

  function regenerate(size) {
    const box = size || lastWsSize.current
    const words = parseWords(olderWsWords)
    setOlderWsState(buildWordsearch(words, box.w, box.h))
  }

  function handleWsSize(w, h) {
    if (w > 50 && h > 50) lastWsSize.current = { w, h }
    if (!olderWsState && w > 50 && h > 50) regenerate({ w, h })
  }

  // Covers the cases where wsState was cleared (New) or a doc without a
  // saved grid was loaded, while the wordsearch panel may still be hidden
  // (e.g. the 0-5 tab is active) — falls back to the last known good size
  // instead of a 0x0 measurement from a display:none container.
  useEffect(() => {
    if (!olderWsState) regenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [olderResetToken, olderWsState])

  function collectField(refs, key) {
    return (refs[key].current?.textContent || '').trim()
  }

  function handleSave() {
    const age = ageTab
    const refs = age === 'young' ? youngRefs : olderRefs
    const common = {
      ageGroup: age,
      weekDate: weekDate,
      theme: collectField(refs, 'theme'),
      topic: collectField(refs, 'topic'),
      verseText: collectField(refs, 'verseText'),
      verseRef: collectField(refs, 'verseRef'),
      bibleText: collectField(refs, 'bibleText'),
      songTitle: collectField(refs, 'songTitle'),
      song1: collectField(refs, 'song1'),
      song2: collectField(refs, 'song2'),
      prayer: collectField(refs, 'prayer'),
    }
    const payload = age === 'young'
      ? {
          ...common,
          coloringImage: youngImage,
          parentTitle: collectField(refs, 'parentTitle'),
          parentB1: collectField(refs, 'parentB1'),
          parentB2: collectField(refs, 'parentB2'),
        }
      : {
          ...common,
          discuss: collectField(refs, 'discuss'),
          homeworkB1: collectField(refs, 'homeworkB1'),
          homeworkB2: collectField(refs, 'homeworkB2'),
          wsWords: olderWsWords,
          wsState: olderWsState,
        }
    onSave(age, payload, editingId[age])
  }

  return (
    <>
      <div className="toolbar">
        <button className={`tab-btn ${ageTab === 'young' ? 'active' : ''}`} onClick={() => setAgeTab('young')}>0–5 years</button>
        <button className={`tab-btn ${ageTab === 'older' ? 'active' : ''}`} onClick={() => setAgeTab('older')}>6–12 years</button>
        <span className="field-inline">
          Week of: <input type="date" className="field-inline-input" value={weekDate} onChange={e => setWeekDate(e.target.value)} />
        </span>
        {ageTab === 'older' && (
          <button className="btn btn-teal" onClick={() => regenerate()} type="button">🔍 Regenerate wordsearch</button>
        )}
        <button className="btn btn-primary" onClick={handleSave} type="button">💾 Save to Library</button>
        <button className="btn btn-ghost" onClick={() => resetDoc(ageTab)} type="button">➕ New (clear form)</button>
        <button className="btn btn-ghost" onClick={() => window.print()} type="button">🖨 Print / Save as PDF</button>
        <div className="status">{status}</div>
        <div className="hint">Click any text to edit. Click a coloring box to upload an image. Saved worksheets are shared with your whole team.</div>
      </div>

      <div className="stage">
        <div className={`sheet-tab ${ageTab === 'young' ? 'active' : ''}`}>
          <WorksheetPage
            ageGroup="young"
            editable
            initial={youngInitial}
            refs={youngRefs}
            resetToken={youngResetToken}
            date={weekDate}
            image={youngImage}
            onPickImage={setYoungImage}
            onClearImage={() => setYoungImage(null)}
          />
        </div>
        <div className={`sheet-tab ${ageTab === 'older' ? 'active' : ''}`}>
          <WorksheetPage
            ageGroup="older"
            editable
            initial={olderInitial}
            refs={olderRefs}
            resetToken={olderResetToken}
            date={weekDate}
            wsWords={olderWsWords}
            onWsWordsChange={setOlderWsWords}
            onRegenerate={() => regenerate()}
            wsState={olderWsState}
            onWsSize={handleWsSize}
          />
        </div>
      </div>
    </>
  )
}
