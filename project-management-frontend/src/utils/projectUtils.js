export const getProjectColorIndex = (id, colorCount) => {
  const text = String(id || '')
  const hash = [...text].reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  )
  return hash % colorCount
}
