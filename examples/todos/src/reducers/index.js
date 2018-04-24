import { combineReducers } from 'redux';
import { reducer as reduxListsReducer } from 'redux-lists';

import visibilityFilter from './visibilityFilter';

export default combineReducers({
    visibilityFilter,
    reduxList: reduxListsReducer,
});
