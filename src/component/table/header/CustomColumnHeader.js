import { Badge, badgeClasses, Grid, IconButton, styled } from '@mui/material'
import React from 'react'
import WarningIcon from '@mui/icons-material/Warning';
import ColumnHeaderWarningButton from './ColumnHeaderWarningButton';

function CustomColumnHeader(props) {
    return (
        <>

            {props.label}

            {
                props.warnings?.length > 0
                ?
                    <ColumnHeaderWarningButton warnings={props.warnings || []}/>
                :
                    null
            }

        </>
    )
}

export default CustomColumnHeader
