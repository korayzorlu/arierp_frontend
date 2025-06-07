import { alpha, FormControlLabel, styled, Switch } from '@mui/material';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function AndroidSwitch(props) {
    const {children,className,checked,label,onChange,disabled} = props;

    const {dark} = useSelector((store) => store.auth);

    const Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&::before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&::after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
        },
        '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
        },
        // '& .MuiSwitch-switchBase.Mui-checked': {
        //     color: dark ? theme.palette.mars.main : theme.palette.primary.main,
        //     '&:hover': {
        //     backgroundColor: alpha(dark ? theme.palette.mars.main : theme.palette.primary.main, theme.palette.action.hoverOpacity),
        //     },
        // },
        // '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        //     backgroundColor: dark ? theme.palette.mars.main : theme.palette.primary.main,
        // },
    }));

    return (
        <FormControlLabel
        className={className}
        control={
            <Android12Switch
            //defaultChecked={defaultChecked}
            checked={checked} onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            />
        }
        label={label || ""}
        />
    )
}

export default AndroidSwitch
