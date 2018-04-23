/* eslint-env jest */

import reduxListReducer from '../reducer';
import getActionCreators from '../getActionCreators';
import { ITEM_1, ITEM_2, TODOS_NAMESPACE } from '../__mocks__';

const state = {};

describe('Redux-lists reducer', () => {
    it('should return state if no action type matches', () => {
        const updatedState = reduxListReducer(state, {});
        expect(updatedState).toEqual(state);
    });

    it('should react properly to setList action', () => {
        const { setList: setTodoList } = getActionCreators(TODOS_NAMESPACE);

        const setAllTodosAction = setTodoList([ITEM_1, ITEM_2], 'ALL');
        const newState = reduxListReducer(state, setAllTodosAction);

        expect(newState).toEqual({
            [TODOS_NAMESPACE]: {
                lists: {
                    ALL: [ITEM_1.id, ITEM_2.id],
                },
                map: {
                    [ITEM_1.id]: ITEM_1,
                    [ITEM_2.id]: ITEM_2,
                },
            },
        });

        const setDoneTodosAction = setTodoList([ITEM_2], 'DONE');
        const newState2 = reduxListReducer(newState, setDoneTodosAction);

        expect(newState2).toEqual({
            [TODOS_NAMESPACE]: {
                lists: {
                    ALL: [ITEM_1.id, ITEM_2.id],
                    DONE: [ITEM_2.id],
                },
                map: {
                    [ITEM_1.id]: ITEM_1,
                    [ITEM_2.id]: ITEM_2,
                },
            },
        });
    });

    it('should react properly to updateItems action', () => {
        const { updateItems: updateTodos } = getActionCreators(TODOS_NAMESPACE);
        const state = {
            [TODOS_NAMESPACE]: {
                lists: {
                    ALL: [ITEM_1.id, ITEM_2.id],
                    DONE: [ITEM_2.id],
                },
                map: {
                    [ITEM_1.id]: ITEM_1,
                    [ITEM_2.id]: ITEM_2,
                },
            },
        };

        const UPDATED_ITEM_1 = {
            ...ITEM_1,
            done: true,
        };

        const updateTodoAction = updateTodos(UPDATED_ITEM_1);
        const newState = reduxListReducer(state, updateTodoAction);

        expect(newState).toEqual({
            [TODOS_NAMESPACE]: {
                lists: {
                    ALL: [ITEM_1.id, ITEM_2.id],
                    DONE: [ITEM_2.id],
                },
                map: {
                    [ITEM_1.id]: UPDATED_ITEM_1,
                    [ITEM_2.id]: ITEM_2,
                },
            },
        });
    });
});
