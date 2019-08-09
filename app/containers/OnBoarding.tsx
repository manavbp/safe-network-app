import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { OnBoarding } from '$Components/OnBoarding/OnBoarding';

import {
    setUserPreferences,
    setAppPreferences,
    getUserPreferences
} from '$Actions/launchpad_actions';
import {
    storePreferences,
    autoLaunch,
    triggerSetAsTrayWindow
} from '$Actions/alias/launchpad_actions';

const mapStateToProperties = ( state ) => {
    console.log( 'OnBoarding page called' );
    return {
        userPreferences: state.launchpad.userPreferences,
        appPreferences: state.launchpad.appPreferences,
        isTrayWindow: state.launchpad.isTrayWindow
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setAppPreferences,
        setUserPreferences,
        getUserPreferences,
        storePreferences,
        autoLaunch,
        triggerSetAsTrayWindow
    };
    return bindActionCreators( actions, dispatch );
};

export const OnBoardingPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( OnBoarding );
