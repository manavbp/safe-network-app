module.exports = {
    remote: {
        app: {
            getAppPath: jest.fn(),
            getPath: jest.fn().mockReturnValue( 'path/to/file' )
        },
        dialog: {
            showMessageBox: jest.fn()
        },
        getGlobal: jest.fn()
    },
    nativeImage: {
        createFromPath: jest.fn()
    }
};
