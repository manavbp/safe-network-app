import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Settings } from '$Components/Settings';

import {
    setUserPreferences,
    getUserPreferences
} from '$Actions/launchpad_actions';
import { storePreferences, autoLaunch } from '$Actions/alias/launchpad_actions';

const mapStateToProperties = ( state ) => {
    return {
        userPreferences: state.launchpad.userPreferences
    };
};

const mapDispatchToProperties = ( dispatch ) => {
    const actions = {
        setUserPreferences,
        getUserPreferences,
        storePreferences,
        autoLaunch
    };
    return bindActionCreators( actions, dispatch );
};

export const SettingsPage: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Settings );
