import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Settings from '@material-ui/icons/Settings';
import Star from '@material-ui/icons/Star';
import { I18n } from 'react-redux-i18n';
import { SETTINGS, ON_BOARDING } from '$Constants/routes.json';

import appLogo from '$Assets/images/app_logo.png';

import styles from './HeaderBar.css';

interface Props {
    currentPath: string;
}

const BackButton = ( { location } ) => {
    return (
        <React.Fragment>
            {location.pathname !== '/' && (
                <Link to="/">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="Go Backwards"
                    >
                        <ArrowBack fontSize="inherit" />
                    </IconButton>
                </Link>
            )}
        </React.Fragment>
    );
};

const AppLogo = () => {
    return (
        <Box className={styles.appLogo}>
            <img src={appLogo} alt="App logo" />
        </Box>
    );
};

export class HeaderBar extends React.PureComponent<Props> {
    render() {
        const { currentPath } = this.props;
        // path always starts with a slash
        const targetTitle = currentPath.split( '/' )[1];
        const title = I18n.t( `pages.${targetTitle}` );

        return (
            <Box className={styles.base}>
                <Toolbar className={styles.wrap}>
                    {
                        // This regex route matches everywhere, but `/` home
                    }
                    <Box>
                        <Route path="/" component={BackButton} />
                        {currentPath === '/' ? (
                            <AppLogo />
                        ) : (
                            <Typography
                                className={styles.title}
                                aria-label="title"
                                variant="body1"
                            >
                                {title}
                            </Typography>
                        )}
                    </Box>
                    <Box>
                        <Link to={SETTINGS}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="Go to settings"
                            >
                                <Settings fontSize="inherit" />
                            </IconButton>
                        </Link>
                    </Box>
                </Toolbar>
            </Box>
        );
    }
}
