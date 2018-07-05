import { SET_LIST, UPDATE_ITEMS } from './actionTypeHelpers'

const getActionCreators = (namespace, { onKey = 'id' } = {}) => {
  return {
    setList: (itemsParams, listName) => {
      const items = Array.isArray(itemsParams)
        ? itemsParams
        : [itemsParams]
      return {
        type: SET_LIST(namespace, listName),
        listName,
        items,
        onKey,
        namespace
      }
    },
    updateItems: itemsParams => {
      const items = Array.isArray(itemsParams)
        ? itemsParams
        : [itemsParams]
      return {
        type: UPDATE_ITEMS(namespace),
        namespace,
        items,
        onKey
      }
    }
  }
}

export default getActionCreators
