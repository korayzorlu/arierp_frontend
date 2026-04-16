import React, { useState } from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, TextField, Typography } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnHeaderDateDialog, setColumnHeaderInfoDialog } from 'store/slices/notificationSlice';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { fetchTitleDeedInvoiceControls } from 'store/slices/operation/titleDeedInvoiceControlSlice';
import HelpIcon from '@mui/icons-material/Help';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function ColumnHeaderDateDialog(props) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {columnHeaderDateDialog} = useSelector((store) => store.notification)
    const {titleDeedInvoiceControlsParams} = useSelector((store) => store.titleDeedInvoiceControl);
    
    const dispatch = useDispatch();

    const [filterSwitch, setFilterSwitch] = useState(false);
    const [filterDate, setFilterDate] = useState({
        start: dayjs().startOf('year').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD')
    });

    const handleClose = () => {
        dispatch(setColumnHeaderDateDialog(false));
    };

    const handleSubmit = (filter) => {
        dispatch(setColumnHeaderDateDialog(false));
        dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams,[filter]:!filterSwitch}}));
        setFilterSwitch(!filterSwitch);
    };

    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');

    const handleDateRangeChange = (newValue) => {
        const startDate = newValue[0] ? dayjs(newValue[0]).format('YYYY-MM-DD') : null;
        const endDate = newValue[1] ? dayjs(newValue[1]).format('YYYY-MM-DD') : null;
        setFilterDate({start: startDate, end: endDate});
    }

    return (
        <MUIDialog
        open={columnHeaderDateDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                {
                    props.info?.length > 0
                    ?
                        <>
                            <HelpIcon/> Bilgi
                        </>
                    :
                        null
                }
                
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    
                    <Stack spacing={2}>
                        <DateRangePicker
                        defaultValue={[firstDayOfYear, today]}
                        onAccept={handleDateRangeChange}
                        format='DD.MM.YYYY'
                        slotProps={{
                            textField: { size: 'small' }
                        }}
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
                endIcon={<FilterAltIcon/>}
                autoFocus
                >
                    Filtrele
                </Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default ColumnHeaderDateDialog
