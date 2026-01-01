import React, { startTransition, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessageDialog, setPartnerNoteDialog } from 'store/slices/notificationSlice';
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
import PartnerNoteAccordion from 'component/surfaces/PartnerNoteAccordion';
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff';
import AddIcon from '@mui/icons-material/Add';
import AddPartnerNoteAccordion from 'component/surfaces/AddPartnerNoteAccordion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { addPartnerNote, fetchPartnerNotes } from 'store/slices/partners/partnerSlice';

function PartnerNoteDialog(props) {
    const {partner,partner_id} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerNoteDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {partnerNotes,partnerNotesCount,partnerNotesParams,partnerNotesLoading} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const [data, setData] = useState({title: '', text: ''});
    const [isNew, setIsNew] = useState(false); 

    const handleClose = () => {
        dispatch(setPartnerNoteDialog(false));
        setIsNew(false);
    };

    const handleSubmit = async () => {
        await dispatch(addPartnerNote({params: {data, companyId: activeCompany.companyId, partner_id: partnerInformation.uuid}})).unwrap();
        await dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.uuid}})).unwrap();
        setIsNew(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    return (
        <MUIDialog
        open={partnerNoteDialog}
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
                    {partnerInformation.name} - Müşteri Notları
                </Typography>
            </DialogTitle>
            <DialogContent sx={{pt:'20px!important'}}>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={0}>
                        {
                            partnerNotesLoading
                            ?
                                null
                            :
                                partnerNotes.length > 0
                                ?   
                                    isNew
                                    ?  
                                        <AddPartnerNoteAccordion
                                        title={data.title}
                                        text={data.text}
                                        onChangeTitle={(value) => handleChangeField("title",value)}
                                        onChangeText={(value) => handleChangeField("text",value)}
                                        />
                                    :
                                        partnerNotes.map((partnerNote) => (
                                            <PartnerNoteAccordion note={partnerNote}/>
                                        ))
                                :
                                    isNew
                                    ?  
                                        <AddPartnerNoteAccordion
                                        onChangeTitle={(value) => handleChangeField("title",value)}
                                        onChangeText={(value) => handleChangeField("text",value)}
                                        />
                                    :
                                        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                                            <Grid spacing={1} size={{xs:12,sm:12}}>
                                                <Stack spacing={2}>
                                                    {/* <AddPartnerNoteAccordion/> */}
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

export default PartnerNoteDialog
