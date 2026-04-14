import React, { useState } from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, TextField, Typography } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnHeaderDialog } from 'store/slices/notificationSlice';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { fetchTitleDeedInvoiceControls } from 'store/slices/operation/titleDeedInvoiceControlSlice';

function ColumnHeaderDialog(props) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {columnHeaderDialog} = useSelector((store) => store.notification)
    const {titleDeedInvoiceControlsParams} = useSelector((store) => store.titleDeedInvoiceControl);
    
    const dispatch = useDispatch();

    const [filterSwitch, setFilterSwitch] = useState(false);

    const handleClose = () => {
        dispatch(setColumnHeaderDialog(false));
    };

    const handleSubmit = (filter) => {
        dispatch(setColumnHeaderDialog(false));
        dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams,[filter]:!filterSwitch}}));
        setFilterSwitch(!filterSwitch);
    };

    return (
        <MUIDialog
        open={columnHeaderDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <WarningIcon/> Uyarılar
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    
                    <Stack spacing={2}>
                        {
                            props.warnings.map((warning,index) => (
                                <Typography key={index}>
                                    {warning.message}
                                    {
                                        <Link
                                        component="button"
                                        variant="body2"
                                        onClick={() => handleSubmit(warning.filter)}
                                        sx={{mx:0.5}}
                                        >
                                            {filterSwitch ? 'Filtreyi Kapat' : 'Göster'}
                                            <ArrowOutwardIcon fontSize="small"/>
                                        </Link>
                                    }
                                </Typography>
                            ))
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
