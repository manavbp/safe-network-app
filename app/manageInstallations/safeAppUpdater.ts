/* eslint no-underscore-dangle: off */
import fs from 'fs';
import * as cp from 'child_process';

import compareVersions from 'compare-versions';
import { pushNotification } from '$Actions/launchpad_actions';
import { getCommandLineParam } from '$Utils/app_utils';
import { notificationTypes } from '$Constants/notifications';
import { getLocalAppVersion, getInstalledLocation } from './helpers';
import { appHasUpdate } from '$Actions/app_manager_actions';
import { initialAppManager } from '$Reducers/initialAppManager';
import { isDryRun } from '$Constants';
import { logger } from '$Logger';

export class SafeAppUpdater {
    private _store;

    set store( store ) {
        this._store = store;
    }

    checkAppsForUpdate( applications ) {
        Object.keys( applications ).forEach( ( appId, i ) => {
            const application = applications[appId];
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
                    this._store.dispatch( {
                        id: Math.random().toString( 36 ),
                        ...pushNotification( updateNotification )
                    } );
                }
            } else {
                this._store.dispatch(
                    appHasUpdate( {
                        id: application.id,
                        hasUpdate: false
                    } )
                );
            }
        } );
    }

    static updateApplication( application ) {
        if ( isDryRun ) {
            logger.info( `DRY RUN: Update application ${application}` );
            return;
        }
        let finalCmd = '';

        const appDirectoryPath = getInstalledLocation( application );

        if ( process.platform === 'darwin' ) {
            const appPath = `"${appDirectoryPath}/Contents/MacOs/${application.name}"`;
            finalCmd = `${appPath} --triggerUpdate`;
        }

        cp.exec( finalCmd, ( error, stdout, stderr ) => {
            if ( error ) {
                console.error( error );
                return;
            }
            console.log( 'Update request sent' );
        } );
    }

    handleUpdateError( argv ) {
        const updateError = getCommandLineParam( argv, '--updateError' );
        if ( updateError ) {
            this._store.dispatch(
                pushNotification( notificationTypes.GLOBAL_FAILURE( updateError ) )
            );
        }
    }

    handleUpdateSuccess( argv ) {
        const updateSuccess = getCommandLineParam( argv, '--updateSuccess' );
        const appName = getCommandLineParam( argv, '--appName' );
        const appNewVersion = getCommandLineParam( argv, '--appNewVersion' );

        if ( updateSuccess && appName && appNewVersion ) {
            this._store.dispatch(
                pushNotification(
                    notificationTypes.GLOBAL_INFO(
                        `Successfully updated ${appName} to v${appNewVersion}`,
                        'Okay'
                    )
                )
            );
        }
    }
}

export const safeAppUpdater = new SafeAppUpdater();
