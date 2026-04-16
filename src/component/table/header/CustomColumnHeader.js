import { Badge, badgeClasses, Grid, IconButton, styled } from '@mui/material'
import React from 'react'
import WarningIcon from '@mui/icons-material/Warning';
import ColumnHeaderWarningButton from './ColumnHeaderWarningButton';
import ColumnHeaderInfoButton from './ColumnHeaderInfoButton';
import ColumnHeaderdateButton from './ColumnHeaderDateButton';

function CustomColumnHeader(props) {
    return (
        <>

            {props.label}

            {
                props.info?.length > 0
                ?
                    <ColumnHeaderInfoButton info={props.info || []}/>
                :
                    null
            }

            {
                props.warnings?.length > 0
                ?
                    <ColumnHeaderWarningButton warnings={props.warnings || []}/>
                :
                    null
            }

            {
                props.dateFilter
                ?
                    <ColumnHeaderdateButton dates={props.dates || []}/>
                :
                    null
            }

        </>
    )
}

export default CustomColumnHeader
