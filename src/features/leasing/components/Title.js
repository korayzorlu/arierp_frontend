import { Typography } from '@mui/material'
import React from 'react'

function Title(props) {
    return (
        <Typography alignItems='center' display='flex' sx={{color: props.color ? props.color : null}}>
            {props.icon && React.cloneElement(props.icon, { sx: { ...props.icon.props.sx, mr: 1 } })}
            {props.text}
        </Typography>
    )
}

export default Title
