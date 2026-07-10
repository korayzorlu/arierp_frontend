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
import ApartmentIcon from '@mui/icons-material/Apartment';
import { red } from '@mui/material/colors';

function ProjectInfo(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <Block text="PROJE" icon={<ApartmentIcon/>} color={red[700]} noDivider> 
            <Stack spacing={2}>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:8}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Proje"}
                        variant='standard'
                        value={props.item}
                        disabled
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:4}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Blok"}
                        variant='standard'
                        value={props.block}
                        disabled
                        fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:4}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Bağımsız Bölüm"}
                        variant='standard'
                        value={props.unit}
                        disabled
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Block>
    )
}

export default ProjectInfo
