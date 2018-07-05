import { getSelectors } from 'redux-lists'

export const {
  listSelector: articlesListSelector,
  byKeySelector: articleByIdSelector
} = getSelectors('ARTICLES')
