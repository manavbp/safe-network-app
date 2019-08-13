import React, { Component } from 'react';
import List from '@material-ui/core/List';

import { PreferenceItem } from './PreferenceItem';

import { UserPreferences } from '$Definitions/application.d';
import { generateRandomString } from '$Utils/app_utils';

interface Props {
    userPreferences: UserPreferences;
    requiredItems?: { [item: string]: boolean };
    onChange: Function;
    onChangeLaunchOnStart: Function;
    onChangePinToMenu: Function;
    isTrayWindow: boolean;
}

export class Preferences extends Component<Props> {
    static defaultProps = {
        userPreference: {},
        requiredItems: {
            autoUpdate: true,
            pinToMenuBar: true,
            launchOnStart: true,
            showDeveloperApps: true,
            warnOnAccessingClearnet: true
        },
        onChange: () => {},
        onChangeLaunchOnStart: () => {},
        onChangePinToMenu: () => {}
    };

    private handleChange = ( name: string, changedStatus: boolean ) => {
        const {
            userPreferences,
            onChange,
            onChangeLaunchOnStart,
            onChangePinToMenu,
            isTrayWindow
        } = this.props;

        switch ( name ) {
            case 'pinToMenuBar':
                onChangePinToMenu( !isTrayWindow );
                break;
            case 'launchOnStart':
                onChangeLaunchOnStart( changedStatus );
                break;
            default:
                break;
        }

        if ( name === 'pinToMenuBar' ) userPreferences[name] = !isTrayWindow;
        else userPreferences[name] = changedStatus;

        console.log( 'onChange called' );
        onChange( userPreferences );
    };

    render() {
        const { userPreferences, requiredItems } = this.props;
        const requiredItemArray = Object.keys( requiredItems );

        return (
            <List aria-label="Preferences">
                {Object.keys( userPreferences ).map( ( userPreference ) => {
                    if ( !requiredItemArray.includes( userPreference ) )
                        return null;

                    return (
                        <PreferenceItem
                            key={generateRandomString()}
                            name={userPreference}
                            status={userPreferences[userPreference]}
                            onChange={this.handleChange}
                            disabled={!requiredItems[userPreference]}
                        />
                    );
                } )}
            </List>
        );
    }
}
