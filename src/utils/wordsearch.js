const DIRS = [[1,0],[0,1],[1,1],[1,-1],[-1,0],[0,-1],[-1,-1],[-1,1]]
const TARGET_CELL = 30

export function parseWords(raw) {
  return raw
    .split(',')
    .map(w => w.trim().toUpperCase())
    .filter(w => w.length > 1)
    .slice(0, 14)
}

// Builds a rows x cols wordsearch sized to fill a box of wrapW x wrapH pixels.
export function buildWordsearch(words, wrapW, wrapH) {
  const longest = words.reduce((m, w) => Math.max(m, w.length), 4)
  const cols = Math.max(longest, Math.min(28, Math.floor((wrapW || 500) / TARGET_CELL)))
  const rows = Math.max(longest, Math.min(28, Math.floor((wrapH || 340) / TARGET_CELL)))

  const grid = Array.from({ length: rows }, () => Array(cols).fill(''))
  const placed = []

  const sorted = [...words].sort((a, b) => b.length - a.length)
  sorted.forEach(word => {
    let ok = false
    for (let attempt = 0; attempt < 300 && !ok; attempt++) {
      const dir = DIRS[Math.floor(Math.random() * DIRS.length)]
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)
      const endRow = row + dir[0] * (word.length - 1)
      const endCol = col + dir[1] * (word.length - 1)
      if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) continue

      let fits = true
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i, c = col + dir[1] * i
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) { fits = false; break }
      }
      if (!fits) continue

      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i, c = col + dir[1] * i
        grid[r][c] = word[i]
      }
      placed.push(word)
      ok = true
    }
  })

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '') grid[r][c] = letters[Math.floor(Math.random() * 26)]
    }
  }

  return { rows, cols, grid, placed }
}
