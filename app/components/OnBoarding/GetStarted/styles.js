import deepOrange from '@material-ui/core/colors/deepOrange';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import { styled } from '@material-ui/core/styles';

export const Base = styled( Paper )( {
    width: '100%',
    height: '100%',
    minHeight: '600px',
    background: 'linear-gradient(156.98deg, #FA541C -164.31%, #454545 101.04%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
} );

export const LogoBase = styled( Box )( {
    display: 'flex',
    width: '80px',
    height: '80px',
    backgroundColor: '#FA541C',
    borderRadius: '50%',
    justifyContent: 'center',
    boxShadow:
        '0px 0px 100px #FA541C, 0px 0px 50px #FA541C, 0px 0px 23px rgba(0, 0, 0, 0.25)'
} );

export const Container = styled( Box )( {
    textAlign: 'center',
    marginTop: '60px',
    color: '#fff',
    padding: '0 40px'
} );

export const Title = styled( Typography )( {
    marginBottom: '20px'
} );

export const GetStartedButton = styled( Fab )( {
    textTransform: 'uppercase',
    // height: '36px',
    marginTop: '30px',
    backgroundColor: deepOrange[500],
    color: '#fff'
} );
