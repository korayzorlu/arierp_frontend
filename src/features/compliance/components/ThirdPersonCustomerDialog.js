import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setSendSMSDialog, setThirdPersonCustomerDialog, setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import { fetchThirdPersons, setThirdPersonsLoading, updateThirdPersonIsCustomerSent, updateThirdPersonStatus } from 'store/slices/compliance/thirdPersonSlice';
import RuleIcon from '@mui/icons-material/Rule';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

function ThirdPersonCustomerDialog({...props}) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersonCustomerDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);
    const {thirdPersonsParams} = useSelector((store) => store.thirdPerson);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setThirdPersonCustomerDialog(false));
    };

    const handleSubmit = async (status) => {
        dispatch(setThirdPersonsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setThirdPersonCustomerDialog(false));

        await dispatch(updateThirdPersonIsCustomerSent({data:{id: props.row.id}})).unwrap();
        await dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams})).unwrap();
        dispatch(setThirdPersonsLoading(false));
        
    };

    return (
        <MUIDialog
        open={thirdPersonCustomerDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <PersonIcon/> Müşteri Bildirimi
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Müşteri olarak bildirmek istiyor musunuz?
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                <Button
                variant="contained"
                color="opposite"
                onClick={handleSubmit}
                endIcon={<VerifiedUserIcon/>}
                autoFocus
                >
                    Bildir
                </Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default ThirdPersonCustomerDialog
