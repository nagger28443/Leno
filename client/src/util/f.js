const f = {
  isYear: param =>
    (typeof param === 'number' || 'string') &&
    /^\d{4}$/.test(String(param)) &&
    Number(param) > 1900 &&
    Number(param) < 2100,

  isMonth: param =>
    (typeof param === 'number' || 'string') &&
    /^\d{2,}$/.test(String(param)) &&
    Number(param) > 0 &&
    Number(param) < 13,

  lastEle: arr => (Array.isArray(arr) ? arr[arr.length - 1] : undefined),
}

export default f
