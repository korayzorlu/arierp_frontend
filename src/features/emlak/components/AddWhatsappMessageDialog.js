import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setAddWhatsappMessageDialog, setDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField } from '@mui/material';
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
import { fetchWhatsappMessages, makeWhatsappMessage } from 'store/slices/emlak/whatsappMessageSlice';

function AddWhatsappMessageDialog(props) {

    const {activeCompany} = useSelector((store) => store.organization);
    const {addWhatsappMessageDialog} = useSelector((store) => store.notification);
    const {realEstateAgentsParams} = useSelector((store) => store.realEstateAgent);
    const {whatsappMessagesParams} = useSelector((store) => store.whatsappMessage);

    const dispatch = useDispatch();

    const [data, setData] = useState({meet_date: dayjs().format('YYYY-MM-DD')});
    const [meet_date, setMeetDate] = useState(dayjs().format('YYYY-MM-DD'))

    useEffect(() => {
        dispatch(fetchRealEstateAgents({activeCompany,params:realEstateAgentsParams}));
    },[])

    const handleClose = () => {
        dispatch(setAddWhatsappMessageDialog(false));
        setData({meet_date: dayjs().format('YYYY-MM-DD')});
    };

    const handleSubmit = async () => {
        const response = await dispatch(makeWhatsappMessage({data:data})).unwrap();
        if(response === "success"){
            handleClose();
            dispatch(fetchWhatsappMessages({activeCompany,params:whatsappMessagesParams}));
        }
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

    return (
        <MUIDialog
        open={addWhatsappMessageDialog}
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
                        <TextField
                        type="text"
                        size="small"
                        label={"Emlakçı İsmi"}
                        placeholder='Emlakçı ismini giriniz.'
                        variant='standard'
                        value={data.name}
                        onChange={(e) => handleChangeField("name",e.target.value)}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Emlakçı Tel"}
                        placeholder='Emlakçı telefon numarasını giriniz.'
                        variant='standard'
                        value={data.phone_number_1}
                        onChange={(e) => handleChangeField("phone_number_1",e.target.value)}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"İlan No"}
                        placeholder='İlan numarasını giriniz.'
                        variant='standard'
                        value={data.ilan_no}
                        onChange={(e) => handleChangeField("ilan_no",e.target.value)}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"İlan Tutarı"}
                        placeholder='İlan tutarını giriniz.'
                        variant='standard'
                        value={data.amount}
                        onChange={(e) => handleChangeField("amount",e.target.value)}
                        disabled={false}
                        fullWidth
                        />
                        <DatePicker
                        label="Toplantı Tarihi"
                        defaultValue={today}
                        onAccept={handleDateRangeChange}
                        format='DD.MM.YYYY'
                        slotProps={{
                            textField: { size: 'small'},
                        }}
                        sx={{mr:2}}
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
                <Button variant='contained' color="opposite" onClick={handleSubmit} endIcon={<SaveIcon/>}>Kaydet</Button>
                <Button color="neutral" onClick={handleClose}>Kapat</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default AddWhatsappMessageDialog
