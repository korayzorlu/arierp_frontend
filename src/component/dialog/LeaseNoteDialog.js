import React, { startTransition, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setLeaseNoteDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DoneIcon from '@mui/icons-material/Done';
import SMSAccordion from 'component/surfaces/SMSAccordion';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import LeaseNoteAccordion from 'component/surfaces/LeaseNoteAccordion';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';
import AddIcon from '@mui/icons-material/Add';
import AddLeaseNoteAccordion from 'component/surfaces/AddLeaseNoteAccordion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { addLeaseNote, fetchLeaseNotes, fetchLeases } from 'store/slices/leasing/leaseSlice';
import { fetchTitleDeedInvoiceControls } from 'store/slices/operation/titleDeedInvoiceControlSlice';

function LeaseNoteDialog(props) {
    const {lease,lease_id} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {leaseNoteDialog} = useSelector((store) => store.notification);
    const {leaseInformation} = useSelector((store) => store.lease);
    const {leaseNotes,leaseNotesCount,leaseNotesParams,leaseNotesLoading} = useSelector((store) => store.lease);
    const {titleDeedInvoiceControlsParams} = useSelector((store) => store.titleDeedInvoiceControl);

    const dispatch = useDispatch();

    const [data, setData] = useState({title: '', text: ''});
    const [isNew, setIsNew] = useState(false); 

    const handleClose = () => {
        dispatch(setLeaseNoteDialog(false));
        setIsNew(false);
    };

    const handleSubmit = async () => {
        await dispatch(addLeaseNote({params: {data, companyId: activeCompany.companyId, lease_id: leaseInformation[0].id}})).unwrap();
        await dispatch(fetchLeaseNotes({activeCompany,params:{...leaseNotesParams,lease_id:leaseInformation[0].id}})).unwrap();
        setIsNew(false);
        setData({title: '', text: ''});
        dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams}}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    return (
        <MUIDialog
        open={leaseNoteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            <DialogTitle>
                <Typography variant='body1'>
                    {leaseInformation?.[0]?.code} - Notlar
                </Typography>
            </DialogTitle>
            <DialogContent sx={{pt:'20px!important'}}>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={0}>
                        {
                            leaseNotesLoading
                            ?
                                null
                            :
                                leaseNotes.length > 0
                                ?   
                                    isNew
                                    ?  
                                        <AddLeaseNoteAccordion
                                        title={data.title}
                                        text={data.text}
                                        onChangeTitle={(value) => handleChangeField("title",value)}
                                        onChangeText={(value) => handleChangeField("text",value)}
                                        />
                                    :
                                        leaseNotes.map((leaseNote) => (
                                            <LeaseNoteAccordion note={leaseNote}/>
                                        ))
                                :
                                    isNew
                                    ?  
                                        <AddLeaseNoteAccordion
                                        title={data.title}
                                        text={data.text}
                                        onChangeTitle={(value) => handleChangeField("title",value)}
                                        onChangeText={(value) => handleChangeField("text",value)}
                                        />
                                    :
                                        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                                            <Grid spacing={1} size={{xs:12,sm:12}}>
                                                <Stack spacing={2}>
                                                    {/* <AddLeaseNoteAccordion/> */}
                                                    <Typography variant='body2' sx={{color:'text.secondary',textAlign:'center'}}>
                                                        <SubtitlesOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></SubtitlesOffIcon>
                                                    </Typography>
                                                    <Typography variant='body2' sx={{color:'text.secondary',textAlign:'center'}}>
                                                        Kaydedilmiş not bulunmamaktadır.
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                        }
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                {
                    isNew
                    ?   
                        <>
                            <Button variant="contained" color='error' size='small' onClick={() => setIsNew(false)} startIcon={<ArrowBackIcon />}>Geri</Button>
                            <Button variant="contained" color='opposite' size='small' onClick={handleSubmit} startIcon={<SaveIcon />}>Kaydet</Button>
                        </>
                    :
                        <Button variant="contained" color='opposite' size='small' onClick={() => setIsNew(true)} startIcon={<AddIcon />}>Yeni Not Ekle</Button>
                }
                <Button color="neutral" size='small' onClick={handleClose}>Kapat</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default LeaseNoteDialog
