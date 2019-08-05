import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BasicSettings } from '$Components/BasicSettings';

import { setUserPreferences } from '$Actions/launchpad_actions';
import {
    storePreferences,
    autoLaunch,
    triggerSetAsTrayWindow
} from '$Actions/alias/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        userPreferences: state.launchpad.userPreferences,
        isTrayWindow: state.launchpad.isTrayWindow
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setUserPreferences,
        storePreferences,
        autoLaunch,
        triggerSetAsTrayWindow
    };
    return bindActionCreators( actions, dispatch );
};

export const OnBoardingPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( BasicSettings );
