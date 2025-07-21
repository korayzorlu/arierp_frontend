import React from 'react'
import { setCallDialog } from '../../../store/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CallDialog(props) {
    const {user} = props;

    const {userInformation} = useSelector((store) => store.auth);
    const {callDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setCallDialog(false))
    };

    return (
        <MUIDialog
        open={callDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Arama Kaydı
            </DialogTitle>
            {/* <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
            })}
            >
                <CloseIcon />
            </IconButton> */}
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

export default CallDialog
