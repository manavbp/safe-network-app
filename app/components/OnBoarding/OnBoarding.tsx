import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import { Switch, Route, Redirect } from 'react-router';
import { styled } from '@material-ui/core/styles';
import {
    UserPreferences,
    AppPreferences,
    Preferences,
    LaunchpadState
} from '$Definitions/application.d';

import { Stepper } from '$Components/OnBoarding/Stepper/Stepper';
import { GetStarted } from './GetStarted';
import { Intro } from './Intro';
import { BasicSettings } from './BasicSettings/BasicSettings';
import {
    HOME,
    INTRO,
    BASIC_SETTINGS,
    ON_BOARDING
} from '$Constants/routes.json';
import styles from './OnBoarding.css';

interface Props {
    setAppPreferences: Function;
    triggerSetAsTrayWindow: Function;
    userPreferences: UserPreferences;
    appPreferences: AppPreferences;
    setUserPreferences: Function;
    getUserPreferences: Function;
    isTrayWindow: boolean;
    autoLaunch: Function;
    history?: History;
}

export class OnBoarding extends React.Component<Props> {
    state = {
        currentPosition: 0
    };

    totalSteps = 3;

    completed = () => {
        const {
            userPreferences,
            autoLaunch,
            setAppPreferences,
            history,
            isTrayWindow,
            triggerSetAsTrayWindow
        } = this.props;

        const appPreferences: AppPreferences = {
            shouldOnboard: false
        };

        setAppPreferences( { shouldOnboard: false } );

        if ( userPreferences.pinToMenuBar !== isTrayWindow )
            triggerSetAsTrayWindow( !isTrayWindow );

        if ( userPreferences.launchOnStart ) {
            autoLaunch( true );
        }
    };

    onNext = () => {
        const { currentPosition } = this.state;
        const position = currentPosition;

        if ( currentPosition < this.totalSteps - 1 ) {
            this.setState( {
                currentPosition: currentPosition + 1
            } );
        } else {
            this.completed();
        }
    };

    onBack = () => {
        const { currentPosition } = this.state;
        const position = currentPosition;

        if ( currentPosition > 0 ) {
            this.setState( {
                currentPosition: currentPosition - 1
            } );
        }
    };

    render() {
        const { currentPosition } = this.state;
        const {
            userPreferences,
            setUserPreferences,
            appPreferences,
            getUserPreferences,
            isTrayWindow,
            triggerSetAsTrayWindow,
            autoLaunch,
            history
        } = this.props;

        const isGetStarted = currentPosition === 0;

        if ( !appPreferences.shouldOnboard ) return <Redirect to={HOME} />;

        return (
            <Grid className={styles.Base} container>
                <Grid item xs={12}>
                    <Switch>
                        <Route
                            exact
                            path={ON_BOARDING}
                            component={() => (
                                <GetStarted
                                    onClickGetStarted={this.onNext}
                                    // @ts-ignore
                                    history={history}
                                />
                            )}
                        />
                        <Route path={INTRO} component={() => <Intro />} />
                        <Route
                            path={BASIC_SETTINGS}
                            component={() => (
                                <BasicSettings
                                    userPreferences={userPreferences}
                                    setUserPreferences={setUserPreferences}
                                    isTrayWindow={isTrayWindow}
                                />
                            )}
                        />
                    </Switch>
                </Grid>
                <Stepper
                    theme={isGetStarted ? 'white' : 'default'}
                    showButtons={!isGetStarted}
                    noElevation={isGetStarted}
                    onNext={this.onNext}
                    onBack={this.onBack}
                    steps={this.totalSteps}
                    activeStep={this.state.currentPosition}
                    // @ts-ignore
                    history={history}
                />
            </Grid>
        );
    }
}
