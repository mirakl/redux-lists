import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import ArticleList from './containers/ArticleList'
import rootReducer from './reducers'
import ArticlePage from './containers/ArticlePage'

const devToolEnable = window.devToolsExtension

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    devToolEnable
      ? window.devToolsExtension({
        actionsBlacklist: ['@@redux-form/REGISTER_FIELD']
      })
      : f => f
  )
)

render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path='/' component={ArticleList} />
        <Route path='/article/:id' component={ArticlePage} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
)
