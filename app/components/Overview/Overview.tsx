import React, { Component } from 'react';
import { Grid, List } from '@material-ui/core';

import { logger } from '$Logger';
import styles from './Overview.css';
import { App, AppManagerState } from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    appList: {
        app: App;
    };
    triggerSetAsTrayWindow: Function;
    isTrayWindow: boolean;
}

export class Overview extends Component<Props> {
    loadApps = () => {
        const { appList, uninstallApp, installApp, openApp } = this.props;
        return (
            <Grid container justify="space-between">
                <Grid item xs={12}>
                    <List>
                        {Object.values( appList ).map( ( theApplication ) => (
                            <ApplicationOverview
                                key={theApplication.name}
                                {...theApplication}
                                application={theApplication}
                                installApp={installApp}
                                uninstallApp={uninstallApp}
                                openApp={openApp}
                            />
                        ) )}
                    </List>
                </Grid>
            </Grid>
        );
    };

    render() {
        const { triggerSetAsTrayWindow, isTrayWindow } = this.props;
        return (
            <div className={styles.container} data-tid="container">
                <span data-istraywindow={isTrayWindow} />
                {this.loadApps()}
            </div>
        );
    }
}
