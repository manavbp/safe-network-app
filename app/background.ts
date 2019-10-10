/* eslint global-require: 1 */
import _ from 'lodash';
import { ipcRenderer } from 'electron';
import { logger } from '$Logger';
import { setCurrentStoreForNotificationActions } from '$Actions/alias/notification_actions';
import { configureStore } from '$Store/configureStore';
import { setCurrentStore } from '$Actions/application_actions';
import { settingsHandler } from '$Actions/helpers/settings_handler';
import { isDryRun } from '$Constants';

declare let window: Window;

const PID = process.pid;
let CHECKED_SAFE_APPS_UPDATE_ON_LAUNCH = false;
let updateAppsSubscriber;

logger.info( `Welcome to the BG process it's ID is: `, PID );

function getStatePreferences( state ) {
    const userPreferences = { ...state.launchpad.userPreferences };
    const appPreferences = { ...state.launchpad.appPreferences };
    const preferences = { appPreferences, userPreferences };
    return preferences;
}

const managePreferencesLocally = async ( store ) => {
    const previousState = await settingsHandler.getPreferences();
    const currentState = getStatePreferences( store.getState() );
    if ( !_.isEqual( previousState, currentState ) ) {
        await settingsHandler.updatePreferences( { ...currentState } );
    }
};

const checkForSafeAppsUpdateOnLaunch = ( store ) => {
    if ( isDryRun ) {
        updateAppsSubscriber();
        return;
    }

    if ( CHECKED_SAFE_APPS_UPDATE_ON_LAUNCH ) return;

    logger.info( 'Checking for Safe applications update' );
    const currentState = store.getState();
    const applications = currentState.appManager.applicationList;

    if ( Object.keys( applications ).length === 0 ) return;

    ipcRenderer.send( 'checkApplicationsForUpdate', applications );
    CHECKED_SAFE_APPS_UPDATE_ON_LAUNCH = true;

    // UnSubscribe the store subscriber
    updateAppsSubscriber();
};

const initBgProcess = () => {
    const store = configureStore( undefined );
    setCurrentStore( store );
    setCurrentStoreForNotificationActions( store );
    store.subscribe( () => {
        managePreferencesLocally( store );
    } );

    updateAppsSubscriber = store.subscribe( () => {
        checkForSafeAppsUpdateOnLaunch( store );
    } );
};

initBgProcess();

window.addEventListener( 'error', function windowErrors( error ) {
    logger.error( 'errorInBackgroundWindow', error );
} );
