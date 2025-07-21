import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog } from '../../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';

function MessageDialog(props) {
    const {user} = props;

    const {userInformation} = useSelector((store) => store.auth);
    const {messageDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setMessageDialog(false))
    };

    return (
        <MUIDialog
        open={messageDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Mesaj Kaydı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default MessageDialog
