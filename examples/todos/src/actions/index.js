import { getActionCreators } from 'redux-lists';
import { todoByIdSelector, todoListSelector } from '../selectors';

export const {
    setList: setTodoList,
    updateItems: updateTodos,
} = getActionCreators('TODOS');

export const addTodo = todo => (dispatch, getState) => {
    const state = getState();
    const currentTodos = todoListSelector(state, LISTS.ALL) || [];
    const newTodos = [...currentTodos, todo];

    dispatch(setTodoList(newTodos, LISTS.ALL));
};

const filterTodos = (todos = [], filter) => {
    if (filter === LISTS.ALL) return todos;
    const keepActive = filter === LISTS.ACTIVE;

    return todos.filter(todo => {
        if (keepActive) {
            return !todo.completed;
        }

        return todo.completed;
    });
};

export const setVisibilityFilter = filter => (dispatch, getState) => {
    dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter,
    });

    const state = getState();
    const allTodos = todoListSelector(state, LISTS.ALL);
    const todos = filterTodos(allTodos, filter);
    dispatch(setTodoList(todos, filter));
};

export const toggleTodo = id => async (dispatch, getState) => {
    const state = getState();
    const todo = todoByIdSelector(state, id);

    await dispatch(
        updateTodos({
            ...todo,
            completed: !todo.completed,
        })
    );

    if (state.visibilityFilter !== LISTS.ALL) {
        const newState = getState();
        const allTodos = todoListSelector(newState, LISTS.ALL);
        const todos = filterTodos(allTodos, state.visibilityFilter);
        dispatch(setTodoList(todos, state.visibilityFilter));
    }
};

export const LISTS = {
    ALL: 'ALL',
    COMPLETED: 'COMPLETED',
    ACTIVE: 'ACTIVE',
};
