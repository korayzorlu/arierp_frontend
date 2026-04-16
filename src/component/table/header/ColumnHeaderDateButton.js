import { Badge, badgeClasses, IconButton, styled } from '@mui/material'
import React from 'react'
import DateRangeIcon from '@mui/icons-material/DateRange';
import { setColumnHeaderDateDialog } from 'store/slices/notificationSlice';
import { useDispatch } from 'react-redux';
import ColumnHeaderDateDialog from './ColumnHeaderDateDialog';

function ColumnHeaderdateButton(props) {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(setColumnHeaderDateDialog(true));
    }

    return (
        <>
            <IconButton aria-label="delete" size="small" color='primary' sx={{ mx: 0.5 }} onClick={handleClick}>
                <DateRangeIcon fontSize="small"/>
            </IconButton>
            <ColumnHeaderDateDialog
            info={props.dates || []}
            />
        </>
        
    )
}

export default ColumnHeaderdateButton
