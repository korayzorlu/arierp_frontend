import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Grid, Stack, IconButton, Box, Typography, TextField, Chip } from '@mui/material';
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
import Block from '../Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { amber, red } from '@mui/material/colors';

function StatusInfo(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <Block text="DURUM BİLGİLERİ" icon={<CheckCircleIcon/>} color={red[700]} noDivider> 
            <Stack spacing={2}>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:1}}>
                        <Chip label={props.lease_status} color="mars" size='small' />
                    </Grid>
                    <Grid size={{xs:12,sm:1}}>
                        <Chip label={props.status} color="smoke" size='small' />
                    </Grid>
                </Grid>
            </Stack>
        </Block>
    )
}

export default StatusInfo
