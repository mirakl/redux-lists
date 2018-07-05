import _get from 'lodash/get'
import _memoize from 'lodash/memoize'
import { createSelector } from 'reselect'

const getNamespacedStore = (state, namespace) => _get(state, namespace, {})

export const selectorsFactory = namespace => {
  const mapSelector = createSelector(
    state => getNamespacedStore(state, namespace),
    nsStore => _get(nsStore, 'map', {})
  )

  const listSelectorFactory = _memoize(listName =>
    createSelector(
      state => getNamespacedStore(state, namespace),
      nsStore => _get(nsStore, ['lists', listName], undefined)
    )
  )

  const itemsByListNameSelectorFactory = _memoize(listName =>
    createSelector(
      state => listSelectorFactory(listName)(state),
      state => mapSelector(state),
      (itemsIdsList, itemsMap) =>
        itemsIdsList
          ? itemsIdsList.map(id => _get(itemsMap, id, {}))
          : undefined
    )
  )

  return {
    mapSelector,
    listSelectorFactory,
    itemsByListNameSelectorFactory
  }
}
