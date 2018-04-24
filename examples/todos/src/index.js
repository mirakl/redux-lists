import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import App from './components/App';
import rootReducer from './reducers';

const devToolEnable = window.devToolsExtension;

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        devToolEnable
            ? window.devToolsExtension({
                  actionsBlacklist: ['@@redux-form/REGISTER_FIELD'],
              })
            : f => f
    )
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
