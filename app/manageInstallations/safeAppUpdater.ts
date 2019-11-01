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
    openAppsInDebugMode,
    useTestPackages
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

        if ( isRunningOnMac ) {
            command = `open "${command}" -- --args --trigger-update`;

            if ( openAppsInDebugMode ) {
                command = `${command} --debug`;
            }

            logger.info( 'Opening app via path: ', command );

            if ( !isDryRun ) {
                exec( command, {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment
                } );
            }

            return;
        }

        const cmdArguments = ['--trigger-update'];

        if ( openAppsInDebugMode ) {
            cmdArguments.push( '--debug' );
        }

        if ( isRunningOnWindows ) {
            logger.info(
                'Opening on windows via execFile command: ',
                command,
                cmdArguments
            );

            if ( !isDryRun ) {
                execFile( command, [...cmdArguments], {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment
                } );
            }
        }

        if ( isRunningOnLinux ) {
            logger.info(
                'Opening on linux via spawn command: ',
                command,
                cmdArguments
            );

            if ( !isDryRun ) {
                logger.info( `DRY RUN: Update application ${application}` );
                // exec on linux doesnt give us a new process, so closing SNAPP
                // will close the spawned app :|
                spawn( command, [...cmdArguments], {
                    // eslint-disable-next-line unicorn/prevent-abbreviations
                    env: newEnvironment,
                    detached: true
                } );
            }
        }
    }

    handleAppUpdateCallback( cmdArguments ) {
        logger.info( 'Received app update info', cmdArguments );
        let appId = null;
        let appVersion = null;
        cmdArguments.forEach( ( argument ) => {
            if ( argument.includes( '--appid' ) ) {
                appId = argument.slice( argument.indexOf( ':' ) + 1 );
            }
        } );
        if ( appId !== null ) {
            const state = this._store.getState();
            const application = state.appManager.applicationList[appId];
            const updateError: boolean = cmdArguments.includes(
                '--update-failed'
            );
            if ( !updateError ) {
                cmdArguments.forEach( ( argument ) => {
                    if ( argument.includes( '--version-number' ) ) {
                        appVersion = `v${argument.slice(
                            argument.indexOf( ':' ) + 1
                        )}`;
                    }
                } );

                if ( appVersion !== null ) {
                    const newVersion = application.latestVersion;
                    if ( appVersion === newVersion ) {
                        logger.info( 'Update successful' );
                        this._store.dispatch( resetAppUpdateState( application ) );
                    }
                }
            } else {
                logger.error( 'Error in update' );

                this._store.dispatch( resetAppUpdateState( application ) );
            }
        }
    }
}

export const safeAppUpdater = new SafeAppUpdater();
