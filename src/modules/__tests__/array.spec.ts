import { returnArray } from '../array'

describe('array utols', () => {
  describe(returnArray.name, () => {
    it('return empty array if not an array', () => {
      ;['', 0, {}, null, undefined].forEach(x => {
        expect(returnArray(x as any)).toEqual([])
      })
    })

    it('return array as is if an array', () => {
      const theArray = [1, 2, 3]

      expect(returnArray(theArray)).toEqual(theArray)
    })
  })
})
