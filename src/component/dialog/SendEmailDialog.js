import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setSendEmailDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import emailTemplate from './emailTemplate';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import { sendRiskEmail, setEmailsLoading } from 'store/slices/communication/emailSlice';
import riskPartnersEmailTemplate from 'component/template/email/riskPartnersEmailTemplate';
import toWarnedRiskPartnersEmailTemplate from 'component/template/email/toWarnedRiskPartnersEmailTemplate';
import warnedRiskPartnersEmailTemplate from 'component/template/email/warnedRiskPartnersEmailTemplate';

function SendEmailDialog({...props}) {

    const {activeCompany} = useSelector((store) => store.organization);
    const {sendEmailDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {emails,emailsCount,emailsParams,emailsLoading} = useSelector((store) => store.email);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setSendEmailDialog(false));
    };

    const handleSubmit = async () => {
        dispatch(setEmailsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setSendEmailDialog(false));

        await dispatch(sendRiskEmail({data:{ac:activeCompany.id,project:props.project,risk_status:props.risk_status,subject:props.subject}})).unwrap();
        dispatch(setEmailsLoading(false));
        
    };

    let emailTemplate;
    switch (props.risk_status) {
        case 'risk_partners':
            emailTemplate = riskPartnersEmailTemplate;
            break;
        case 'to_warned':
            emailTemplate = toWarnedRiskPartnersEmailTemplate;
            break;
        case 'warned':
            emailTemplate = warnedRiskPartnersEmailTemplate;
            break;
        default:
            emailTemplate = riskPartnersEmailTemplate;
    }

    return (
        <MUIDialog
        open={sendEmailDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <SmsIcon/> E-mail Gönder
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <Typography>
                            {props.text}
                        </Typography>
                        <iframe
                            srcDoc={emailTemplate({ subject: props.subject, project: props.project, tutar: props.tutar })}
                            style={{ width: '100%', height: 480, border: '1px solid #ccc', borderRadius: 0 }}
                            title="E-mail Önizleme"
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
            
        </MUIDialog>
    )
}

export default SendEmailDialog
