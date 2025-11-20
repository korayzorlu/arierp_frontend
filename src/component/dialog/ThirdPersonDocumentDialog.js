import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setMessageDialog, setSendSMSDialog, setThirdPersonDocumentDialog, setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import MUIDialog from '@mui/material/Dialog';
import SmsIcon from '@mui/icons-material/Sms';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { sendSMS, setSMSsLoading } from 'store/slices/communication/smsSlice';
import SendIcon from '@mui/icons-material/Send';
import { fetchThirdPersons, setThirdPersonsLoading, updateThirdPersonStatus } from 'store/slices/compliance/thirdPersonSlice';
import RuleIcon from '@mui/icons-material/Rule';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import axios from 'axios';

function ThirdPersonDocumentDialog({...props}) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersonDocumentDialog} = useSelector((store) => store.notification);
    const {partnerInformation} = useSelector((store) => store.partner);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);
    const {thirdPersonsParams} = useSelector((store) => store.thirdPerson);

    const dispatch = useDispatch();

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileText, setSelectedFileText] = useState(null);

    const handleClose = () => {
        dispatch(setThirdPersonDocumentDialog(false));
    };

    const handleSubmit = async (status) => {
        dispatch(setThirdPersonsLoading(true));
        if (props.startEvent) {
            props.startEvent();
        };
        dispatch(setThirdPersonDocumentDialog(false));


        dispatch(setThirdPersonsLoading(false));
        
    };

     const handleSelectFile = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedFileText(file.name);
    };

    const handleImport = async () => {
        if (props.startEvent) {
            props.startEvent();
        };

        if (!selectedFile) {
            dispatch(setAlert({status:"error",text:"Lütfen bir dosya seçin!"}));
            return;
        }

        dispatch(setThirdPersonDocumentDialog(false));
        setSelectedFile(null);
        setSelectedFileText(null);
        
        try {
            const formData = new FormData();
            const jsonData = JSON.stringify({ companyId: activeCompany.companyId, uuid: props.row.id });
            formData.append("data", jsonData);

            if (selectedFile) {
                formData.append("file", selectedFile);
            };

            const response = await axios.post('/compliance/import_third_person_document/',
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
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            if (props.finalEvent){
                props.finalEvent();
            };
        };
    };

    return (
        <MUIDialog
        open={thirdPersonDocumentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="xs"
        fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                <CloudUploadIcon/> 3. Kişi Belge Yükleme
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
                            Maksimum dosya boyutu 5MB
                        </Typography>
                        <Button
                        variant='contained'
                        color={dark ? "silvercoin" : "ari"}
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={ !selectedFileText ? <CloudUploadIcon /> : <InsertDriveFileIcon/>}
                        fullWidth
                        >
                            {selectedFileText || "Dosya Seç"}
                            <VissuallyHiddenInput onChange={handleSelectFile} accept=".pdf, .jpg, .jpeg, .png"/>
                        </Button>
                    </Stack>
                    
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                <Button variant="outlined" color="primary" onClick={handleImport} autoFocus>Başlat</Button>
            </DialogActions>
            
        </MUIDialog>
    )
}

export default ThirdPersonDocumentDialog
