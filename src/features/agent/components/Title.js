import { Typography } from '@mui/material'
import React from 'react'

function Title(props) {
    return (
        <Typography variant='body1' alignItems='center' display='flex'>
            {props.icon && React.cloneElement(props.icon, { sx: { ...props.icon.props.sx, mr: 1 } })}
            {props.text}
        </Typography>
    )
}

export default Title
