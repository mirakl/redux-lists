import { getActionCreators } from 'redux-lists';

export const {
    setList: setArticleList,
    updateItems: updateArticles,
} = getActionCreators('ARTICLES');
