import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setSendWhatsappMessageDialog, setDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchComprehensiveWarningNoticeInformation, fetchWarningNoticeInformation, fetchWarningNoticeInLease, updateComprehensiveWarningNotice } from 'store/slices/contracts/contractSlice';
import axios from 'axios';
import TableButton from 'component/button/TableButton';
import FeedIcon from '@mui/icons-material/Feed';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchRealEstateAgents } from 'store/slices/emlak/realEstateAgentSlice';
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { fetchWhatsappMessages, makeWhatsappMessage, sendWhatsappMessage, setWhatsappMessagesLoading } from 'store/slices/emlak/whatsappMessageSlice';
import emlakWhatsappMessageTemplate from 'component/template/whatsapp/emlakWhatsappMessageTemplate';
import SendIcon from '@mui/icons-material/Send';

function SendWhatsappMessageDialog(props) {

    const {activeCompany} = useSelector((store) => store.organization);
    const {sendWhatsappMessageDialog} = useSelector((store) => store.notification);
    const {realEstateAgentsParams} = useSelector((store) => store.realEstateAgent);
    const {whatsappMessagesParams,whatsappMessagesLoading} = useSelector((store) => store.whatsappMessage);

    const dispatch = useDispatch();

    const [data, setData] = useState({meet_date: dayjs().format('YYYY-MM-DD')});
    const [meet_date, setMeetDate] = useState(dayjs().format('YYYY-MM-DD'))

    useEffect(() => {
        dispatch(fetchRealEstateAgents({activeCompany,params:realEstateAgentsParams}));
    },[])

    const handleClose = () => {
        dispatch(setSendWhatsappMessageDialog(false));
        setData({meet_date: dayjs().format('YYYY-MM-DD')});
    };

    const handleSubmit = async () => {
        dispatch(setWhatsappMessagesLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setSendWhatsappMessageDialog(false));

        await dispatch(sendWhatsappMessage({data:{activeCompany:activeCompany.id,uuids:props.uuids}})).unwrap();
        dispatch(setWhatsappMessagesLoading(false));
    }

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };

    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');

    const handleDateRangeChange = async (newValue) => {
        const meet_date = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
        handleChangeField("meet_date", meet_date);
    }

    const handleOnlineDateRangeChange = async (newValue) => {
        const online_meet_date = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
        handleChangeField("online_meet_date", online_meet_date);
    }

    return (
        <MUIDialog
        open={sendWhatsappMessageDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            
            <DialogTitle id="alert-dialog-title">
                İhtar Detayı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <>
                            <Typography>
                                Listede seçili olan kişilere, kayıtlı telefon numaraları üzerinden WhatsApp tanıtım mesajı gönderilecektir.
                            </Typography>
                            <Typography>
                                Seçili satır sayısı: {props.uuids.length}
                            </Typography>
                        </>
                        <iframe
                            srcDoc={emlakWhatsappMessageTemplate({ isim: '', link: '', tutar: '', toplanti_tarihi: '', online_toplanti_tarihi: '' })}
                            style={{ width: '100%', height: 480, border: '1px solid #ccc', borderRadius: 0 }}
                            title="WhatsApp Mesajı Önizleme"
                        />
                        
                    </Stack>
                    {/* <Stack spacing={2} sx={{mt:2}} justifyContent="center">
                        <Grid container spacing={2} justifyContent="center">
                            <Grid size={{xs:12,sm:4}}>
                                <TableButton
                                text="Kaydet"
                                icon={<SaveIcon/>}
                                onClick={handleSubmit}
                                fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Stack> */}
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant='contained' color="opposite" onClick={handleSubmit} endIcon={<SendIcon/>}>Gönder</Button>
                <Button color="neutral" onClick={handleClose}>Kapat</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default SendWhatsappMessageDialog
