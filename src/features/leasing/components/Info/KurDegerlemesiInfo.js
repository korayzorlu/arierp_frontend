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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { red } from '@mui/material/colors';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

function KurDegerlemesiInfo(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <Block text="KUR DEĞERLEMESİ" icon={<CurrencyExchangeIcon/>} color={red[700]} noDivider> 
            <Stack spacing={2}>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"A1 - Bugüne Kadar Ödenmesi Gereken Tutar"}
                        variant='standard'
                        value={props.odenmesi_gereken_yerel}
                        disabled
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"A2 - Bugüne Kadar Ödenen Tutar"}
                        variant='standard'
                        value={props.odenen_yerel}
                        disabled
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"A3 - Geciken Tutar (A1-A2)"}
                        variant='standard'
                        value={props.overdue_amount}
                        disabled
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"A4 - Geciken USD Tutar (A3/Güncel Kur)"}
                        variant='standard'
                        value={props.geciken_usd}
                        disabled
                        fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"B1 - Bugüne Kadar Ödenmesi Gereken USD Tutar(İşlem Tarihi Kuruna Göre)"}
                        variant='standard'
                        value={props.odenmesi_gereken_usd}
                        disabled
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"B2 - Bugüne Kadar Ödenen USD Tutar(İşlem Tarihi Kuruna Göre)"}
                        variant='standard'
                        value={props.odenen_usd}
                        disabled
                        fullWidth
                        />
                    </Grid>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"B3 - Geciken USD Tutar(İşlem Tarihi Kuruna Göre) (B1-B2)"}
                        variant='standard'
                        value={props.geciken_odenmesi_gereken_usd}
                        disabled
                        fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:3}}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Kur Kaybı USD (B3-A4)"}
                        variant='standard'
                        value={props.kur_kaybi}
                        disabled
                        fullWidth
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Block>
    )
}

export default KurDegerlemesiInfo
