import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
// @ts-ignore
import { INTRO } from '$App/constants/routes.json';

// @ts-ignore
import Logo from '$App/assets/images/logo.svg';
import styles from './GetStarted.css';

interface Props {
    onClickGetStarted: Function;
    history?: History;
}

export const GetStarted = ( properties ) => {
    const { onClickGetStarted, history } = properties;
    return (
        <Paper className={styles.Base} aria-label="GetStarted">
            <Box className={styles.LogoBase}>
                <img src={Logo} alt="Launchpad logo" />
            </Box>
            <Box className={styles.Container}>
                <Typography className={styles.Title} variant="h5">
                    SAFE Launchpad
                </Typography>
                <Typography>
                    All the apps you need to try the SAFE Network
                </Typography>
                <Fab
                    className={styles.GetStartedButton}
                    variant="extended"
                    size="medium"
                    aria-label="GetStarted"
                    onClick={() => {
                        onClickGetStarted();
                        // @ts-ignore
                        history.push( INTRO );
                    }}
                >
                    Get Started
                </Fab>
            </Box>
        </Paper>
    );
};
