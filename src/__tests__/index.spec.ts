import * as importations from '..'

describe('main export', () => {
  it('export expected', () => {
    Object.keys(importations).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((importations as any)[k]).toBeTruthy()
    })
  })
})
