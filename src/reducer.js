import _get from 'lodash/get';
import { SET_LIST, UPDATE_ITEMS } from './actionTypeHelpers';

const INITIAL_STATE = {};

const reduxList = (state = INITIAL_STATE, action) => {
    const { namespace, listName } = action;
    switch (action.type) {
        case SET_LIST(namespace, listName): {
            const map = {};
            const list = [];

            action.items.forEach(item => {
                const key = item[action.onKey];
                map[key] = item;
                list.push(key);
            });

            return {
                ...state,
                [namespace]: {
                    map: {
                        ..._get(state, [namespace, 'map'], {}),
                        ...map,
                    },
                    lists: {
                        ..._get(state, [namespace, 'lists'], {}),
                        [listName]: list,
                    },
                },
            };
        }
        case UPDATE_ITEMS(namespace): {
            const map = {};

            action.items.forEach(item => {
                const key = item[action.onKey];
                map[key] = item;
            });

            return {
                ...state,
                [namespace]: {
                    lists: _get(state, [namespace, 'lists'], {}),
                    map: {
                        ..._get(state, [namespace, 'map'], {}),
                        ...map,
                    },
                },
            };
        }
        default:
            return state;
    }
};

export default reduxList;
