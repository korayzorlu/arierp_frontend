import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setSendSMSDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';

function SendSMSDialog({...props}) {

    const {activeCompany} = useSelector((store) => store.organization);
    const {sendSMSDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
   const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setSendSMSDialog(false));
    };

    const handleSubmit = async () => {
        dispatch(setSMSsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setSendSMSDialog(false));

        await dispatch(sendSMS({data:{project:props.project,risk_status:props.risk_status}})).unwrap();
        dispatch(setSMSsLoading(true));
        
    };

    return (
        <MUIDialog
        open={sendSMSDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <SmsIcon/> SMS Gönder
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <Typography>
                            {props.text}
                        </Typography>
                        <TextField
                        label="Mesaj İçeriği"
                        multiline
                        rows={8}
                        defaultValue={props.example}
                        disabled
                        />
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                <Button
                variant="contained"
                color="opposite"
                onClick={handleSubmit}
                endIcon={<PlayArrowIcon/>}
                autoFocus
                >
                    Gönder
                </Button>
            </DialogActions>
            {/* {
                smssLoading
                ?
                    <>  
                         <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Stack spacing={2}>
                                    <Typography>
                                        Mesaj gönderiliyor. Lütfen bekleyiniz...
                                    </Typography>
                                </Stack>
                                
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button variant="text" color="neutral" onClick={handleClose}>Kapat</Button>
                        </DialogActions>
                    </>
                :
                    <>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Stack spacing={2}>
                                    <Typography>
                                        {props.text}
                                    </Typography>
                                    <TextField
                                    label="Mesaj İçeriği"
                                    multiline
                                    rows={8}
                                    defaultValue={props.example}
                                    disabled
                                    />
                                </Stack>
                                
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                            <Button
                            variant="contained"
                            color="opposite"
                            onClick={handleSubmit}
                            endIcon={<PlayArrowIcon/>}
                            autoFocus
                            loading={smssLoading}
                            >
                                Gönder
                            </Button>
                        </DialogActions>
                    </>
                    
            } */}
            
        </MUIDialog>
    )
}

export default SendSMSDialog
