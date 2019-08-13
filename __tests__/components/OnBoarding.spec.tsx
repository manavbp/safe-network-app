import React from 'react';
import Fab from '@material-ui/core/Fab';
import { createShallow } from '@material-ui/core/test-utils';

import { OnBoarding } from '$Components/OnBoarding/OnBoarding';
import { GetStarted } from '$Components/OnBoarding/GetStarted';
import { Intro } from '$Components/OnBoarding/Intro/Intro';
import { BasicSettings } from '$Components/OnBoarding/BasicSettings/BasicSettings';
import { Stepper } from '$Components/OnBoarding/Stepper/Stepper';

const shallow = createShallow();

const shallowSetup = ( propOverrides? ) => {
    const props = Object.assign(
        {
            appPreferences: {
                shouldOnboard: true
            },
            userPreferences: {
                autoUpdate: false,
                pinToMenuBar: false,
                launchOnStart: false,
                showDeveloperApps: false,
                warnOnAccessingClearnet: false
            },
            getUserPreferences: jest.fn(),
            setUserPreferences: jest.fn(),
            setAppPreferences: jest.fn(),
            pinToTray: jest.fn(),
            autoLaunch: jest.fn(),
            storePreferences: jest.fn(),
            setOnboardCompleted: jest.fn(),
            history: {
                push: jest.fn()
            }
        },
        propOverrides
    );

    const wrapper = shallow( <OnBoarding {...props} /> );

    return {
        props,
        wrapper
    };
};

describe( 'On Boarding', () => {
    it( 'render', () => {
        const { wrapper } = shallowSetup();
        expect( wrapper ).toMatchSnapshot();
    } );

    it( 'stepper should show current position', () => {
        const { wrapper } = shallowSetup();
        const instance = wrapper.instance();
        expect( wrapper.find( Stepper ).props().steps ).toEqual(
            instance.totalSteps
        );

        wrapper.setState( { currentPosition: 0 } );
        expect( wrapper.find( Stepper ).props().activeStep ).toEqual( 0 );
        wrapper.setState( { currentPosition: 1 } );
        expect( wrapper.find( Stepper ).props().activeStep ).toEqual( 1 );
        wrapper.setState( { currentPosition: 2 } );
        expect( wrapper.find( Stepper ).props().activeStep ).toEqual( 2 );
    } );

    it( 'Go to Basic settings page on clicking next', () => {
        const { wrapper } = shallowSetup();
        wrapper.setState( { currentPosition: 1 } );
        wrapper
            .find( Stepper )
            .props()
            .onNext();
        expect( wrapper.state().currentPosition ).toEqual( 2 );
    } );

    it( 'Go back to Intro page from Basic settings page on clicking back', () => {
        const { wrapper } = shallowSetup();
        wrapper.setState( { currentPosition: 2 } );
        wrapper
            .find( Stepper )
            .props()
            .onBack();
        expect( wrapper.state().currentPosition ).toEqual( 1 );
    } );

    it( 'Go back to Get Started page from Intro page on clicking back', () => {
        const { wrapper } = shallowSetup();
        wrapper.setState( { currentPosition: 1 } );
        wrapper
            .find( Stepper )
            .props()
            .onBack();
        expect( wrapper.state().currentPosition ).toEqual( 0 );
    } );

    it( 'complete on clicking Next from basic settings page', () => {
        const { wrapper, props } = shallowSetup();
        wrapper.setState( { currentPosition: 2 } );
        wrapper
            .find( Stepper )
            .props()
            .onNext();
        expect( props.setAppPreferences ).toHaveBeenCalled();
    } );
} );
