import { Selector } from 'testcafe';
// eslint-disable-next-line import/no-extraneous-dependencies
import { waitForReact } from 'testcafe-react-selectors';
import { clickOnMainMenuItem } from 'testcafe-browser-provider-electron';
import { getPageTitle, getPageUrl } from './helpers';

fixture`On Boarding Page`.page( '../app/app.html' ).beforeEach( async () => {
    await waitForReact();
} );

test( 'e2e', async ( t ) => {
    await t.expect( getPageTitle() ).eql( 'SAFE Launchpad' );
    await t.debug();
} );
