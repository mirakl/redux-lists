export const TODOS_NAMESPACE = 'todos';

export const ITEM_1 = {
    id: '1',
    value: 'Buy some bananas',
    done: false,
};
export const ITEM_2 = {
    id: '2',
    value: 'Do the dishes',
    done: true,
};

export const state = {
    [TODOS_NAMESPACE]: {
        lists: {
            ALL: [ITEM_1.id, ITEM_2.id],
            DONE: [ITEM_2.id],
            NOT_DONE: [ITEM_1.id],
        },
        map: {
            [ITEM_1.id]: ITEM_1,
            [ITEM_2.id]: ITEM_2,
        },
    },
};

export const fullState = {
    reduxList: state,
};
