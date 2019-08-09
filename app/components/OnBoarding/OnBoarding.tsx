import React, { Component } from 'react';
import { History } from 'history';
import Grid from '@material-ui/core/Grid';
import { Switch, Route } from 'react-router';
import { styled } from '@material-ui/core/styles';
import {
    UserPreferences,
    AppPreferences,
    Preferences,
    LaunchpadState
} from '$Definitions/application.d';

import { Stepper } from './Stepper/Stepper';
import { GetStarted } from './GetStarted';
import { Intro } from './Intro';
import { BasicSettings } from './BasicSettings/BasicSettings';
import {
    HOME,
    INTRO,
    BASIC_SETTINGS,
    ON_BOARDING
} from '$Constants/routes.json';

interface Props {
    setAppPreferences: Function;
    aliasShouldOnboard: Function;
    triggerSetAsTrayWindow: Function;
    userPreferences: UserPreferences;
    appPreferences: AppPreferences;
    setUserPreferences: Function;
    getUserPreferences: Function;
    storePreferences: Function;
    isTrayWindow: boolean;
    setOnboardCompleted: Function;
    autoLaunch: Function;
    history?: History;
}

const Base = styled( Grid )( {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
} );

export class OnBoarding extends React.Component<Props> {
    state = {
        currentPosition: 0
    };

    totalSteps = 3;

    componentWillMount() {
        const { appPreferences, history, getUserPreferences } = this.props;

        if ( !appPreferences.shouldOnboard ) {
            history.push( HOME );
        }
        getUserPreferences();
    }

    completed = () => {
        const {
            storePreferences,
            userPreferences,
            autoLaunch,
            setAppPreferences
        } = this.props;

        const appPreferences: AppPreferences = {
            shouldOnboard: false
        };

        const newUserPreferences: UserPreferences = {
            ...userPreferences
        };

        const preferences: Preferences = {
            userPreferences: { ...newUserPreferences },
            appPreferences
        };

        storePreferences( preferences );
        setAppPreferences( { shouldOnboard: false } );

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
            getUserPreferences,
            storePreferences,
            isTrayWindow,
            triggerSetAsTrayWindow,
            autoLaunch,
            history
        } = this.props;

        const isGetStarted = currentPosition === 0;

        return (
            <Base container>
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
                                    triggerSetAsTrayWindow={
                                        triggerSetAsTrayWindow
                                    }
                                    autoLaunch={autoLaunch}
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
            </Base>
        );
    }
}
