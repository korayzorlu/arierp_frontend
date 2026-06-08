import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setMessageDialog, setSendSMSDialog, setDeleteDocumentDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import axios from 'axios';

function DeleteDocumentDialog({...props}) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {deleteDocumentDialog} = useSelector((store) => store.notification);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setDeleteDocumentDialog(false));
    };

    const handleImport = async () => {
        if (props.startEvent) {
            props.startEvent();
        };

        dispatch(setDeleteDocumentDialog(false));
        
        try {
            const params = { companyId: activeCompany.companyId, uuid: props.uuid }

            const response = await axios.post(props.url,
                params,
                {   
                    withCredentials: true
                },
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}))
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            if (props.finalEvent){
                props.finalEvent();
            };
        };
    };

    return (
        <MUIDialog
        open={deleteDocumentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <CloudUploadIcon/> Dosya Sil
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <Typography>
                            Dosya silinecektir. Devam etmek istediğinize emin misiniz?
                        </Typography>
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                <Button variant="contained" color="error" onClick={handleImport} autoFocus>Sil</Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default DeleteDocumentDialog
