import _get from 'lodash/get';
import { selectorsFactory } from './selectorsFactory';

const subState = state => _get(state, 'reduxList', {});

const getSelectors = namespace => {
    const { itemsByListNameSelectorFactory, mapSelector } = selectorsFactory(
        namespace
    );

    return {
        listSelector: (state, listName) =>
            itemsByListNameSelectorFactory(listName)(subState(state)),
        byKeySelector: (state, itemKey) => mapSelector(subState(state))[itemKey],
    };
};

export default getSelectors;
