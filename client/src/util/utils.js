import { message } from 'src/echo'

export function parsePath({ type, dateStr, title }) {
  const yy = dateStr.slice(0, 4)
  const mm = dateStr.slice(5, 7)
  const dd = dateStr.slice(8, 10)
  let pathArr
  switch (type) {
    case 'blog':
      pathArr = ['', yy, mm, dd, encodeURIComponent(title)]
      break
    case 'archive':
      pathArr = ['', 'archive', yy, mm]
      break
    case 'category':
      pathArr = ['', 'category', encodeURIComponent(title)]
      break
    default:
      break
  }
  return pathArr.join('/')
}

export function fail(err, callback = message.error) {
  console.log(err)
  if (!err.code || err.code > 1000) callback(err.message)
}

export const holder = 1
