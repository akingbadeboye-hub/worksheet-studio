import { useEffect, useRef, useState } from 'react'

// Renders wsState = {rows, cols, grid, placed} filling its wrapper, and
// reports the wrapper's pixel size upward via onSize(w, h) so the parent
// can decide how many rows/cols to generate next time.
export default function WordSearchGrid({ wsState, onSize }) {
  const wrapRef = useRef(null)
  const [cell, setCell] = useState({ w: 24, h: 24 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth || 500
      const h = el.clientHeight || 340
      onSize && onSize(w, h)
      if (wsState) {
        setCell({ w: Math.floor(w / wsState.cols), h: Math.floor(h / wsState.rows) })
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('beforeprint', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('beforeprint', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsState])

  const fontSize = Math.round(Math.min(cell.w, cell.h) * 0.55)

  return (
    <div className="ws-fit-wrap" ref={wrapRef}>
      {wsState && wsState.grid && (
        <table
          className="wsGrid"
          style={{ width: cell.w * wsState.cols, height: cell.h * wsState.rows }}
        >
          <tbody>
            {wsState.grid.map((row, r) => (
              <tr key={r}>
                {row.map((letter, c) => (
                  <td key={c} style={{ width: cell.w, height: cell.h, fontSize }}>
                    {letter}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
