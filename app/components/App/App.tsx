import * as React from 'react';
import { notificationTypes } from '$Constants/notifications';
import { Notification } from '$Components/Notifications/Notifications';

interface Props {
    children: React.ReactChild;
    notifications: object;
    notificationCheckBox: boolean;
    acceptNotification: any;
    denyNotification: any;
    pushNotification: any;
    notificationToggleCheckBox: any;
}

export class App extends React.PureComponent<Props> {
    render() {
        const {
            notifications,
            children,
            notificationToggleCheckBox,
            acceptNotification,
            denyNotification,
            notificationCheckBox
        } = this.props;
        return (
            <React.Fragment>
                <Notification
                    notifications={notifications}
                    acceptNotification={acceptNotification}
                    denyNotification={denyNotification}
                    toggleCheckBox={notificationToggleCheckBox}
                    notificationCheckBox={notificationCheckBox}
                />
                {children}
            </React.Fragment>
        );
    }
}
