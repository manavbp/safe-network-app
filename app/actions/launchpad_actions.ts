import { createActions } from 'redux-actions';
import {
    UserPreferences,
    AppPreferences,
    Preferences
} from '$Definitions/application.d';
import { settingsHandler } from '$Actions/helpers/settings_handler';

import { triggerSetAsTrayWindow } from './alias/launchpad_actions';

export const TYPES = {
    ONBOARD_COMPLETED: 'ONBOARD_COMPLETED',
    PUSH_NOTIFICATION: 'PUSH_NOTIFICATION',
    DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
    SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
    SET_APP_PREFERENCES: 'SET_APP_PREFERENCES',
    SET_AS_TRAY_WINDOW: 'SET_AS_TRAY_WINDOW',
    SET_CURRENT_PATH: 'SET_CURRENT_PATH'
};

export const {
    pushNotification,
    onboardCompleted,
    dismissNotification,
    setUserPreferences,
    setAppPreferences,
    setAsTrayWindow,
    setCurrentPath
} = createActions(
    TYPES.PUSH_NOTIFICATION,
    TYPES.ONBOARD_COMPLETED,
    TYPES.DISMISS_NOTIFICATION,
    TYPES.SET_USER_PREFERENCES,
    TYPES.SET_APP_PREFERENCES,
    TYPES.SET_AS_TRAY_WINDOW,
    TYPES.SET_CURRENT_PATH
);

export const getUserPreferences = () => {
    return async ( dispatch ) => {
        const { userPreferences } = await settingsHandler.getPreferences();
        dispatch( setUserPreferences( userPreferences ) );
    };
};
