import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Base, LogoBase, Container, Title, GetStartedButton } from './styles';
// @ts-ignore
import { INTRO } from '$App/constants/routes.json';

// @ts-ignore
import Logo from '$App/assets/images/logo.svg';

interface Props {
    onClickGetStarted: Function;
    history?: History;
}

export const GetStarted = ( properties ) => {
    const { onClickGetStarted, history } = properties;
    return (
        <Base aria-label="GetStarted">
            <LogoBase>
                <img src={Logo} alt="Launchpad logo" />
            </LogoBase>
            <Container>
                <Title variant="h5">SAFE Launchpad</Title>
                <Typography>
                    All the apps you need to try the SAFE Network
                </Typography>
                <GetStartedButton
                    variant="extended"
                    size="medium"
                    aria-label="GetStarted"
                    onClick={() => {
                        onClickGetStarted();
                        // @ts-ignore
                        history.push( INTRO );
                    }}
                >
                    Get Started
                </GetStartedButton>
            </Container>
        </Base>
    );
};
