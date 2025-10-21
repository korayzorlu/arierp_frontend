import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog } from '../../../store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, Typography } from '@mui/material';
import { checkSMS, fetchSMSs } from '../../../store/slices/communication/smsSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DoneIcon from '@mui/icons-material/Done';
import SMSAccordion from '../../../component/surfaces/SMSAccordion';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import FolderOffIcon from '@mui/icons-material/FolderOff';

function MessageDialog(props) {
    const {partner,partner_id} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {messageDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

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
                <Typography variant='body1'>
                    {partnerInformation.name} - SMS Geçmişi
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={0}>
                        {
                            smssLoading
                            ?
                                null
                            :
                                smss.length > 0
                                ?
                                    smss.map((sms) => (
                                        <SMSAccordion sms={sms}/>
                                    ))
                                :
                                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                                    <Stack spacing={2}>
                                        <Typography variant='body2' sx={{color:'text.secondary',textAlign:'center'}}>
                                            <SpeakerNotesOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></SpeakerNotesOffIcon>
                                        </Typography>
                                        <Typography variant='body2' sx={{color:'text.secondary',textAlign:'center'}}>
                                            Gönderilmiş SMS bulunmamaktadır.
                                        </Typography>
                                    </Stack>
                                </Grid>
                        }
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
