/* eslint no-underscore-dangle: off */
import * as cp from 'child_process';

import compareVersions from 'compare-versions';

import { getLocalAppVersionMacOS, getInstalledLocation } from './helpers';
import { appHasUpdate } from '$Actions/app_manager_actions';

export class AppUpdater {
    private _store;

    set store( store ) {
        this._store = store;
    }

    checkAppsForUpdate( applications ) {
        Object.keys( applications ).forEach( ( appId ) => {
            const application = applications[appId];
            const newVersion = application.latestVersion;
            const localVersion = getLocalAppVersionMacOS( application );
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
}

export const appUpdater = new AppUpdater();
