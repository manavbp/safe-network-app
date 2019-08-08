import * as launchpad from '$Actions/alias/launchpad_actions';

describe( 'Alias launchpad actions', () => {
    it( 'should have types', () => {
        expect( launchpad.TYPES ).toBeDefined();
    } );

    it( 'should store preferences', () => {
        expect( launchpad.storePreferences ).toBeDefined();
        expect( launchpad.storePreferences().meta.trigger ).toEqual(
            launchpad.TYPES.ALIAS_STORE_PREFERENCES
        );
    } );

    it( 'should auto launch launchpad', () => {
        expect( launchpad.autoLaunch ).toBeDefined();
        expect( launchpad.autoLaunch().meta.trigger ).toEqual(
            launchpad.TYPES.ALIAS_AUTO_LAUNCH
        );
    } );

    it( 'should as tray window', () => {
        expect( launchpad.triggerSetAsTrayWindow ).toBeDefined();
        expect( launchpad.triggerSetAsTrayWindow().meta.trigger ).toEqual(
            launchpad.TYPES.ALIAS_SET_AS_TRAY_WINDOW
        );
    } );
} );
