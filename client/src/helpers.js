// List of all of the line's full names.
const lines = [
  'Red Line',
  'Blue Line',
  'Brown Line',
  'Green Line',
  'Orange Line',
  'Purple Line',
  'Pink Line',
  'Yellow Line'
]

// Converts a string from the full name to the style name; ex: 'Pink Line' -> 'pink-line'.
const lineToStyle = (line) => line.toLowerCase().replace(' ', '-')

export { lines, lineToStyle }
