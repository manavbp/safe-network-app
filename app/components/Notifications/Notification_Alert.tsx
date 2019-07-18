import React, { Component } from 'react';
import { logger } from '$Logger';

const { dialog } = require( 'electron' ).remote;

interface Props {
    notificationCheckBox: boolean;
    latestNotification: Record<string, any>;
    acceptNotification: any;
    denyNotification: any;
    toggleCheckBox: any;
}

export class NotificationAlert extends React.PureComponent<Props> {
    render() {
        const {
            latestNotification,
            toggleCheckBox,
            acceptNotification,
            denyNotification,
            notificationCheckBox
        } = this.props;

        if (
            latestNotification.type === 'CLEARNET_WARNING_ALERT' &&
            notificationCheckBox === true
        ) {
            return <div />;
        }

        const handleOnAccept = () => {
            acceptNotification( { ...latestNotification } );
        };

        const handleOnDeny = () => {
            denyNotification( { ...latestNotification } );
        };

        const options = {
            icon: './resources/icons/32x32.png',
            title: latestNotification.title,
            message: latestNotification.message,
            buttons: latestNotification.buttons,
            checkboxLabel: latestNotification.checkboxLabel
                ? latestNotification.checkboxLabel
                : null
        };

        const responseHandler = ( response, checkboxChecked ) => {
            const buttonLength = options.buttons.length - 1;

            switch ( response ) {
                case 0:
                    // eslint-disable-next-line no-unused-expressions
                    buttonLength === 1
                        ? handleOnDeny()
                        : logger.error( 'Invalid Action Click' );
                    break;
                case 1:
                    // eslint-disable-next-line no-unused-expressions
                    buttonLength === 1 ? handleOnAccept() : handleOnDeny();
                    break;
                case 2:
                    handleOnAccept();
                    break;
                default:
                    logger.error( 'Invalid Button Click' );
            }

            if ( options.checkboxLabel ) {
                toggleCheckBox( { checkboxChecked } );
            }
        };

        const alert = dialog.showMessageBox(
            null,
            // @ts-ignore
            options,
            ( response, checkboxChecked ) =>
                responseHandler( response, checkboxChecked )
        );
        return <div />;
    }
}
