import { useEffect, useState } from 'react'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import TopNav from './components/TopNav'
import Editor from './components/Editor'
import Library from './components/Library'
import Preview from './components/Preview'
import { db, WORKSHEETS_COLLECTION } from './firebaseClient'
import { defaultDoc } from './data/defaultDoc'
import { normalizeDoc } from './utils/mapping'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [view, setView] = useState('editor')
  const [status, setStatus] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)
  const [previewDoc, setPreviewDoc] = useState(null)

  // ---- editor state (lifted here so Library/Preview can hand off into it) ----
  const [ageTab, setAgeTab] = useState('young')
  const [weekDate, setWeekDate] = useState(todayISO())
  const [youngInitial, setYoungInitial] = useState(defaultDoc('young'))
  const [olderInitial, setOlderInitial] = useState(defaultDoc('older'))
  const [youngResetToken, setYoungResetToken] = useState(0)
  const [olderResetToken, setOlderResetToken] = useState(0)
  const [youngImage, setYoungImage] = useState(null)
  const [olderWsWords, setOlderWsWords] = useState(defaultDoc('older').wsWords)
  const [olderWsState, setOlderWsState] = useState(null)
  const [editingId, setEditingId] = useState({ young: null, older: null })

  useEffect(() => {
    document.body.dataset.mode = view
  }, [view])

  function resetDoc(age) {
    const fresh = defaultDoc(age)
    if (age === 'young') {
      setYoungInitial(fresh)
      setYoungResetToken(t => t + 1)
      setYoungImage(null)
    } else {
      setOlderInitial(fresh)
      setOlderResetToken(t => t + 1)
      setOlderWsWords(fresh.wsWords)
      setOlderWsState(null)
    }
    setEditingId(prev => ({ ...prev, [age]: null }))
    setStatus('')
  }

  async function handleSave(age, payload, existingId) {
    setStatus('Saving…')
    try {
      if (existingId) {
        await updateDoc(doc(db, WORKSHEETS_COLLECTION, existingId), {
          ...payload,
          updatedAt: serverTimestamp(),
        })
      } else {
        const ref = await addDoc(collection(db, WORKSHEETS_COLLECTION), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        setEditingId(prev => ({ ...prev, [age]: ref.id }))
      }
      setStatus('✓ Saved to library')
      setRefreshToken(t => t + 1)
    } catch (err) {
      console.error(err)
      setStatus('Save failed — check Firebase setup')
    }
  }

  function loadDocIntoEditor(docSnapshot) {
    const initial = normalizeDoc(docSnapshot)
    setWeekDate(docSnapshot.weekDate || todayISO())
    setEditingId(prev => ({ ...prev, [docSnapshot.ageGroup]: docSnapshot.id }))
    if (docSnapshot.ageGroup === 'young') {
      setYoungInitial(initial)
      setYoungImage(initial.coloringImage)
      setYoungResetToken(t => t + 1)
    } else {
      setOlderInitial(initial)
      setOlderWsWords(initial.wsWords)
      setOlderWsState(initial.wsState)
      setOlderResetToken(t => t + 1)
    }
    setAgeTab(docSnapshot.ageGroup)
    setView('editor')
  }

  const editState = {
    ageTab, setAgeTab,
    weekDate, setWeekDate,
    youngInitial, olderInitial,
    youngResetToken, olderResetToken,
    youngImage, setYoungImage,
    olderWsWords, setOlderWsWords,
    olderWsState, setOlderWsState,
    editingId, resetDoc,
  }

  return (
    <>
      <TopNav view={view} setView={setView} />

      {view === 'editor' && (
        <Editor editState={editState} onSave={handleSave} status={status} />
      )}

      {view === 'library' && (
        <Library
          refreshToken={refreshToken}
          onView={d => { setPreviewDoc(d); setView('preview') }}
          onEdit={loadDocIntoEditor}
        />
      )}

      {view === 'preview' && (
        <Preview
          docData={previewDoc}
          onBack={() => setView('library')}
          onEdit={loadDocIntoEditor}
        />
      )}
    </>
  )
}
