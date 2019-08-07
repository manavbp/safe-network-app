import { app } from 'electron';
import path from 'path';
import * as fs from 'fs-extra';
import pkg from '$Package';
import {
    getAppFolderPath,
    settingsHandlerName,
    defaultPreferences
} from '$Constants/index';

export const installExtensions = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
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

export const createApplicationFolder = async () => {
    return new Promise( async ( resolve, reject ) => {
        let appFolderPath = app.getPath( 'appData' );
        const JsonFileName = settingsHandlerName.production;
        appFolderPath = path.resolve(
            appFolderPath,
            pkg.name,
            `${JsonFileName}.json`
        );
        try {
            await fs.ensureFile( appFolderPath );
            return resolve();
        } catch ( error ) {
            return reject( error );
        }
    } );
};
