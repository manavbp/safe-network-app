/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { ipcMain, app } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { Store } from 'redux';

import * as cp from 'child_process';
import { addApplication } from '$Actions/application_actions';
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { MenuBuilder } from './menu';
import { Application } from './definitions/application.d';
import {
    createSafeLaunchPadStandardWindow,
    createSafeLaunchPadTrayWindow,
    createTray
} from './setupLaunchPad';
import { setupBackground } from './setupBackground';

import managedApplications from '$App/managedApplications.json';
import { platform } from '$Constants';
import { pushNotification } from '$Actions/launchpad_actions';
import { notificationTypes } from '$Constants/notifications';


logger.info( 'User data exists: ', app.getPath( 'userData' ) );

/* eslint-disable-next-line import/no-default-export */
export default class AppUpdater {
    public constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;

        try {
            autoUpdater.checkForUpdatesAndNotify();
        } catch ( error ) {
            logger.error( 'Problems with auto updating...' );
            logger.error( error );
        }
    }
}

if ( process.env.NODE_ENV === 'production' ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
) {
    require( 'electron-debug' )();
}

const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require( 'electron-devtools-installer' );
    const forceDownload = true;
    // const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map( ( name ) =>
            installer.default( installer[name], forceDownload )
        )
    ).catch( console.log );
};

const addNotification = ( store ) => {
    if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NOTIFICATION !== undefined &&
        process.env.NOTIFICATION !== null
    ) {
        const appId: string = Math.random().toString( 36 );
        const application = {
            appId,
            name: 'SAFE Browser',
            version: 'v1.0'
        };

        if (
            process.env.NOTIFICATION === 'DISC_FULL' ||
            process.env.NOTIFICATION === 'NO_INTERNET' ||
            process.env.NOTIFICATION === 'GLOBAL_FAILURE' ||
            process.env.NOTIFICATION === 'ADMIN_PASS_REQ' ||
            process.env.NOTIFICATION === 'SERVER_TIMED_OUT' ||
            process.env.NOTIFICATION === 'CLOSE_APP' ||
            process.env.NOTIFICATION === 'UNINSTALL_APP_ALERT' ||
            process.env.NOTIFICATION === 'CLOSE_APP_ALERT'
        )
            store.dispatch(
                pushNotification( {
                    notification: notificationTypes[process.env.NOTIFICATION](
                        appId,
                        application.name,
                        application
                    )
                } )
            );

        if (
            process.env.NOTIFICATION === 'UPDATE_AVAILABLE' ||
            process.env.NOTIFICATION === 'UPDATE_AVAILABLE_ALERT'
        )
            store.dispatch(
                pushNotification( {
                    notification: notificationTypes[process.env.NOTIFICATION](
                        appId,
                        application.name,
                        application.version
                    )
                } )
            );

        if (
            process.env.NOTIFICATION === 'RESTART_SYSTEM' ||
            process.env.NOTIFICATION === 'RESTART_SYSTEM_ALERT'
        )
            store.dispatch(
                pushNotification( {
                    notification: notificationTypes[process.env.NOTIFICATION](
                        application.name
                    )
                } )
            );

        if ( process.env.NOTIFICATION === 'CLEARNET_WARNING_ALERT' )
            store.dispatch(
                pushNotification( {
                    notification: notificationTypes[process.env.NOTIFICATION]()
                } )
            );
    }
};

// const loadMiddlewarePackages = [];

let store: Store;
let mainWindow: Application.Window;
let trayWindow: Application.Window;

const gotTheLock = app.requestSingleInstanceLock();

if ( !gotTheLock ) {
    logger.warn(
        'Another instance of the launcher is already running. Closing this one.'
    );
    app.quit();
} else {
    app.on( 'second-instance', ( event, commandLine, workingDirectory ) => {
        // Someone tried to run a second instance, we should focus our window.
        if ( mainWindow ) {
            if ( mainWindow.isMinimized() ) mainWindow.restore();
            mainWindow.focus();
        }
    } );

    // Create myWindow, load the rest of the app, etc...

    app.on( 'ready', async () => {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            await installExtensions();
        }

        const initialState = {};
        store = configureStore( initialState );

        // initialSetup of apps,
        const allApplications = managedApplications.applications;
        if ( managedApplications.version === '1' ) {
            Object.keys( allApplications ).forEach( ( application ) => {
                console.log( 'Managing:', application );
                store.dispatch( addApplication( allApplications[application] ) );
            } );
        }

        createTray( store, app );
        mainWindow = createSafeLaunchPadStandardWindow( store, app );
        trayWindow = createSafeLaunchPadTrayWindow( store, app );
        setupBackground( store, mainWindow );

        const menuBuilder = new MenuBuilder( mainWindow, store );
        menuBuilder.buildMenu();

        addNotification( store );

        // Remove this if your app does not use auto updates
        // eslint-disable-next-line no-new
        new AppUpdater();
    } );
}

/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );

app.on( 'open-url', ( _, url ) => {
    try {
        mainWindow.show();
    } catch ( error ) {
        console.error(
            ' Issue opening a window. It did not exist for this app... Check that the correct app version is opening.'
        );
        throw new Error( error );
    }
} );

ipcMain.on( 'restart', () => {
    if (
        process.platform !== 'linux' &&
        process.platform !== 'darwin' &&
        process.platform !== 'win32'
    ) {
        throw new Error( 'Unknown or unsupported OS!' );
    }
    let finalcmd;
    if ( process.platform !== 'linux' && process.platform !== 'win32' ) {
        const cmdarguments = ['shutdown'];

        cmdarguments.push( '-r' );

        finalcmd = cmdarguments.join( ' ' );
    }

    if ( process.platform === 'darwin' ) {
        finalcmd = `osascript -e 'tell app "System Events" to shut down'`;
    }

    cp.exec( finalcmd, ( error, stdout, stderr ) => {
        if ( error ) {
            console.error( error );
            return;
        }
        // console.log(stdout);
        app.exit( 0 );
    } );
} );

ipcMain.on( 'close-app', ( application ) => {
    console.log( 'close-app' );
    if (
        process.platform !== 'linux' &&
        process.platform !== 'darwin' &&
        process.platform !== 'win32'
    ) {
        throw new Error( 'Unknown or unsupported OS!' );
    }

    const appName = application.name;
    console.log( `Should contact ${appName} and close the app` );
} );
