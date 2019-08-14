import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';

import { Preferences } from '$Components/Preferences';
import styles from './Settings.css';

import {
    UserPreferences,
    AppPreferences,
    Preferences as PreferencesDef
} from '$Definitions/application.d';

interface Props {
    userPreferences: UserPreferences;
    appPreferences: AppPreferences;
    setUserPreferences: Function;
    getUserPreferences: Function;
    triggerSetAsTrayWindow: Function;
    autoLaunch: Function;
    history?: History;
    isTrayWindow: boolean;
}

export class Settings extends Component<Props> {
    componentWillMount() {
        this.props.getUserPreferences();
    }

    handleBack = () => {
        // go home
        this.props.history.push( '/' );
    };

    handlePreferenceChange = ( userPreferences: UserPreferences ) => {
        this.props.setUserPreferences( userPreferences );
    };

    render() {
        const {
            userPreferences,
            setUserPreferences,
            triggerSetAsTrayWindow,
            autoLaunch,
            isTrayWindow
        } = this.props;

        return (
            <Grid item xs={12} className={styles.wrap}>
                <Preferences
                    isTrayWindow={isTrayWindow}
                    userPreferences={userPreferences}
                    onChange={this.handlePreferenceChange}
                    onChangeLaunchOnStart={autoLaunch}
                    onChangePinToMenu={triggerSetAsTrayWindow}
                />
            </Grid>
        );
    }
}
