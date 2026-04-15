import { Badge, badgeClasses, IconButton, styled } from '@mui/material'
import React from 'react'
import HelpIcon from '@mui/icons-material/Help';
import ColumnHeaderInfoDialog from './ColumnHeaderInfoDialog';
import { setColumnHeaderInfoDialog } from 'store/slices/notificationSlice';
import { useDispatch } from 'react-redux';

function ColumnHeaderInfoButton(props) {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(setColumnHeaderInfoDialog(true));
    }

    return (
        <>
            <IconButton aria-label="delete" size="small" color='info' sx={{ mx: 0.5 }} onClick={handleClick}>
                <HelpIcon fontSize="small"/>
            </IconButton>
            <ColumnHeaderInfoDialog
            info={props.info || []}
            />
        </>
        
    )
}

export default ColumnHeaderInfoButton
