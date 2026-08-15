import { useEffect, useRef } from 'react'
import {
  BookIcon, BulbIcon, OpenBookIcon, MusicIcon, PaletteIcon,
  FamilyIcon, PrayerIcon, SearchIcon, HomeworkIcon, ImageIcon, FootprintTrail,
} from './Icons'
import WordSearchGrid from './WordSearchGrid'

const AGE_LABEL = { young: '0 – 5 years', older: '6 – 12 years' }

function niceDate(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// A contentEditable field that owns its own DOM text so React re-renders
// never disturb the cursor while typing. Value is set imperatively via the
// `resetToken` effect (fires on mount and whenever a different doc is loaded).
function Editable({ fieldRef, initialValue, resetToken, className, tag: Tag = 'div', style }) {
  useEffect(() => {
    if (fieldRef.current) fieldRef.current.textContent = initialValue || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken])

  return (
    <Tag
      ref={fieldRef}
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
    />
  )
}

export default function WorksheetPage({
  ageGroup,
  editable,
  initial,
  refs,
  resetToken,
  date,
  image,
  onPickImage,
  onClearImage,
  wsWords,
  onWsWordsChange,
  onRegenerate,
  wsState,
  onWsSize,
}) {
  const isYoung = ageGroup === 'young'
  const fileInputRef = useRef(null)

  function handleFilePicked(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onPickImage(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="page">
      <FootprintTrail />

      <div className="head-row">
        <div className="brandmark">
          <div className="ring"><BookIcon stroke="#fff" /></div>
          <div className="title-block">
            <h1>WICM Shining Light <span className="age">({AGE_LABEL[ageGroup]})</span></h1>
            <div className="field-row">
              <div className="field-inline">
                Theme:{' '}
                {editable
                  ? <Editable tag="span" fieldRef={refs.theme} initialValue={initial.theme} resetToken={resetToken} />
                  : <span>{initial.theme}</span>}
              </div>
              <div className="field-inline">
                Topic:{' '}
                {editable
                  ? <Editable tag="span" fieldRef={refs.topic} initialValue={initial.topic} resetToken={resetToken} />
                  : <span>{initial.topic}</span>}
              </div>
              {!editable && <div className="date-pill">{niceDate(date)}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="body-grid">
        {/* -------- LEFT COLUMN -------- */}
        <div className="col">
          <div className="block coral">
            <div className="block-title"><BulbIcon stroke="currentColor" />Memory Verse</div>
            {editable ? (
              <>
                <Editable fieldRef={refs.verseText} initialValue={initial.verseText} resetToken={resetToken} className="verse-text" />
                <Editable fieldRef={refs.verseRef} initialValue={initial.verseRef} resetToken={resetToken} className="ref" />
              </>
            ) : (
              <>
                <div className="verse-text">{initial.verseText}</div>
                <div className="ref">{initial.verseRef}</div>
              </>
            )}
          </div>

          <div className="block">
            <div className="block-title"><OpenBookIcon stroke="currentColor" />Bible Text</div>
            {editable
              ? <Editable fieldRef={refs.bibleText} initialValue={initial.bibleText} resetToken={resetToken} className="txt" />
              : <div className="txt">{initial.bibleText}</div>}
          </div>

          <div className="block grow">
            <div className="block-title">
              <MusicIcon stroke="currentColor" />Song —{' '}
              {editable
                ? <Editable tag="span" fieldRef={refs.songTitle} initialValue={initial.songTitle} resetToken={resetToken} style={{ fontWeight: 700, textTransform: 'none' }} />
                : <span style={{ fontWeight: 700, textTransform: 'none' }}>{initial.songTitle}</span>}
            </div>
            <div className="song-cols">
              {editable ? (
                <>
                  <Editable fieldRef={refs.song1} initialValue={initial.song1} resetToken={resetToken} />
                  <Editable fieldRef={refs.song2} initialValue={initial.song2} resetToken={resetToken} />
                </>
              ) : (
                <>
                  <div>{initial.song1}</div>
                  <div>{initial.song2}</div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* -------- RIGHT COLUMN -------- */}
        <div className="col">
          {!isYoung && (
            <div className="block gold" style={{ display: 'flex', flexDirection: 'column', flex: 1.4, minHeight: 0 }}>
              <div className="block-title"><SearchIcon stroke="currentColor" />Wordsearch</div>
              {editable && (
                <div className="ws-tools">
                  <input
                    type="text"
                    value={wsWords}
                    onChange={e => onWsWordsChange(e.target.value)}
                  />
                  <button className="btn btn-teal" onClick={onRegenerate} type="button">Generate</button>
                </div>
              )}
              <WordSearchGrid wsState={wsState} onSize={onWsSize} />
              <div className="ws-words">{wsState?.placed?.join('   •   ')}</div>
            </div>
          )}

          {isYoung && (
            <div className="block coral" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="block-title"><PaletteIcon stroke="currentColor" />Activity — Color the picture</div>
              <div
                className="art-box"
                onClick={editable ? () => fileInputRef.current?.click() : undefined}
                style={{ cursor: editable ? 'pointer' : 'default' }}
              >
                {editable && (
                  <button
                    className="remove"
                    onClick={e => { e.stopPropagation(); onClearImage() }}
                    type="button"
                  >✕</button>
                )}
                {image
                  ? <img src={image} alt="Coloring page" />
                  : <div className="placeholder">
                      {editable && <><ImageIcon stroke="currentColor" /><br /></>}
                      {editable ? "Click to upload this week's coloring page" : 'No image uploaded'}
                    </div>}
                {editable && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFilePicked}
                  />
                )}
              </div>
            </div>
          )}

          {isYoung ? (
            <div className="block">
              <div className="block-title">
                <FamilyIcon stroke="currentColor" />Parent-Child Activity —{' '}
                {editable
                  ? <Editable tag="span" fieldRef={refs.parentTitle} initialValue={initial.parentTitle} resetToken={resetToken} style={{ fontWeight: 700, textTransform: 'none' }} />
                  : <span style={{ fontWeight: 700, textTransform: 'none' }}>{initial.parentTitle}</span>}
              </div>
              <ul className="bullets">
                {editable ? (
                  <>
                    <li><Editable fieldRef={refs.parentB1} initialValue={initial.parentB1} resetToken={resetToken} /></li>
                    <li><Editable fieldRef={refs.parentB2} initialValue={initial.parentB2} resetToken={resetToken} /></li>
                  </>
                ) : (
                  <>
                    <li>{initial.parentB1}</li>
                    <li>{initial.parentB2}</li>
                  </>
                )}
              </ul>
            </div>
          ) : (
            <div className="block">
              <div className="block-title"><FamilyIcon stroke="currentColor" />Parent-Child Activity</div>
              <div className="txt">
                <b>Discuss:</b>{' '}
                {editable
                  ? <Editable tag="span" fieldRef={refs.discuss} initialValue={initial.discuss} resetToken={resetToken} />
                  : <span>{initial.discuss}</span>}
              </div>
            </div>
          )}

          {!isYoung && (
            <div className="block gold">
              <div className="block-title"><HomeworkIcon stroke="currentColor" />Home Work</div>
              <ul className="bullets">
                {editable ? (
                  <>
                    <li><Editable fieldRef={refs.homeworkB1} initialValue={initial.homeworkB1} resetToken={resetToken} /></li>
                    <li><Editable fieldRef={refs.homeworkB2} initialValue={initial.homeworkB2} resetToken={resetToken} /></li>
                  </>
                ) : (
                  <>
                    <li>{initial.homeworkB1}</li>
                    <li>{initial.homeworkB2}</li>
                  </>
                )}
              </ul>
            </div>
          )}

          <div className="block gold">
            <div className="block-title"><PrayerIcon stroke="currentColor" />Daily Prayer</div>
            {editable
              ? <Editable fieldRef={refs.prayer} initialValue={initial.prayer} resetToken={resetToken} className="txt" />
              : <div className="txt">{initial.prayer}</div>}
          </div>
        </div>
      </div>

      <div className="page-footer">
        <span>Name:</span>{' '}
        {editable
          ? <span className="line" contentEditable suppressContentEditableWarning>&nbsp;</span>
          : <span className="line">&nbsp;</span>}
      </div>
    </div>
  )
}
