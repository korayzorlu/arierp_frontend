import { Button } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';

function TableButton(props) {
    const {dark} = useSelector((store) => store.auth);

    const handleClick = () => {
        props.onClick()
    }
    return (
        <Button
        variant='contained'
        color={props.color ? props.color : (dark ? 'mars' : 'mars')}
        endIcon={props.icon}
        size='small'
        onClick={handleClick}
        >
            {props.text ? props.text : 'Detay'}
        </Button>
    )
}

export default TableButton
