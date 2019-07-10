import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { App } from '$Components/App/App';
import {
    acceptNotification,
    denyNotification
} from '$Actions/alias/notification_actions';
import {
    pushNotification,
    dismissNotification
} from '$Actions/launchpad_actions';
import { logger } from '$Logger';

function mapStateToProperties( state ) {
    return {
        notifications: state.launchpad.notifications
    };
}
function mapDispatchToProperties( dispatch ) {
    const actions = {
        acceptNotification,
        denyNotification,
        pushNotification
    };

    return bindActionCreators( actions, dispatch );
}
export const AppWindow: React.ComponentClass = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( App );
