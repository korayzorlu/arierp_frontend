import React, { useState } from 'react'
import Button from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { setDialog } from '../../store/slices/notificationSlice';

function Dialog(props) {
    const {children,title,dismissText,onClickText,onClickColor,onClick,closeEvent} = props;
    const {dialog} = useSelector((store) => store.notification);
    const {theme} = useSelector((store) => store.auth);

    const dispatch = useDispatch();
    
    const handleClose = () => {
        dispatch(setDialog(false));
        if(closeEvent){
            closeEvent();
        };
    };

  return (
        <MUIDialog
        open={dialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        >
            <DialogTitle id="alert-dialog-title">
                {title ? title : ""}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" component="div">
                    {children}
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>{dismissText ? dismissText : "Cancel"}</Button>
                {
                    onClick
                    ?
                    <Button variant="outlined" color={onClickColor ? onClickColor : "primary"} onClick={onClick} autoFocus>{onClickText ? onClickText : "Save"}</Button>
                    :
                    <></>
                }
            </DialogActions>
        </MUIDialog>
    
  )
}

export default Dialog
