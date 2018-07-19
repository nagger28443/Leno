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

  getRuleName: rule => Object.keys(rule).find(item => item !== 'message'),

  // url参数查询decode, search, category, labels, archive...
  urlParamDecode: params => {
    const match = /^\?(\w+)=(.+)$/.exec(params)
    return match ? { [match[1]]: match[2] } : null
  },

  // 比较对象是否相等,
  isEqual: (obj1, obj2) => {
    if (obj1 === obj2) return true
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false
      return obj1.every((item, index) => f.isEqual(obj1[index], obj2[index]))
    }
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      if (keys1.length !== keys2.length) return false
      return keys1.every(key => f.isEqual(obj1[key], obj2[key]))
    }
    return obj1 === obj2
  },
}

export default f
