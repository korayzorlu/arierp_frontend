import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setIdleWarningDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutAuth } from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import useIdleTimer from 'hooks/useIdleTimer';

function IdleWarningDialog(props) {
    const { user, status } = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {idleWarningDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const [mm, setMm] = useState(String(Math.floor(props.remainingSeconds / 60)).padStart(2, "0"))
    const [ss, setSs] = useState(String(props.remainingSeconds % 60).padStart(2, "0"))

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setIdleWarningDialog(false));
        props.onClose();
        if(!user) {
            navigate('/auth/login');
        };
    };

    const handleSubmit = async () => {

    };

    return (
        user && status
        ?
            <MUIDialog
            open={idleWarningDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            elevation={3}
            variant="outlined"
            fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    <LogoutIcon/> Oturum Uyarısı
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Stack spacing={2}>
                            <Typography>
                                Hareketsizlik nedeniyle oturumunuz 2 dakika içinde kapanacak.
                            </Typography>
                        </Stack>
                        
                    </DialogContentText>
                </DialogContent>
                <DialogActions className=''>
                    <Button variant="text" color="neutral" onClick={handleClose}>Kapat</Button>
                </DialogActions>

                
            </MUIDialog>
        :
            null
    )
}

export default IdleWarningDialog
