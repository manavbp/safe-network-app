import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle } from './helpers';

const getPreferenceItems = () => {
    const Preferences = Selector( 'ul' ).withAttribute(
        'aria-label',
        'Preferences'
    );
    return Preferences.child( 'li' );
};

fixture`Settings Page`
    .page( '../app/app.html' )
    .beforeEach( async () => {
        await waitForReact();
    } )
    .afterEach( async () => {
        // @ts-ignore
        await clickOnMainMenuItem( ['Tests', 'Reset Preferences'] );
    } );

test( 'e2e', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Network App' );
} );

test( 'can navigate to settings page', async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go to settings' )
    );

    await t.expect( Selector( 'h5' ).withText( 'Settings' ).exists ).ok();
} );

test( 'can toggle switch buttons', async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go to settings' )
    );

    await t.expect( Selector( 'h5' ).withText( 'Settings' ).exists ).ok();

    const PreferencesItemArray = getPreferenceItems();

    const AutoUpdatePreference = PreferencesItemArray.nth( 0 );

    await t
        .expect(
            AutoUpdatePreference.find( '.MuiListItemText-primary' ).textContent
        )
        .eql( 'Auto Update' )
        .click( AutoUpdatePreference.find( 'input.MuiSwitch-input' ) );

    await t
        .expect( AutoUpdatePreference.find( 'input.MuiSwitch-input' ).checked )
        .ok();
} );

test( 'Go back from Settings page to Home', async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go to settings' )
    );

    await t.expect( Selector( 'h5' ).withText( 'Settings' ).exists ).ok();

    await t
        .expect( getPageUrl() )
        .contains( '#/settings' )
        .click( Selector( 'button' ).withAttribute( 'aria-label', 'Go Backwards' ) )
        .expect( getPageUrl() )
        .contains( '#/' );
} );

test( 'Changing any preference should persist', async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go to settings' )
    );

    await t.expect( Selector( 'h5' ).withText( 'Settings' ).exists ).ok();

    const PreferencesItemArray = getPreferenceItems();

    const AutoUpdatePreference = PreferencesItemArray.nth( 0 );

    await t
        .expect( getPageUrl() )
        .contains( '#/settings' )
        .expect(
            AutoUpdatePreference.find( '.MuiListItemText-primary' ).textContent
        )
        .eql( 'Auto Update' )
        .expect( AutoUpdatePreference.find( 'input.MuiSwitch-input' ).checked )
        .notOk()
        .click( AutoUpdatePreference.find( 'input.MuiSwitch-input' ) )
        .click( Selector( 'button' ).withAttribute( 'aria-label', 'Go Backwards' ) )
        .expect( getPageUrl() )
        .contains( '#/' );

    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go to settings' )
    );

    await t.expect( Selector( 'h5' ).withText( 'Settings' ).exists ).ok();

    await t
        .expect( getPageUrl() )
        .contains( '#/settings' )
        .expect(
            AutoUpdatePreference.find( '.MuiListItemText-primary' ).textContent
        )
        .eql( 'Auto Update' )
        .expect( AutoUpdatePreference.find( 'input.MuiSwitch-input' ).checked )
        .ok();
} );
