import { combineReducers } from 'redux'
import { reducer as reduxListsReducer } from 'redux-lists'

export default combineReducers({
  reduxList: reduxListsReducer
})
