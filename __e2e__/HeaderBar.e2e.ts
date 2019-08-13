import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageUrl, getPageTitle } from './helpers';

const assertNoConsoleErrors = async ( t ): Promise<void> => {
    const { error } = await t.getBrowserConsoleMessages();
    await t.expect( error ).eql( [] );
};

fixture`HeaderBar`.page( '../app/app.html' ).beforeEach( async () => {
    // @ts-ignore
    await clickOnMainMenuItem( ['Tests', `Skip OnBoard App`] );
    await waitForReact();
} );
// .afterEach( assertNoConsoleErrors );

test( 'should open window', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Network App' );
} );

test(
    "should haven't any logs in console of main window",
    assertNoConsoleErrors
);

// we start as a tray window right now
test.before( async ( t ) => {
    // @ts-ignore
    await clickOnMainMenuItem( ['Tests', 'Reset Preferences'] );
} )( 'can navigate back from another page.', async ( t ) => {
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go to settings' )
    );
    await t.click( Selector( 'h5' ).withText( 'Settings' ) );
    await t.click(
        Selector( 'button' ).withAttribute( 'aria-label', 'Go Backwards' )
    );
    await t
        .expect(
            Selector( 'button' ).withAttribute( 'aria-label', 'Go Backwards' )
                .exists
        )
        .notOk();
} );
