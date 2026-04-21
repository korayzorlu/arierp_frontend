import React, { useEffect, useState } from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Stack, TextField, Typography } from '@mui/material';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDispatch, useSelector } from 'react-redux';
import { setColumnHeaderWarningDialog } from 'store/slices/notificationSlice';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { fetchTitleDeedInvoiceControls, setIsTitleDeedInvoiceControlsWarnings, setTitleDeedInvoiceControlsParams } from 'store/slices/operation/titleDeedInvoiceControlSlice';
import HelpIcon from '@mui/icons-material/Help';

function ColumnHeaderDialog(props) {
    const {activeCompany} = useSelector((store) => store.organization);
    const {columnHeaderWarningDialog} = useSelector((store) => store.notification)
    const {titleDeedInvoiceControlsParams,titleDeedInvoiceControlsWarnings} = useSelector((store) => store.titleDeedInvoiceControl);
    
    const dispatch = useDispatch();

    const [filterSwitch, setFilterSwitch] = useState(false);

    useEffect(() => {
      dispatch(setTitleDeedInvoiceControlsParams({
            ...titleDeedInvoiceControlsParams,
            start: filterSwitch ? 0 * 1000 : 0 * 50,
            end: filterSwitch ? (0 + 1) * 1000 : (0 + 1) * 50,
            format: 'datatables'
        }))
    }, [filterSwitch])
    

    const handleClose = () => {
        dispatch(setColumnHeaderWarningDialog(false));
    };

    const handleSubmit = (filter) => {
        dispatch(setColumnHeaderWarningDialog(false));
        dispatch(fetchTitleDeedInvoiceControls({activeCompany,params:{...titleDeedInvoiceControlsParams,[filter]:!filterSwitch}}));
        dispatch(setIsTitleDeedInvoiceControlsWarnings(!filterSwitch));
        setFilterSwitch(!filterSwitch);
    };

    return (
        <MUIDialog
        open={columnHeaderWarningDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                {
                    props.warnings?.length > 0
                    ?
                        <>
                            <WarningIcon/> Uyarılar
                        </>
                        
                    :
                        null
                }
                
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    
                    <Stack spacing={2}>

                        {
                            props.warnings?.length > 0
                            ?
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
