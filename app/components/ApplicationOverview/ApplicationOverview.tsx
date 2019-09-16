import React from 'react';
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
import { AppIcon } from '$Components/AppIcon';
// import { logger } from '$Logger';
import { AppStateButton } from '$Components/AppStateButton';
import { getAppStatusText } from '$Utils/app_utils';
import styles from './ApplicationOverview.css';
import { App } from '$Definitions/application.d';

interface Props {
    unInstallApp: Function;
    openApp: Function;
    pauseDownload: Function;
    cancelDownload: Function;
    resetAppInstallationState: Function;
    resumeDownload: Function;
    downloadAndInstallApp: Function;
    application: App;
}

export class ApplicationOverview extends React.PureComponent<Props> {
    render() {
        const { application } = this.props;

        const progressText = getAppStatusText( application );
        const secondaryText = application.error || progressText;

        return (
            <React.Fragment>
                <ListItem className={styles.list}>
                    <ListItemAvatar>
                        <AppIcon url={application.iconPath} />
                    </ListItemAvatar>
                    <Link to={`/application/${application.id}`}>
                        <ListItemText
                            className={styles.listText}
                            primary={application.name}
                            primaryTypographyProps={{
                                variant: secondaryText ? 'caption' : 'body2'
                            }}
                            secondary={secondaryText}
                            secondaryTypographyProps={{
                                color: application.error
                                    ? 'error'
                                    : 'textSecondary',
                                variant: 'body2'
                            }}
                        />
                    </Link>
                    <ListItemSecondaryAction className={styles.actions}>
                        <AppStateButton
                            {...this.props}
                            key="list-secondary-action-1"
                        />
                        <MeatballMenu
                            {...this.props}
                            key="list-secondary-action-2"
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <Divider />
            </React.Fragment>
        );
    }
}
