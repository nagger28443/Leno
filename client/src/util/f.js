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
}

export default f
