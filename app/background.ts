/* eslint global-require: 1 */
import { logger } from '$Logger';
import { setCurrentStoreForNotificationActions } from '$Actions/alias/notification_actions';
import { configureStore } from '$Store/configureStore';
import { setCurrentStore } from '$Actions/application_actions';

declare let window: Window;

const PID = process.pid;

logger.info( "Welcome to the BG process it's ID is: ", PID );

const initBgProcess = () => {
    const store = configureStore( undefined );
    setCurrentStore( store );
    setCurrentStoreForNotificationActions( store );

    // store.subscribe( () => {
    //     logger.info( 'chchchchchaaaanges' );
    // } );
};

initBgProcess();

window.addEventListener( 'error', function windowErrors( error ) {
    logger.error( 'errorInBackgroundWindow', error );
} );
