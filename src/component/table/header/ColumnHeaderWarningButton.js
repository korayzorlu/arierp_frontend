import { Badge, badgeClasses, IconButton, styled } from '@mui/material'
import React from 'react'
import WarningIcon from '@mui/icons-material/Warning';
import ColumnHeaderWarningDialog from './ColumnHeaderWarningDialog';
import { setColumnHeaderWarningDialog } from 'store/slices/notificationSlice';
import { useDispatch } from 'react-redux';

function ColumnHeaderWarningButton(props) {
    const dispatch = useDispatch();

    const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
        top: -10px;
        right: 0;
    }
    `;

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch(setColumnHeaderWarningDialog(true));
    }

    return (
        <>
            <IconButton aria-label="delete" size="small" color='warning' sx={{ mx: 0.5 }} onClick={handleClick}>
                <WarningIcon fontSize="small"/>
                <CartBadge badgeContent={props.warnings.length} color="primary" variant="dot"/>
            </IconButton>
            <ColumnHeaderWarningDialog
            warnings={props.warnings || []}
            />
        </>
        
    )
}

export default ColumnHeaderWarningButton
