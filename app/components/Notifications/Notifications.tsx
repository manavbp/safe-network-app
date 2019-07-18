import React, { Component } from 'react';
import { NotificationNative } from '$Components/Notifications/Notification_Native';
import { NotificationAlert } from '$Components/Notifications/Notification_Alert';
import { logger } from '$Logger';

interface Props {
    notificationCheckBox: boolean;
    notifications: Record<string, any>;
    acceptNotification: any;
    denyNotification: any;
    toggleCheckBox: any;
}

export class Notification extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            acceptNotification,
            denyNotification,
            toggleCheckBox,
            notificationCheckBox
        } = this.props;

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

            latestNotification.icon = latestNotification.icon || 'InfoIcon';
            latestNotification.acceptText =
                latestNotification.acceptText || 'RESUME';
            latestNotification.denyText =
                latestNotification.denyText || 'DISMISS';
            latestNotification.title =
                latestNotification.title || 'Uhh Ohh Something Went Wrong!';

            if ( latestNotification.notificationType === 'Native' ) {
                return (
                    <NotificationNative
                        latestNotification={latestNotification}
                        acceptNotification={acceptNotification}
                        denyNotification={denyNotification}
                    />
                );
            }
            if ( latestNotification.notificationType === 'alert' ) {
                return (
                    <NotificationAlert
                        latestNotification={latestNotification}
                        acceptNotification={acceptNotification}
                        denyNotification={denyNotification}
                        toggleCheckBox={toggleCheckBox}
                        notificationCheckBox={notificationCheckBox}
                    />
                );
            }
        }
        return <div />;
    }
}
