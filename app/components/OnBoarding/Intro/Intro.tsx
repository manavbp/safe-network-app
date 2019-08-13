import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import styles from './Intro.css';

export const Intro = () => {
    return (
        <Paper className={styles.Base} elevation={0} aria-label="IntroPage">
            <Box className={styles.Container}>
                <Typography className={styles.Title} variant="h5">
                    One Place for All SAFE Apps
                </Typography>
                <Typography className={styles.Description}>
                    A one-stop shop to access all SAFE Apps and manage instant
                    app updates.
                </Typography>
            </Box>
        </Paper>
    );
};
