import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Avatar,
    Fab,
    Typography
} from '@material-ui/core';
import indigo from '@material-ui/core/colors/indigo';
import FolderIcon from '@material-ui/icons/Folder';
import { MeatballMenu } from '$Components/MeatballMenu';
import { logger } from '$Logger';
import { AppStateButton } from '$Components/AppStateButton';
import styles from './ApplicationOverview.css';
import { App } from '$Definitions/application.d';

interface Props {
    uninstallApp: Function;
    openApp: Function;
    installApp: Function;
    application: App;
}

export class ApplicationOverview extends Component<Props> {
    handleDownload = () => {
        const { application, installApp } = this.props;
        logger.silly(
            'ApplicationOverview: clicked download ',
            application.name
        );
        installApp( application );
    };

    handleOpen = () => {
        const { application, openApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked open', application );
        openApp( application );
    };

    handleUninstall = () => {
        const { application, uninstallApp } = this.props;
        logger.silly( 'ApplicationOverview: clicked uninstall', application );
        uninstallApp( application );
    };

    render() {
        const { application } = this.props;

        return (
            <React.Fragment>
                <ListItem className={styles.list}>
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <Link to={`/application/${application.id}`}>
                        <ListItemText primary={application.name} />
                    </Link>
                    <ListItemSecondaryAction className={styles.actions}>
                        <AppStateButton {...this.props} />
                        <MeatballMenu {...this.props} />
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
            </React.Fragment>
        );
    }
}
