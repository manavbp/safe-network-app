import { createActions } from 'redux-actions';

export const TYPES = {
    RESET_TO_INITIAL_STATE: 'RESET_TO_INITIAL_STATE',
    RESET_APP_INSTALLATION_STATE: 'RESET_APP_INSTALLATION_STATE',
    UPDATE_APP_INFO_IF_NEWER: 'UPDATE_APP_INFO_IF_NEWER'
};

export const {
    resetAppInstallationState,
    resetToInitialState,
    updateAppInfoIfNewer
} = createActions(
    TYPES.RESET_APP_INSTALLATION_STATE,
    TYPES.RESET_TO_INITIAL_STATE,
    TYPES.UPDATE_APP_INFO_IF_NEWER
);
