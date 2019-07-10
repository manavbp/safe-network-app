import React, { Component } from 'react';
import {
    Grid,
    Paper,
    Box,
    CssBaseline,
    Typography,
    Button,
    Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

// Material-ui Icons
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import WarningIcon from '@material-ui/icons/Warning';
import InfoIcon from '@material-ui/icons/Info';
import LockIcon from '@material-ui/icons/Lock';
import DiscFullIcon from '@material-ui/icons/DiscFull';
import LoopIcon from '@material-ui/icons/Loop';
import { notificationTypes } from '$Constants/notifications';
import { logger } from '$Logger';

interface Props {
    notifications: Record<string, any>;
    acceptNotification: any;
    denyNotification: any;
}

export class Notification extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            acceptNotification,
            denyNotification
        } = this.props;
        const components = {
            SignalWifiOffIcon,
            WarningIcon,
            InfoIcon,
            LockIcon,
            DiscFullIcon,
            LoopIcon
        };
        const notificationKeys = Object.keys( notifications );
        let l = notificationKeys.length - 1;
        if ( l >= 0 ) {
            let latestNotificationId: string = notificationKeys[l];
            let latestNotification: Record<string, any> =
                notifications[latestNotificationId];
            // eslint-disable-next-line no-plusplus
            while ( l-- && latestNotification.priority === 'LOW' ) {
                latestNotificationId = notificationKeys[l];
                latestNotification = notifications[latestNotificationId];
            }
            const TagName =
                components[latestNotification.icon || 'WarningIcon'];

            latestNotification.icon =
                latestNotification.icon === undefined
                    ? 'InfoIcon'
                    : latestNotification.icon;
            latestNotification.acceptText =
                latestNotification.acceptText === undefined
                    ? 'RESUME'
                    : latestNotification.acceptText;
            latestNotification.denyText =
                latestNotification.denyText === undefined
                    ? 'DISMISS'
                    : latestNotification.denyText;
            latestNotification.message =
                latestNotification.message === undefined
                    ? 'Uhh Ohh Something Went Wrong!'
                    : latestNotification.message;

            const handleOnAccept = () => {
                logger.error( 'handle on click accept' );
                acceptNotification( { ...latestNotification } );
            };

            const handleOnDeny = () => {
                logger.error( 'handle on click deny' );
                denyNotification( { ...latestNotification } );
            };
            return (
                <React.Fragment>
                    <CssBaseline />
                    <Paper elevation={0}>
                        <Box pt={1} pr={1} pb={1} pl={1}>
                            <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                wrap="nowrap"
                            >
                                <Grid item>
                                    <Box>
                                        <TagName style={{ fontSize: 38 }} />
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        {latestNotification.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-end" spacing={1}>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        onClick={handleOnAccept}
                                    >
                                        {latestNotification.acceptText}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color="primary"
                                        onClick={handleOnDeny}
                                    >
                                        {latestNotification.denyText}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                    <Divider />
                </React.Fragment>
            );
        }
        return <div />;
    }
}
