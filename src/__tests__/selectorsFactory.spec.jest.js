/* eslint-env jest */

import { selectorsFactory } from '../selectorsFactory'
import { TODOS_NAMESPACE } from '../__mocks__/index'

describe('selectorsFactory', () => {
  it('should generate some selectors and factories', () => {
    const {
      mapSelector,
      listSelectorFactory,
      itemsByListNameSelectorFactory
    } = selectorsFactory(TODOS_NAMESPACE)

    expect(mapSelector).toBeInstanceOf(Function)
    expect(mapSelector()).toBeInstanceOf(Object)

    expect(listSelectorFactory).toBeInstanceOf(Function)
    expect(listSelectorFactory()).toBeInstanceOf(Function)
    expect(listSelectorFactory()()).not.toBeInstanceOf(Function)

    expect(itemsByListNameSelectorFactory).toBeInstanceOf(Function)
    expect(itemsByListNameSelectorFactory()).toBeInstanceOf(Function)
    expect(itemsByListNameSelectorFactory()()).not.toBeInstanceOf(Function)
  })
})
