/* eslint-env jest */

import { ITEM_1, ITEM_2, TODOS_NAMESPACE } from '../mocks';
import getActionCreators from '../getActionCreators';
import { SET_LIST, UPDATE_ITEMS } from '../actionTypeHelpers';

describe('getActionCreators', () => {
    it('should create setList action creator with optional key', () => {
        const { setList: setTodoList } = getActionCreators(TODOS_NAMESPACE);

        const createAllTodoListAction = setTodoList([ITEM_1, ITEM_2], 'ALL');
        expect(createAllTodoListAction).toEqual({
            type: SET_LIST(TODOS_NAMESPACE, 'ALL'),
            listName: 'ALL',
            items: [ITEM_1, ITEM_2],
            onKey: 'id',
            namespace: TODOS_NAMESPACE,
        });
    });

    it('should create updateItems action creator with optional key', () => {
        const { updateItems: updateTodos } = getActionCreators(TODOS_NAMESPACE);

        const UPDATED_ITEM_1 = {
            ...ITEM_1,
            done: true,
        };

        const updateSingularTodoAction = updateTodos(UPDATED_ITEM_1);

        expect(updateSingularTodoAction).toEqual({
            type: UPDATE_ITEMS(TODOS_NAMESPACE),
            namespace: TODOS_NAMESPACE,
            items: [UPDATED_ITEM_1],
            onKey: 'id',
        });

        const UPDATED_ITEM_2 = {
            ...ITEM_2,
            done: false,
        };

        const updateMultipleTodosAction = updateTodos([
            UPDATED_ITEM_1,
            UPDATED_ITEM_2,
        ]);

        expect(updateMultipleTodosAction).toEqual({
            type: UPDATE_ITEMS(TODOS_NAMESPACE),
            namespace: TODOS_NAMESPACE,
            items: [UPDATED_ITEM_1, UPDATED_ITEM_2],
            onKey: 'id',
        });
    });

    it('should handle custom key', () => {
        const { setList, updateItems } = getActionCreators(TODOS_NAMESPACE, {
            onKey: 'code',
        });

        const createAllTodoListAction = setList([ITEM_1, ITEM_2], 'ALL');
        expect(createAllTodoListAction).toEqual({
            type: SET_LIST(TODOS_NAMESPACE, 'ALL'),
            listName: 'ALL',
            items: [ITEM_1, ITEM_2],
            onKey: 'code',
            namespace: TODOS_NAMESPACE,
        });

        const UPDATED_ITEM_1 = {
            ...ITEM_1,
            done: true,
        };

        const updateTodoAction = updateItems(UPDATED_ITEM_1);

        expect(updateTodoAction).toEqual({
            type: UPDATE_ITEMS(TODOS_NAMESPACE),
            namespace: TODOS_NAMESPACE,
            items: [UPDATED_ITEM_1],
            onKey: 'code',
        });
    });
});
