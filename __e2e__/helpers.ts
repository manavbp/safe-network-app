/* eslint import/prefer-default-export: off */
import { ClientFunction } from 'testcafe';

import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';

const tableName = 'testPreferences';

const defaultPreferences = {
    userPreferences: {
        autoUpdate: false,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: false,
        warnOnAccessingClearnet: true
    },
    appPreferences: {
        shouldOnboard: true
    }
};

/* eslint no-undef: "off" */
export const getPageUrl = ClientFunction( () => window.location.href );
export const getPageTitle = ClientFunction( () => document.title );

function getJsonPath() {
    try {
        let appFolderPath;
        appFolderPath = path.resolve( appFolderPath, 'safe-launchpad' );

        fse.ensureDir( appFolderPath, ( error ) => {
            console.log( error );
        } );

        appFolderPath = path.resolve( appFolderPath, `${tableName}.json` );
        return appFolderPath;
    } catch ( error ) {
        console.log( 'error', error );
        return error;
    }
}

export const updatePreferences = ( overridePreferences ) => {
    return new Promise( async ( resolve, reject ) => {
        const appFolderPath = getJsonPath();

        const newPreferences = Object.assign( {}, defaultPreferences );

        if ( overridePreferences.userPreferences ) {
            newPreferences.userPreferences = Object.assign(
                newPreferences.userPreferences,
                overridePreferences.userPreferences
            );
        }
        if ( overridePreferences.appPreferences ) {
            newPreferences.appPreferences = Object.assign(
                newPreferences.appPreferences,
                overridePreferences.appPreferences
            );
        }

        try {
            fse.outputJson( appFolderPath, { ...newPreferences } );
            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );
};
