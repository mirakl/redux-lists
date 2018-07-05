/* eslint-env jest */

import { TODOS_NAMESPACE, ITEM_1, ITEM_2, state } from '../__mocks__/index'
import { selectorsFactory } from '../selectorsFactory'

describe('listSelectorFactory', () => {
  it('should return the entity list by listName', () => {
    const { listSelectorFactory } = selectorsFactory(TODOS_NAMESPACE)

    const allTodosIdsSelector = listSelectorFactory('ALL')
    expect(allTodosIdsSelector).toBeInstanceOf(Function)

    const allTodos = allTodosIdsSelector(state)
    expect(allTodos).toEqual([ITEM_1.id, ITEM_2.id])

    const doneTodosIdsSelector = listSelectorFactory('DONE')
    expect(doneTodosIdsSelector).toBeInstanceOf(Function)

    const doneTodos = doneTodosIdsSelector(state)
    expect(doneTodos).toEqual([ITEM_2.id])
  })

  it('should memoize the returned value', () => {
    const { listSelectorFactory } = selectorsFactory(TODOS_NAMESPACE)

    const allTodosSelector = listSelectorFactory('ALL')
    expect(allTodosSelector(state)).toBe(allTodosSelector(state))

    const doneTodosSelector = listSelectorFactory('DONE')
    expect(doneTodosSelector(state)).toBe(doneTodosSelector(state))
  })

  it('should work with empty args', () => {
    const { listSelectorFactory } = selectorsFactory(TODOS_NAMESPACE)
    expect(listSelectorFactory()()).toEqual(undefined)
  })
})
