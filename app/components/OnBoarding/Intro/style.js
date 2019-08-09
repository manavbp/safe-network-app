import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export const Base = styled( Paper )( {
    width: '100%',
    height: '675%',
    backgroundImage: `url(${'assets/images/on_boarding_popup_bg.png'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
} );

export const Container = styled( Box )( {
    padding: '0 24px',
    textAlign: 'center'
} );

export const Title = styled( Typography )( {
    paddingTop: '450px',
    marginBottom: '16px'
} );
