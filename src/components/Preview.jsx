import WorksheetPage from './WorksheetPage'
import { normalizeDoc } from '../utils/mapping'

export default function Preview({ docData, onBack, onEdit }) {
  if (!docData) return null
  const initial = normalizeDoc(docData)

  return (
    <div className="stage">
      <div className="preview-actions">
        <button className="btn btn-ghost" onClick={onBack} type="button">← Back to Library</button>
        <button className="btn btn-primary" onClick={() => window.print()} type="button">🖨 Print / Save as PDF</button>
        <button className="btn btn-teal" onClick={() => onEdit(docData)} type="button">✏️ Edit this worksheet</button>
      </div>
      <div className="sheet-tab active">
        <WorksheetPage
          ageGroup={docData.ageGroup}
          editable={false}
          initial={initial}
          date={docData.weekDate}
          image={initial.coloringImage}
          wsState={initial.wsState}
        />
      </div>
    </div>
  )
}
