export function parseBlogIntoToURL({ timestamp, title }) {
  const date = new Date(timestamp)
  const yy = date.getFullYear()
  const mm = date.getMonth()
  const dd = date.getDate()
  return ['', yy, mm, dd, encodeURIComponent(title)].join('/')
}

export const holder = 1
