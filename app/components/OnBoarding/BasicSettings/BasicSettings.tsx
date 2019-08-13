import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import styles from './BasicSettings.css';

import { UserPreferences } from '$Definitions/application.d';
import { Preferences } from '$Components/Preferences';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    triggerSetAsTrayWindow: Function;
    autoLaunch: Function;
    isTrayWindow: boolean;
}

export const BasicSettings = ( properties ) => {
    const {
        userPreferences,
        setUserPreferences,
        triggerSetAsTrayWindow,
        autoLaunch,
        isTrayWindow
    } = properties;
    const requiredItems = {
        autoUpdate: true,
        pinToMenuBar: true,
        launchOnStart: true,
        showDeveloperApps: true
    };
    return (
        <Paper
            className={styles.Base}
            elevation={0}
            aria-label="BasicSettingsPage"
        >
            <Box>
                <Typography className={styles.Title} variant="h5">
                    Basic Settings
                </Typography>
                <Typography>
                    Choose some basic settings. You can always change these
                    later.
                </Typography>
                <Grid item xs={12}>
                    <Preferences
                        isTrayWindow={isTrayWindow}
                        userPreferences={userPreferences}
                        requiredItems={requiredItems}
                        onChange={setUserPreferences}
                        onChangeLaunchOnStart={autoLaunch}
                        onChangePinToMenu={triggerSetAsTrayWindow}
                    />
                </Grid>
            </Box>
        </Paper>
    );
};
