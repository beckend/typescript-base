import * as importations from '..'

describe('main export', () => {
  it('export expected', () => {
    Object.keys(importations).forEach((k) => {
      expect((importations as any)[k]).toBeTruthy()
    })
  })
})
