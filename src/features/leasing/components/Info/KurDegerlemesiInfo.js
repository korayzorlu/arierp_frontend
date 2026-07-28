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
import { Unstable_SankeyChart as SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { Gauge, gaugeClasses } from '@mui/x-charts';

function KurDegerlemesiInfo(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const dispatch = useDispatch();
    
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <Block text="KUR KAYBI DEĞERLEMESİ" icon={<CurrencyExchangeIcon/>} color={red[700]} noDivider> 
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
                        label={"B1 - Bugüne Kadar Ödenmesi Gereken USD Tutar"}
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
                        label={"B2 - Bugüne Kadar Ödenen USD Tutar"}
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
                        label={"B3 - Geciken USD Tutar (B1-B2)"}
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
                <Grid container spacing={4}>
                    <Grid size={{xs:12,sm:12}}>
                        <Typography variant='body2' color="text.secondary">
                            Not: Kur kaybı, geciken ödemelerin güncel kur üzerinden hesaplanan değerleri ile işlem tarihi kuruna göre hesaplanan değerleri arasındaki farktır. Bu fark, geciken ödemelerin kur değişiminden kaynaklanan kaybını temsil eder. B alanları işlem tarihi kuruna göre hesaplanan değerleri, A alanları ise güncel kur üzerinden hesaplanan değerleri göstermektedir. Kur kaybı, B3 ve A4 arasındaki fark olarak hesaplanır ve geciken ödemelerin kur değişiminden kaynaklanan kaybını ifade eder.
                        </Typography>
                    </Grid>
                </Grid>
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <Gauge
                    width={180}
                    height={180}
                    value={props.kur_kaybi_orani}
                    valueMin={0}
                    valueMax={10} // ölçeği kendi eşiğinize göre ayarlayın (ör. max %10 kayıp)
                    startAngle={-110}
                    endAngle={110}
                    text={() => `%${(props.kur_kaybi_orani).toFixed(1)}`}
                    sx={{
                        [`& .${gaugeClasses.valueText}`]: { fontSize: 28, fontWeight: 500 },
                        [`& .${gaugeClasses.valueArc}`]: { fill: '#e34948' },
                        [`& .${gaugeClasses.referenceArc}`]: { fill: '#e1e0d9' },
                    }}
                    />
                    <div>
                        <p style={{ fontSize: 13, color: 'text.secondary', margin: 0 }}>Geciken tutarın kur kaybı</p>
                        <p style={{ fontSize: 20, fontWeight: 500, margin: '4px 0' }}>{props.kur_kaybi} USD</p>
                        <p style={{ fontSize: 13, color: 'text.secondary', margin: 0 }}>{props.geciken_odenmesi_gereken_usd} USD üzerinden</p>
                    </div>
                </div> */}
            </Stack>
        </Block>
    )
}

export default KurDegerlemesiInfo
