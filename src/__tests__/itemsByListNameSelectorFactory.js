/* eslint-env jest */

import { TODOS_NAMESPACE, ITEM_1, ITEM_2, state } from '../mocks/index';
import { selectorsFactory } from '../selectorsFactory';

describe('itemsByListNameSelectorFactory', () => {
    it('should return the entity list by listName', () => {
        const { itemsByListNameSelectorFactory } = selectorsFactory(
            TODOS_NAMESPACE
        );

        const allTodosSelector = itemsByListNameSelectorFactory('ALL');
        expect(allTodosSelector).toBeInstanceOf(Function);

        const allTodos = allTodosSelector(state);
        expect(allTodos).toEqual([ITEM_1, ITEM_2]);

        const doneTodosSelector = itemsByListNameSelectorFactory('DONE');
        expect(doneTodosSelector).toBeInstanceOf(Function);

        const doneTodos = doneTodosSelector(state);
        expect(doneTodos).toEqual([ITEM_2]);
    });

    it('should memoize the returned value', () => {
        const { itemsByListNameSelectorFactory } = selectorsFactory(
            TODOS_NAMESPACE
        );

        const allTodosSelector = itemsByListNameSelectorFactory('ALL');
        expect(allTodosSelector(state)).toBe(allTodosSelector(state));

        const doneTodosSelector = itemsByListNameSelectorFactory('DONE');
        expect(doneTodosSelector(state)).toBe(doneTodosSelector(state));
    });

    it('should return undefined when list do not exists', () => {
        const { itemsByListNameSelectorFactory } = selectorsFactory(
            TODOS_NAMESPACE
        );
        const imaginaryListSelector = itemsByListNameSelectorFactory(
            'NO EXISTING LIST'
        );

        const allTodos = imaginaryListSelector(state);
        expect(allTodos).toEqual(undefined);
    });

    it('should return undefined with empty args', () => {
        const { itemsByListNameSelectorFactory } = selectorsFactory(
            TODOS_NAMESPACE
        );
        expect(itemsByListNameSelectorFactory()()).toEqual(undefined);
    });
});
