import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Block from './Block';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Grid, Stack, IconButton, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import { setAlert, setDeleteDocumentDialog, setImportDocumentDialog, setThirdPersonDocumentDialog } from 'store/slices/notificationSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AddBoxIcon, AddCircleIcon, AttachFileRoundedIcon } from 'icons';
import ImportDocumentDialog from 'component/dialog/ImportDocumentDialog';
import { fetchPartnerFinancialProfile } from 'store/slices/partners/partnerFinancialProfileSlice';
import DeleteDocumentDialog from 'component/dialog/DeleteDocumentDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOffIcon from '@mui/icons-material/FolderOff';

function PartnerInformationDocuments(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <Block text="Müşteri Bilgi Formu" icon={<InfoIcon />} rightButton={{icon: <AddCircleIcon />, onClick: () => dispatch(setImportDocumentDialog(true))}}> 
            {/* <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
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
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:4}}>
                    <Button variant="contained" color="opposite" onClick={handleImport} autoFocus fullWidth>Yükle</Button>
                </Grid>
            </Grid> */}
            <Stack spacing={2} sx={{maxHeight:'300px',overflowY:'auto',pb:1}}>
                {   
                    props.partner_information_documents.length > 0
                    ?
                        props.partner_information_documents.map((document, index) => (
                            <Grid container spacing={2}>
                                <Grid size={{xs:12,sm:10}}>
                                    <Link key={index} to={`${process.env.REACT_APP_BACKEND_URL}${document.url}`} target="_blank" component="a" sx={{ textDecoration: 'underline' }}>
                                        <IconButton
                                        key={`${index}-icon`}
                                        color='opposite'
                                        size='small'
                                        >
                                            <AttachFileRoundedIcon />
                                        </IconButton>
                                    </Link>
                                    {document.label}
                                </Grid>
                                <Grid size={{xs:12,sm:2}} sx={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                    <IconButton
                                    key={index}
                                    color='error'
                                    size='small'
                                    onClick={() => {dispatch(setDeleteDocumentDialog(true));setSelectedFile(document.id)}}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))
                    :
                        <Box sx={{mt: 2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
                            <FolderOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></FolderOffIcon>
                            <Typography variant='body2' sx={{color:'text.secondary'}}>
                            {lang === "tr" ? "Yüklenmiş müşteri bilgi formu bulunmamaktadır." : "No records to display."}
                            </Typography>
                        </Box>
                }
            </Stack>
            <ImportDocumentDialog
            uuid={props.partner_uuid}
            finalEvent={props.handleReload}
            importUrl='/partners/import_partner_information_document/'
            />
            <DeleteDocumentDialog
            uuid={selectedFile}
            finalEvent={props.handleReload}
            url='/partners/delete_partner_information_document/'
            />
        </Block>
    )
}

export default PartnerInformationDocuments
