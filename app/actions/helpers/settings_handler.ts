import fs from 'fs';
import path from 'path';
import * as fse from 'fs-extra';
import pkg from '$Package';

import { Preferences } from '$Definitions/application.d';

import {
    defaultPreferences,
    settingsHandlerName,
    isRunningTestCafeProcess,
    getAppFolderPath
} from '$Constants/index';

class SettingsHandler {
    private preferenceId: number | null;

    private jsonFileName: string;

    public constructor() {
        this.preferenceId = null;
        this.jsonFileName = isRunningTestCafeProcess
            ? settingsHandlerName.test
            : settingsHandlerName.production;
    }

    private getJsonPath() {
        try {
            let appFolderPath = getAppFolderPath();
            appFolderPath = path.resolve(
                appFolderPath,
                pkg.name,
                `${this.jsonFileName}.json`
            );

            fse.ensureFile( appFolderPath, ( error ) => {
                if ( error ) console.log( error );
            } );
            return appFolderPath;
        } catch ( error ) {
            console.log( 'error', error );
            return error;
        }
    }

    public updatePreferences( preferences: Preferences ) {
        return new Promise( async ( resolve, reject ) => {
            const appFolderPath = this.getJsonPath();
            console.log( 'appFolderPath', appFolderPath );
            console.log( 'preferences', preferences );
            try {
                fse.outputJsonSync( appFolderPath, { ...preferences } );
                return resolve();
            } catch ( error ) {
                return reject( error );
            }
        } );
    }

    public getPreferences(): Promise<Preferences> {
        return new Promise( async ( resolve, reject ) => {
            const appFolderPath = await this.getJsonPath();
            try {
                return resolve( fse.readJsonSync( appFolderPath ) );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }
}

export const settingsHandler = new SettingsHandler();
