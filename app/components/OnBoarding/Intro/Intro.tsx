import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Base, Container, Title } from './style';

export const Intro = () => {
    return (
        <Base elevation={0} aria-label="IntroPage">
            <Container>
                <Title variant="h5">One Place for All SAFE Apps</Title>
                <Typography>
                    A one-stop shop to access all SAFE Apps and manage instant
                    app updates.
                </Typography>
            </Container>
        </Base>
    );
};
