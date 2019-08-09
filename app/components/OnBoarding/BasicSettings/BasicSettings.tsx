import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { UserPreferences } from '$Definitions/application.d';
import { Preferences } from '$Components/Preferences';

interface Props {
    userPreferences: UserPreferences;
    setUserPreferences: Function;
    triggerSetAsTrayWindow: Function;
    autoLaunch: Function;
    isTrayWindow: boolean;
}

export const Base = styled( Paper )( {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '0 24px'
} );

const Title = styled( Typography )( {
    paddingTop: '10%',
    marginBottom: '16px'
} );

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
        <Base elevation={0} aria-label="BasicSettingsPage">
            <Box>
                <Title variant="h5">Basic Settings</Title>
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
        </Base>
    );
};
