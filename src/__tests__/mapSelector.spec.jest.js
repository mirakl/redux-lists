/* eslint-env jest */

import { TODOS_NAMESPACE, ITEM_1, ITEM_2, state } from '../__mocks__/index'
import { selectorsFactory } from '../selectorsFactory'

describe('mapSelector', () => {
  it('should return the entity map', () => {
    const { mapSelector: todoMapSelector } = selectorsFactory(
      TODOS_NAMESPACE
    )

    expect(todoMapSelector).toBeInstanceOf(Function)
    expect(todoMapSelector(state)).toEqual({
      [ITEM_1.id]: ITEM_1,
      [ITEM_2.id]: ITEM_2
    })
  })

  it('should always return the same reference', () => {
    const { mapSelector } = selectorsFactory(TODOS_NAMESPACE)

    expect(mapSelector(state)).toBe(mapSelector(state))
  })

  it('should return empty map', () => {
    const { mapSelector } = selectorsFactory(TODOS_NAMESPACE)

    expect(mapSelector).toBeInstanceOf(Function)
    expect(mapSelector()).toEqual({})
  })
})
