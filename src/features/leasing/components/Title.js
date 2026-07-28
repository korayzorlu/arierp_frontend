import { Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';

function Title(props) {
    const {dark,lang} = useSelector((store) => store.auth);

    return (
        <Typography alignItems='center' display='flex' sx={{color: props.color ? props.color : (dark ? "frostedbirch.main" : "smoke.main"), fontWeight: 500}}>
            {props.icon && React.cloneElement(props.icon, { sx: { ...props.icon.props.sx, mr: 1 } })}
            {props.text}
        </Typography>
    )
}

export default Title
