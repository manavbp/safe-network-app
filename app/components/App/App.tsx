import * as React from 'react';
import { notificationTypes } from '$Constants/notifications';
import { Notification } from '$Components/Notifications/Notifications';

interface Props {
    children: React.ReactChild;
    notifications: object;
    acceptNotification: any;
    denyNotification: any;
    pushNotification: any;
}

export class App extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            children,
            acceptNotification,
            denyNotification
        } = this.props;
        return (
            <React.Fragment>
                <Notification
                    notifications={notifications}
                    acceptNotification={acceptNotification}
                    denyNotification={denyNotification}
                />
                {children}
            </React.Fragment>
        );
    }
}
