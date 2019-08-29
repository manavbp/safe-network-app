import React from 'react';
import { withStyles, styled } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import Button from '@material-ui/core/Button';
import MobileStepper from '@material-ui/core/MobileStepper';
import {
    ON_BOARDING,
    BASIC_SETTINGS,
    INTRO,
    HOME
} from '$Constants/routes.json';

interface Props {
    showButtons?: boolean;
    noElevation?: boolean;
    theme?: 'default' | 'white';
    onNext: Function;
    onBack: Function;
    steps: number;
    activeStep: number;
}

const defaultTheme = {
    root: {
        backgroundColor: '#fff'
    },
    dot: {
        backgroundColor: indigo[100]
    },
    dotActive: {
        backgroundColor: indigo[800]
    }
};

const whiteTheme = {
    root: {
        backgroundColor: 'transparent'
    },
    dot: {
        backgroundColor: 'rgba(#fff, 0.3)'
    },
    dotActive: {
        backgroundColor: '#fff'
    }
};

export const Stepper = ( properties ) => {
    const {
        showButtons,
        theme,
        steps,
        activeStep,
        onBack,
        onNext,
        noElevation
    } = properties;

    const NavButton = styled( Button )( {
        color: indigo[800],
        visibility: showButtons ? 'visible' : 'hidden'
    } );

    const NextButton = (
        <NavButton
            size="small"
            aria-label="OnBoardingNextButton"
            onClick={() => onNext()}
        >
            {activeStep === steps - 1 ? 'Save' : 'Next'}
        </NavButton>
    );
    const BackButton = (
        <NavButton
            size="small"
            aria-label="OnBoardingBackButton"
            onClick={() => onBack()}
        >
            Back
        </NavButton>
    );

    const StyledStepper = withStyles(
        theme === 'white' ? whiteTheme : defaultTheme
    )( MobileStepper );

    return (
        <StyledStepper
            elevation={noElevation ? 0 : 4}
            variant="dots"
            steps={steps}
            position="bottom"
            activeStep={activeStep}
            nextButton={NextButton}
            backButton={BackButton}
        />
    );
};

Stepper.defaultProps = {
    showButtons: true,
    steps: 3,
    theme: 'default',
    activeStep: 0,
    noElevation: false
};
