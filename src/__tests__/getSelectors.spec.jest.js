/* eslint-env jest */

import { ITEM_1, ITEM_2, fullState as state, TODOS_NAMESPACE } from '../mocks';
import getSelectors from '../getSelectors';

describe('getSelectors', () => {
    it('should create redux-list selectors with the right namespace', () => {
        const { listSelector, byKeySelector } = getSelectors(TODOS_NAMESPACE);

        const allTodos = listSelector(state, 'ALL');
        expect(allTodos).toEqual([ITEM_1, ITEM_2]);

        const doneTodos = listSelector(state, 'DONE');
        expect(doneTodos).toEqual([ITEM_2]);

        const firstTodo = byKeySelector(state, ITEM_1.id);
        expect(firstTodo).toEqual(ITEM_1);
    });

    it('should memoize the results', () => {
        const { listSelector, byKeySelector } = getSelectors(TODOS_NAMESPACE);

        expect(listSelector(state, 'ALL')).toBe(listSelector(state, 'ALL'));
        expect(listSelector(state, 'DONE')).toBe(listSelector(state, 'DONE'));
        expect(byKeySelector(state, ITEM_1.id)).toBe(byKeySelector(state, ITEM_1.id));
    });

    it('should not break without namespace parameter', () => {
        const { listSelector, byKeySelector } = getSelectors();

        const allTodos = listSelector(state, 'ALL');
        expect(allTodos).toEqual(undefined);

        const doneTodos = listSelector(state, 'DONE');
        expect(doneTodos).toEqual(undefined);

        const firstTodo = byKeySelector(state, ITEM_1.id);
        expect(firstTodo).toEqual(undefined);
    });
});
