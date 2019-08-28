import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Root } from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { setCurrentPath } from '$Actions/launchpad_actions';
import 'typeface-roboto/index.css';
import './app.global.css';

const store = configureStore();
declare const document;

let currentPath = '/';
store.subscribe( () => {
    const previousPath = currentPath;
    currentPath = store.getState().router.location.pathname;
    if ( currentPath !== previousPath )
        store.dispatch( setCurrentPath( { pathname: currentPath } ) );
} );

render(
    <AppContainer>
        <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById( 'root' )
);
if ( module.hot ) {
    module.hot.accept( './containers/Root', () => {
        // eslint-disable-next-line global-require
        const NextRoot = require( './containers/Root' ).default;
        render(
            <AppContainer>
                <NextRoot store={store} history={history} />
            </AppContainer>,
            document.getElementById( 'root' )
        );
    } );
}
