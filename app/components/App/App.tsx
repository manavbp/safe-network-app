import * as React from 'react';
import { Grid } from '@material-ui/core';
import { notificationTypes } from '$Constants/notifications';
import { Notification } from '$Components/Notifications/Notifications';
import { HeaderBar } from '$Components/HeaderBar';

import styles from './App.css';

interface Props {
    children: React.ReactChild;
    notifications: object;
    notificationCheckBox: boolean;
    acceptNotification: any;
    denyNotification: any;
    pushNotification: any;
    notificationToggleCheckBox: any;
    router: {
        location: {
            pathname: string;
        };
    };
}

export class App extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            children,
            notificationToggleCheckBox,
            acceptNotification,
            denyNotification,
            notificationCheckBox,
            router
        } = this.props;

        const currentPath = router.location.pathname;

        return (
            <div className={styles.wrap}>
                <div className={styles.headerBar}>
                    <HeaderBar currentPath={currentPath} />
                </div>
                <div className={styles.containerBase}>
                    <Notification
                        notifications={notifications}
                        acceptNotification={acceptNotification}
                        denyNotification={denyNotification}
                        toggleCheckBox={notificationToggleCheckBox}
                        notificationCheckBox={notificationCheckBox}
                    />
                    <Grid container className="commonBase">
                        {children}
                    </Grid>
                </div>
            </div>
        );
    }
}
