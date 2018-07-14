import f from '../src/util/f'

const { isEqual, urlParamDecode } = f

describe('test urlParamDecode', () => {
  test('urlParamDecode', () => {
    expect(urlParamDecode('?a=1')).toEqual({ a: '1' })
    expect(urlParamDecode('?a=front-end')).toEqual({ a: 'front-end' })
    expect(urlParamDecode('?')).toEqual(null)
    expect(urlParamDecode('?s')).toEqual(null)
    expect(urlParamDecode('?=1')).toEqual(null)
    expect(urlParamDecode('a=2')).toEqual(null)
  })
})
describe('test isEqual', () => {
  test('illegal params', () => {
    expect(isEqual(undefined, undefined)).toBeTruthy()
    expect(isEqual(null, null)).toBeTruthy()
    expect(isEqual(undefined, {})).toBeFalsy()
    expect(isEqual(undefined, null)).toBeFalsy()
  })
  test('literal', () => {
    expect(isEqual(1, 1)).toBeTruthy()
    expect(isEqual(false, 2)).toBeFalsy()
    expect(isEqual('123', '123')).toBeTruthy()
    expect(isEqual('', '')).toBeTruthy()
  })
  test('array', () => {
    expect(isEqual([], [])).toBeTruthy()
    expect(isEqual([], [1])).toBeFalsy()
    expect(isEqual([1], [1])).toBeTruthy()
    expect(isEqual([1], [1, [2]])).toBeFalsy()
    expect(isEqual([1, [2]], [1, [2]])).toBeTruthy()
  })
  test('object', () => {
    expect(isEqual({}, {})).toBeTruthy()
    expect(isEqual({ a: 1 }, {})).toBeFalsy()
    expect(isEqual({ a: 1 }, { b: 1 })).toBeFalsy()
    expect(isEqual({ a: 1 }, { a: 1 })).toBeTruthy()
    expect(isEqual({ a: 1 }, { a: 1 })).toBeTruthy()
    expect(isEqual({ a: 1 }, { a: 2 })).toBeFalsy()
    expect(isEqual({ a: { a: 1 } }, { a: 2 })).toBeFalsy()
    expect(isEqual({ a: { a: 1 } }, { a: { a: 1 } })).toBeTruthy()
    expect(isEqual({ a: { a: [1] } }, { a: { a: [] } })).toBeFalsy()
  })
})
