import { getSelectors } from 'redux-lists'

export const {
  listSelector: todoListSelector,
  byKeySelector: todoByIdSelector
} = getSelectors('TODOS')
