import React from 'react';
import { MenuItem, Typography } from '@material-ui/core';

export const MenuItemWrapper = ( props ) => {
    const { children } = props;

    return (
        <MenuItem {...props}>
            <Typography variant="body2">{children}</Typography>
        </MenuItem>
    );
};
