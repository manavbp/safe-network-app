import * as notificationActions from '$Actions/alias/notification_actions';

describe( 'Notification Actions', () => {
    it( 'should have types', () => {
        expect( notificationActions.TYPES ).toBeDefined();
    } );

    it( 'should Accept Notification', () => {
        expect( notificationActions.acceptNotification ).toBeDefined();
        expect( notificationActions.acceptNotification().meta.trigger ).toEqual(
            notificationActions.TYPES.ACCEPT_NOTIFICATION
        );
    } );

    it( 'should Deny Notification', () => {
        expect( notificationActions.denyNotification ).toBeDefined();
        expect( notificationActions.denyNotification().meta.trigger ).toEqual(
            notificationActions.TYPES.DENY_NOTIFICATION
        );
    } );
} );
