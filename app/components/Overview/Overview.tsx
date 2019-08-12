import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { Redirect } from 'react-router';
import { logger } from '$Logger';
import styles from './Overview.css';
import {
    ManagedApplication,
    AppManagerState
} from '$Definitions/application.d';
import { ApplicationOverview } from '$Components/ApplicationOverview';
import { ON_BOARDING, HOME } from '$Constants/routes.json';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    appPreferences: {
        shouldOnboard: boolean;
    };
    appList: {
        app: ManagedApplication;
    };
    triggerSetAsTrayWindow: Function;
    isTrayWindow: boolean;
    history?: History;
}

export class Overview extends Component<Props> {
    loadApps = () => {
        const { appList, uninstallApp, installApp, openApp } = this.props;
        return Object.values( appList ).map( ( theApplication ) => (
            <ApplicationOverview
                key={theApplication.name}
                {...theApplication}
                application={theApplication}
                installApp={installApp}
                uninstallApp={uninstallApp}
                openApp={openApp}
            />
        ) );
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
