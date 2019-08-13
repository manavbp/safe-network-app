/* eslint global-require: 1 */
import _ from 'lodash';
import { logger } from '$Logger';
import { setCurrentStoreForNotificationActions } from '$Actions/alias/notification_actions';
import { configureStore } from '$Store/configureStore';
import { setCurrentStore } from '$Actions/application_actions';
import { settingsHandler } from '$Actions/helpers/settings_handler';

declare let window: Window;

const PID = process.pid;

logger.info( "Welcome to the BG process it's ID is: ", PID );

function select( state ) {
    const userPreferences = { ...state.launchpad.userPreferences };
    const appPreferences = { ...state.launchpad.appPreferences };
    const preferences = { appPreferences, userPreferences };
    return preferences;
}

const managePreferencesLocally = async ( store ) => {
    const previousState = await settingsHandler.getPreferences();
    console.log( 'previousState', previousState );
    const currentState = select( store.getState() );
    console.log( 'currentState', currentState );
    if ( !_.isEqual( previousState, currentState ) ) {
        console.log( 'not equal' );
        await settingsHandler.updatePreferences( { ...currentState } );
    }
};

const initBgProcess = () => {
    const store = configureStore( undefined );
    setCurrentStore( store );
    setCurrentStoreForNotificationActions( store );
    store.subscribe( () => {
        managePreferencesLocally( store );
    } );
};

initBgProcess();

window.addEventListener( 'error', function windowErrors( error ) {
    logger.error( 'errorInBackgroundWindow', error );
} );
