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

    private tableName: string;

    public constructor() {
        this.preferenceId = null;
        this.tableName = isRunningTestCafeProcess
            ? settingsHandlerName.test
            : settingsHandlerName.production;
    }

    private getJsonPath() {
        try {
            let appFolderPath = getAppFolderPath();
            appFolderPath = path.resolve( appFolderPath, pkg.name );

            fse.ensureDir( appFolderPath, ( error ) => {
                console.log( error );
            } );

            appFolderPath = path.resolve(
                appFolderPath,
                `${this.tableName}.json`
            );
            return appFolderPath;
        } catch ( error ) {
            console.log( 'error', error );
            return error;
        }
    }

    public updatePreferences( preferences: Preferences ) {
        return new Promise( async ( resolve, reject ) => {
            const appFolderPath = this.getJsonPath();
            try {
                fse.outputJson( appFolderPath, { ...preferences } );
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
                return resolve( fse.readJson( appFolderPath ) );
            } catch ( error ) {
                return reject( error );
            }
        } );
    }
}

export const settingsHandler = new SettingsHandler();
