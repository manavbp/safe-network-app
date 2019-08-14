import React, { Component } from 'react';
import { Grid, List } from '@material-ui/core';

import { Redirect } from 'react-router';
import { logger } from '$Logger';
import styles from './Overview.css';
import { App, AppManagerState } from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';
import { ON_BOARDING, HOME } from '$Constants/routes.json';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resumeDownload: Function;
    downloadAndInstallApp: Function;
    installApp: Function;
    appPreferences: {
        shouldOnboard: boolean;
    };
    appList: {
        app: App;
    };
    triggerSetAsTrayWindow: Function;
    isTrayWindow: boolean;
}

export class Overview extends Component<Props> {
    loadApps = () => {
        const {
            appList,
            unInstallApp,
            downloadAndInstallApp,
            pauseDownload,
            cancelDownload,
            resumeDownload,
            openApp
        } = this.props;
        return (
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <List>
                        {Object.values( appList ).map( ( theApplication ) => (
                            <ApplicationOverview
                                key={theApplication.name}
                                {...theApplication}
                                application={theApplication}
                                downloadAndInstallApp={downloadAndInstallApp}
                                unInstallApp={unInstallApp}
                                openApp={openApp}
                                pauseDownload={pauseDownload}
                                cancelDownload={cancelDownload}
                                resumeDownload={resumeDownload}
                            />
                        ) )}
                    </List>
                </Grid>
            </Grid>
        );
    };

    render() {
        const {
            triggerSetAsTrayWindow,
            isTrayWindow,
            appPreferences
        } = this.props;

        if ( appPreferences.shouldOnboard ) return <Redirect to={ON_BOARDING} />;

        return (
            <div className={styles.container} data-tid="container">
                <span data-istraywindow={isTrayWindow} />
                {this.loadApps()}
            </div>
        );
    }
}
