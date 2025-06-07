import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from './Dialog';
import Row from '../grid/Row';
import Col from '../grid/Col';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { setAlert, setDialog, setImportDialog } from '../../store/slices/notificationSlice';
import axios from 'axios';
import VissuallyHiddenInput from '../input/VissuallyHiddenInput';
import { useNavigate } from 'react-router-dom';
import { fetchImportProcess } from '../../store/slices/processSlice';
import MUIDialog from '@mui/material/Dialog';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function ImportDialog(props) {
    const {children,templateURL,importURL,startEvent,finalEvent,closeEvent} = props;
    const {dark} = useSelector((store) => store.auth);
    const {importDialog} = useSelector((store) => store.notification);
    const {importProcessLoading,importProcesses} = useSelector((store) => store.process);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileText, setSelectedFileText] = useState(null);

    const handleClose = () => {
            dispatch(setImportDialog(false));
            setSelectedFile(null);
            setSelectedFileText(null);
            if(closeEvent){
                closeEvent();
            };
    };
    
    const fetchTemplate = async () => {
        try {
            const response = await axios.get(templateURL,
                {
                    responseType: "blob",
                    withCredentials: true
                }
            );
            const a = document.createElement("a");
            a.href = URL.createObjectURL(response.data);
            a.download = "partners-template.xlsx";
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {

        }
    };

    const handleSelectFile = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setSelectedFileText(file.name);
    };

    const handleImport = async () => {
        if (startEvent) {
            startEvent();
        };
        dispatch(setImportDialog(false));
        setSelectedFile(null);
        setSelectedFileText(null);
        
        try {
            const formData = new FormData();
            const jsonData = JSON.stringify({ });
            formData.append("data", jsonData);

            if (selectedFile) {
                formData.append("file", selectedFile);
            };

            const response = await axios.post(importURL,
                formData,
                {   
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                },
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        } finally {
            if (finalEvent){
                finalEvent();
            };
        };
    };

    return (
        <>

            {
                importProcessLoading

                ?

                <MUIDialog
                open={importDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                elevation={3}
                variant="outlined"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" component="div">
                            <Button loading variant="text"></Button>
                        </DialogContentText>
                    </DialogContent>
                </MUIDialog>

                :

                (
                    importProcesses.length > 0

                    ?

                    <MUIDialog
                    open={importDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    elevation={3}
                    variant="outlined"
                    >   
                        <DialogTitle id="alert-dialog-title">
                            Import partners from xls file
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" component="div">
                                <Row className="mb-3 text-center">
                                    <Col>
                                        <DownloadingIcon color="opposite" sx={{fontSize:"64px"}}></DownloadingIcon>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Typography>
                                            There is another ongoing import process. Please wait for it to finish and try again.
                                        </Typography>
                                    </Col>
                                </Row>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button color="neutral" onClick={handleClose}>Cancel</Button>
                        </DialogActions>
                    </MUIDialog>

                    :

                    <MUIDialog
                    open={importDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    elevation={3}
                    variant="outlined"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Import partners from xls file
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" component="div">
                                <Row className="mb-3">
                                    <Col>
                                        <Typography>
                                            You can download template or select a file and upload it.
                                        </Typography>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col>
                                        <Button
                                        variant='contained'
                                        color='mars'
                                        startIcon={<CloudDownloadIcon/>}
                                        onClick={fetchTemplate}
                                        fullWidth
                                        >
                                            Download Template
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button
                                        variant='contained'
                                        color={dark ? "whitehole" : "blackhole"}
                                        component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={ !selectedFileText ? <CloudUploadIcon /> : <InsertDriveFileIcon/>}
                                        fullWidth
                                        >
                                            {selectedFileText || "Select File"}
                                            <VissuallyHiddenInput onChange={handleSelectFile} />
                                        </Button>
                                    </Col>
                                </Row>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button variant="text" color="neutral" onClick={handleClose}>Cancel</Button>
                            <Button variant="outlined" color="primary" onClick={handleImport} autoFocus>Start</Button>
                        </DialogActions>
                    </MUIDialog>
                )

                
            }

        </>
        
        
    )
}

export default ImportDialog
