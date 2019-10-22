/* eslint no-underscore-dangle: off */
import fs from 'fs';
// import * as cp from 'child_process';
import { spawn, exec, execFile } from 'child_process';

import compareVersions from 'compare-versions';
import { pushNotification } from '$Actions/launchpad_actions';
import { getCommandLineParam } from '$Utils/app_utils';
import { notificationTypes } from '$Constants/notifications';
import { getLocalAppVersion, getInstalledLocation } from './helpers';
import {
    appHasUpdate,
    resetAppUpdateState
} from '$Actions/app_manager_actions';
import { initialAppManager } from '$Reducers/initialAppManager';
import {
    isDryRun,
    isRunningOnLinux,
    isRunningOnWindows,
    isRunningOnMac,
    openAppsInDebugMode
} from '$Constants';
import { logger } from '$Logger';

export class SafeAppUpdater {
    private _store;

    set store( store ) {
        this._store = store;
    }

    checkAppsForUpdate( application ) {
        const newVersion = application.latestVersion;
        const updateNotification = notificationTypes.UPDATE_AVAILABLE(
            application,
            newVersion
        );
        const installPath = getInstalledLocation( application );

        if ( isDryRun ) {
            if (
                application.id !==
                Object.keys( initialAppManager.applicationList )[0]
            ) {
                return;
            }
            logger.info( `DRY RUN: Checking for apps update` );
            this._store.dispatch(
                appHasUpdate( {
                    id: application.id,
                    hasUpdate: true
                } )
            );
            this._store.dispatch( {
                id: Math.random().toString( 36 ),
                ...pushNotification( updateNotification )
            } );
            return;
        }

        const localVersion = getLocalAppVersion( application );

        if ( localVersion ) {
            const comparison = compareVersions.compare(
                newVersion,
                localVersion,
                '>'
            );

            this._store.dispatch(
                appHasUpdate( {
                    id: application.id,
                    hasUpdate: comparison
                } )
            );

            if ( fs.existsSync( installPath ) && comparison ) {
                this._store.dispatch(
                    pushNotification( {
                        id: `${application.packageName}-update-notification`,
                        ...updateNotification
                    } )
                );
            }
        } else {
            this._store.dispatch(
                appHasUpdate( {
                    id: application.id,
                    hasUpdate: false
                } )
            );
        }
    }

    static updateApplication( application ) {
        if ( isDryRun ) {
            logger.info( `DRY RUN: Update application ${application}` );
            return;
        }

        const appLocation = getInstalledLocation( application );
        let command = appLocation;

        const newEnvironment = {
            ...process.env,
            NODE_ENV: 'prod',
            HOT: 'false'
        };

        // needs to be actually deleted.
        delete newEnvironment.HOT;

        logger.warn( 'Opening app via path: ', command );

        if ( isRunningOnMac ) {
            command = openAppsInDebugMode
                ? `open "${command}" -- --args --trigger-update --debug`
                : `open "${command}" -- --args --trigger-update`;

            exec( command, {
                // eslint-disable-next-line unicorn/prevent-abbreviations
                env: newEnvironment
            } );
        }
        if ( isRunningOnWindows ) {
            const arguments_ = openAppsInDebugMode
                ? ['--trigger-update', '--debug']
                : ['--trigger-update'];

            execFile( command, [...arguments_], {
                // eslint-disable-next-line unicorn/prevent-abbreviations
                env: newEnvironment
            } );
            return;
        }
        if ( isRunningOnLinux ) {
            logger.warn( 'Opening on linux via spawn command: ', command );
            const arguments_ = openAppsInDebugMode
                ? ['--trigger-update', '--debug']
                : ['--trigger-update'];
            // exec on linux doesnt give us a new process, so closing SNAPP
            // will close the spawned app :|
            spawn( command, [...arguments_], {
                // eslint-disable-next-line unicorn/prevent-abbreviations
                env: newEnvironment,
                detached: true
            } );
        }
    }

    handleAppUpdateCallback( arguments_ ) {
        logger.error( 'args', arguments_ );
        let appId = null;
        let appVersion = null;
        arguments_.forEach( ( argument ) => {
            if ( argument.includes( '--appid' ) ) {
                appId = argument.substring( argument.indexOf( ':' ) + 1 );
            }
        } );
        if ( appId !== null ) {
            const state = this._store.getState();
            const application = state.appManager.applicationList[appId];
            const updateError: boolean = arguments_.includes( '--update-failed' );
            if ( !updateError ) {
                arguments_.forEach( ( argument ) => {
                    if ( argument.includes( '--version-number' ) ) {
                        appVersion = `v${argument.substring(
                            argument.indexOf( ':' ) + 1
                        )}`;
                    }
                } );

                if ( appVersion !== null ) {
                    const newVersion = application.latestVersion;
                    if ( appVersion === newVersion ) {
                        logger.error( 'Update succesful' );
                        this._store.dispatch( resetAppUpdateState( application ) );
                    }
                }
            } else {
                logger.error( 'Error In update' );
                this._store.dispatch( resetAppUpdateState( application ) );
            }
        }
    }
}

export const safeAppUpdater = new SafeAppUpdater();
