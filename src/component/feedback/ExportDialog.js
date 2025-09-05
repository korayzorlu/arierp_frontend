import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAlert, setExportDialog, setImportDialog } from '../../store/slices/notificationSlice';
import axios from 'axios';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import Row from '../grid/Row';
import Col from '../grid/Col';
import MUIDialog from '@mui/material/Dialog';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

function ExportDialog(props) {
    const {children,excelURL,exportURL,startEvent,finalEvent,closeEvent,file_name,project} = props;

    const {dark} = useSelector((store) => store.auth);
    const {exportDialog} = useSelector((store) => store.notification);
    const {exportProcessLoading,exportProcesses} = useSelector((store) => store.process);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClose = () => {
            dispatch(setExportDialog(false));
            if(closeEvent){
                closeEvent();
            };
    };

    const handleExport = async () => {
        if (startEvent) {
            startEvent();
        };
        dispatch(setExportDialog(false));
        
        try {
            const response = await axios.post(exportURL,
                {project},
                { 
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
                exportProcessLoading

                ?

                <MUIDialog
                open={exportDialog}
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
                    exportProcesses.length < 0

                    ?

                    <MUIDialog
                    open={exportDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    elevation={3}
                    variant="outlined"
                    >   
                        <DialogTitle id="alert-dialog-title">
                            Excel dosyasından öğeleri içe aktar
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
                                            Başka bir içe aktarma işlemi devam ediyor. Lütfen bitmesini bekleyin ve tekrar deneyin.
                                        </Typography>
                                    </Col>
                                </Row>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button color="neutral" onClick={handleClose}>Vazgeç</Button>
                        </DialogActions>
                    </MUIDialog>

                    :

                    <MUIDialog
                    open={exportDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    elevation={3}
                    variant="outlined"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Excel dosyası hazırla ve dışa aktar
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" component="div">
                                <Row className="mb-3">
                                    <Col>
                                        <Typography>
                                            Devam etmek istiyor musunuz?
                                        </Typography>
                                    </Col>
                                </Row>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                            <Button variant="contained" color="primary" onClick={handleExport} autoFocus>Başlat</Button>
                        </DialogActions>
                    </MUIDialog>
                )

                
            }

        </>
    )
}

export default ExportDialog
