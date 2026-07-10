import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Grid, Stack, IconButton, Box, Typography, TextField } from '@mui/material';
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
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import { red } from '@mui/material/colors';

function CustomerInfo(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <Block text="MÜŞTERİ" icon={<PersonIcon/>} color={red[700]} noDivider> 
            <Stack spacing={2}>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:6}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri"}
                        variant='standard'
                        value={props.partner}
                        disabled
                        fullWidth
                        sx={{color: '#fff'}}
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri TC/VKN"}
                        variant='standard'
                        value={props.partner_tc}
                        disabled
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Block>
    )
}

export default CustomerInfo
