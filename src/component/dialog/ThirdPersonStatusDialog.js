import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setSendSMSDialog, setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import { fetchThirdPersons, setThirdPersonsLoading, updateThirdPersonStatus } from 'store/slices/compliance/thirdPersonSlice';
import RuleIcon from '@mui/icons-material/Rule';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';

function ThirdPersonStatusDialog({...props}) {

    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersonStatusDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);
    const {thirdPersonsParams} = useSelector((store) => store.thirdPerson);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setThirdPersonStatusDialog(false));
    };

    const handleSubmit = async (status) => {
        dispatch(setThirdPersonsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setThirdPersonStatusDialog(false));

        await dispatch(updateThirdPersonStatus({data:{uuid:props.row.id,status}})).unwrap();
        await dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams})).unwrap();
        dispatch(setThirdPersonsLoading(false));
        
    };

    return (
        <MUIDialog
        open={thirdPersonStatusDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <RuleIcon/> 3. Kişi Durum Güncelleme
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleSubmit("cleared")}
                        startIcon={<CheckIcon/>}
                        autoFocus
                        >
                            Temiz
                        </Button>
                        <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleSubmit("flagged")}
                        startIcon={<DoDisturbAltIcon/>}
                        autoFocus
                        >
                            Yasaklı
                        </Button>
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default ThirdPersonStatusDialog
