const PREFIX = '@@redux-list';

export const SET_LIST = (namespace, listName) =>
    `${PREFIX}/SET_LIST: ${listName} in ${namespace}`;
export const UPDATE_ITEMS = namespace => `${PREFIX}/UPDATE_ITEMS: ${namespace}`;
