import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setMessageDialog, setSendSMSDialog, setImportDocumentDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import axios from 'axios';

function ImportDocumentDialog({...props}) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {importDocumentDialog} = useSelector((store) => store.notification);

    const dispatch = useDispatch();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesText, setSelectedFilesText] = useState(null);

    const handleClose = () => {
        dispatch(setImportDocumentDialog(false));
    };

    const handleSelectFile = (event) => {
        const newFiles = Array.from(event.target.files);
        setSelectedFiles(newFiles);
        setSelectedFilesText(newFiles.map((f) => f.name).join(", "));
        // setSelectedFiles((prev) => {
        //     const merged = [...prev, ...newFiles];
        //     setSelectedFilesText(merged.map((f) => f.name).join(", "));
        //     return merged;
        // });
    };

    const handleImport = async () => {
        if (props.startEvent) {
            props.startEvent();
        };

        if (selectedFiles.length === 0) {
            dispatch(setAlert({status:"error",text:"Lütfen bir dosya seçin!"}));
            return;
        }

        if (selectedFiles.length > 5) {
            dispatch(setAlert({status:"error",text:"En fazla 5 dosya seçebilirsiniz!"}));
            return;
        }

        dispatch(setImportDocumentDialog(false));
        setSelectedFiles([]);
        setSelectedFilesText(null);

        try {
            const formData = new FormData();
            const jsonData = JSON.stringify({ companyId: activeCompany.companyId, uuid: props.uuid });
            formData.append("data", jsonData);

            selectedFiles.forEach((file) => {
                formData.append("files", file);
            });

            const response = await axios.post(props.importUrl,
                formData,
                {   
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                },
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}))
        } catch (error) {
            dispatch(setAlert({status:error.response?error.response.data.status:error.status,text:error.response.data.message}));
        } finally {
            if (props.finalEvent){
                props.finalEvent();
            };
        };
    };

    return (
        <MUIDialog
        open={importDocumentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <CloudUploadIcon/> Belge Yükleme
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <Typography>
                            Belge yüklemek için bir dosya seçin.
                        </Typography>
                        <Typography>
                            Desteklenen dosya formatları: PDF, JPG, PNG
                        </Typography>
                        <Typography>
                            Maksimum dosya boyutu 1MB
                        </Typography>
                        <Button
                        variant='contained'
                        color={dark ? "silvercoin" : "ari"}
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={ !selectedFilesText ? <CloudUploadIcon /> : <InsertDriveFileIcon/>}
                        fullWidth
                        >
                            {selectedFilesText || "Dosya Seç"}
                            <VissuallyHiddenInput onChange={handleSelectFile} accept=".pdf, .jpg, .jpeg, .png"/>
                        </Button>
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                <Button variant="contained" color="opposite" onClick={handleImport} autoFocus>Yükle</Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default ImportDocumentDialog
