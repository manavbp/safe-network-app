import path from 'path';
import { app, Tray, BrowserWindow, ipcMain, screen, App, Menu } from 'electron';
import { Store } from 'redux';
import open from 'open';
import { is } from 'electron-util';
import { logger } from '$Logger';
import { Application } from './definitions/application.d';
import { setAsTrayWindow } from '$Actions/launchpad_actions';

import {
    isRunningTestCafeProcess,
    isRunningUnpacked,
    CONFIG,
    isRunningOnWindows,
    isRunningOnLinux,
    isRunningOnMac
} from '$Constants';

let tray;
let safeLaunchPadWindow: Application.Window;
let safeLaunchPadStandardWindow: Application.Window;

const getTrayWindowPosition = (
    window: Application.Window
): { x: number; y: number } => {
    const safeLaunchPadWindowBounds = window.getBounds();
    const trayBounds = tray.getBounds();

    const mainScreen = screen.getPrimaryDisplay();
    const screenBounds = mainScreen.bounds;

    // Center safeLaunchPadWindow horizontally below the tray icon
    let x = Math.round(
        trayBounds.x +
            trayBounds.width / 2 -
            safeLaunchPadWindowBounds.width / 2
    );

    if ( isRunningOnLinux ) {
        x = Math.round( screenBounds.width - safeLaunchPadWindowBounds.width );
    }

    // Position safeLaunchPadWindow 4 pixels vertically below the tray icon
    let y = Math.round( trayBounds.y + trayBounds.height + 4 );

    if ( isRunningOnWindows ) {
        y = Math.round(
            screenBounds.height - safeLaunchPadWindowBounds.height - 40
        );
    }

    return { x, y };
};

const createTrayWindow = () => {
    safeLaunchPadWindow = new BrowserWindow( {
        width: 400,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            // Prevents renderer process code from not running when safeLaunchPadWindow is
            // hidden
            // preload: path.join(__dirname, 'browserPreload.js'),
            backgroundThrottling: false,
            nodeIntegration: true
        }
    } ) as Application.Window;

    if ( is.usingAsar || isRunningTestCafeProcess ) {
        safeLaunchPadWindow.loadURL( `file://${CONFIG.APP_HTML_PATH_ASAR}` );
    } else {
        safeLaunchPadWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );
    }

    safeLaunchPadWindow.setMovable( false );
    safeLaunchPadWindow.setResizable( false );
    const position = getTrayWindowPosition( safeLaunchPadWindow );
    safeLaunchPadWindow.setPosition( position.x, position.y, false );

    if ( isRunningOnMac ) {
        app.dock.hide();
    }
};

const createRegularWindow = () => {
    safeLaunchPadWindow = new BrowserWindow( {
        width: 400,
        show: false,
        frame: true,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            // Prevents renderer process code from not running when safeLaunchPadWindow is
            // hidden
            // preload: path.join(__dirname, 'browserPreload.js'),
            backgroundThrottling: false,
            nodeIntegration: true
        }
    } ) as Application.Window;

    if ( is.usingAsar || isRunningTestCafeProcess ) {
        safeLaunchPadWindow.loadURL( `file://${CONFIG.APP_HTML_PATH_ASAR}` );
    } else {
        safeLaunchPadWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );
    }

    safeLaunchPadWindow.center();
    safeLaunchPadWindow.setResizable( false );
    safeLaunchPadWindow.setMovable( true );

    if ( isRunningOnMac ) {
        app.dock.show();
    }
};

const createWindow = ( pinToMenuBar ) => {
    pinToMenuBar
        ? logger.info( 'Setting as tray' )
        : logger.info( 'Setting as window' );

    if ( safeLaunchPadWindow ) safeLaunchPadWindow.close();

    pinToMenuBar ? createTrayWindow() : createRegularWindow();

    safeLaunchPadWindow.on( 'ready-to-show', () => {
        safeLaunchPadWindow.show();
        safeLaunchPadWindow.focus();
    } );
};

const setWindowAsVisible = ( setVisible: boolean ): void => {
    if ( !setVisible ) {
        safeLaunchPadWindow.hide();
    } else {
        safeLaunchPadWindow.show();
        safeLaunchPadWindow.focus();
    }
};

export const createTray = ( store: Store ) => {
    return new Promise( ( resolve ) => {
        const iconPathtray = path.resolve( __dirname, 'tray-icon.png' );

        tray = new Tray( iconPathtray );

        tray.on( 'double-click', () => {
            setWindowAsVisible( true );
        } );
        tray.on( 'click', ( event ) => {
            setWindowAsVisible( true );

            // Show devtools when command clicked
            if (
                safeLaunchPadStandardWindow &&
                safeLaunchPadStandardWindow.isVisible() &&
                process.defaultApp &&
                event.metaKey
            ) {
                safeLaunchPadStandardWindow.openDevTools( { mode: 'undocked' } );
            }
        } );
        tray.setToolTip( app.getName() );
        resolve();
    } );
};

export const createSafeLaunchPadTrayWindow = (
    store: Store
): Application.Window => {
    const { pinToMenuBar } = store.getState().launchpad.userPreferences;
    createWindow( pinToMenuBar );

    // Hide the safeLaunchPadTrayWindow when it loses focus
    safeLaunchPadWindow.on( 'blur', () => {
        const { isTrayWindow } = store.getState().launchpad;

        if ( isTrayWindow ) {
            setWindowAsVisible( false );
        }
    } );

    ipcMain.on( 'set-as-tray-window', async ( _event, shouldBeTray: boolean ) => {
        if ( shouldBeTray ) {
            // must be first for dock icon changes
            await createTray( store );
            store.dispatch( setAsTrayWindow( true ) );
            createWindow( true );
        } else {
            // must be first for dock icon changes
            tray.destroy();
            store.dispatch( setAsTrayWindow( false ) );
            createWindow( false );
        }
    } );

    // prevent links in pulled updates to trigger window opening. Use default
    // OS browser...
    safeLaunchPadWindow.webContents.on( 'new-window', function( event, url ) {
        event.preventDefault();
        open( url );
    } );

    return safeLaunchPadWindow;
};
