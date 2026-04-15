import React, { useState } from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, TextField, Typography } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnHeaderInfoDialog } from 'store/slices/notificationSlice';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { fetchTitleDeedInvoiceControls } from 'store/slices/operation/titleDeedInvoiceControlSlice';
import HelpIcon from '@mui/icons-material/Help';

function ColumnHeaderDialog(props) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {columnHeaderInfoDialog} = useSelector((store) => store.notification)
    const {titleDeedInvoiceControlsParams} = useSelector((store) => store.titleDeedInvoiceControl);
    
    const dispatch = useDispatch();

    const [filterSwitch, setFilterSwitch] = useState(false);

    const handleClose = () => {
        dispatch(setColumnHeaderInfoDialog(false));
    };

    const handleSubmit = (filter) => {
        dispatch(setColumnHeaderInfoDialog(false));
        dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams,[filter]:!filterSwitch}}));
        setFilterSwitch(!filterSwitch);
    };

    return (
        <MUIDialog
        open={columnHeaderInfoDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
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
                        {
                            props.info?.length > 0
                            ?
                                props.info.map((info,index) => (
                                    <Typography key={index}>
                                        {info.message}
                                    </Typography>
                                ))
                            :
                                null
                        }
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                
            </DialogActions>
        </MUIDialog>
    )
}

export default ColumnHeaderDialog
