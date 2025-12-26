import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAlert, setExportDialog, setImportDialog } from '../../store/slices/notificationSlice';
import axios from 'axios';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import Row from '../grid/Row';
import Col from '../grid/Col';
import MUIDialog from '@mui/material/Dialog';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ReactComponent as ExcelIcon } from "../../images/icons/global/excel.svg";
import { ReactComponent as XlsIcon } from "../../images/icons/global/xls.svg";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function ExportDialog(props) {
    const {children,excelURL,exportURL,startEvent,finalEvent,closeEvent,file_name,project,status,date} = props;

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
                {project,status,date},
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
                    maxWidth="sm"
                    fullWidth
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
                            <Button variant="contained" color="text.secondary" onClick={handleClose}>Vazgeç</Button>
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
                    maxWidth="sm"
                    fullWidth
                    >
                        <DialogTitle id="alert-dialog-title">
                            <XlsIcon height={32} width={32} /> Dışa Aktar
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" component="div">
                                <Typography>
                                    Tablodaki veriler excel dosyasında hazırlanarak dışa aktarılacaktır. Devam etmek istiyor musun?
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions className=''>
                            <Button variant="text" color="neutral" onClick={handleClose}>Vazgeç</Button>
                            <Button variant="contained" color="opposite" onClick={handleExport} endIcon={<PlayArrowIcon/>} autoFocus>Başlat</Button>
                        </DialogActions>
                    </MUIDialog>
                )

                
            }

        </>
    )
}

export default ExportDialog
