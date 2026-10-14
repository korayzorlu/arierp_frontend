import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Grid, Stack, IconButton, Box, Typography, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VissuallyHiddenInput from 'component/input/VissuallyHiddenInput';
import { setAlert, setDeleteDocumentDialog, setDialog, setImportDocumentDialog, setThirdPersonDocumentDialog } from 'store/slices/notificationSlice';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
import HistoryIcon from '@mui/icons-material/History';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ForwardIcon from '@mui/icons-material/Forward';
import EastIcon from '@mui/icons-material/East';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

function HistoryInfo(props) {
    const {dark,lang} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [selectedFile, setSelectedFile] = useState(null);

    const getHistoryType = (leaseStatus) => {
        switch (leaseStatus) {
            case "baskasina_transfer_edildi":
                return "KİRACI DEĞİŞİKLİĞİ"
            case "revize_edildi":
                return "TADİL"
            case "iptal_edildi":
                return "TADİL"
            default:
                return ""
        }
    };

    const getFileName = (leaseStatus) => {
        switch (leaseStatus) {
            case "baskasina_transfer_edildi":
                return "kiraci-degisikligi-sozlesmesi"
            case "revize_edildi":
                return "tadil-sozlesmesi"
            case "iptal_edildi":
                return "tadil-sozlesmesi"
            default:
                return ""
        }
    };

    const getFile = async () => {
        try {
            const response_create = await axios.post('/leasing/create_contract_history_file/',
                {   
                    uuid: props.uuid,
                },
                {
                    withCredentials: true
                }
            );
            
        } catch (error) {
            dispatch(setAlert({status:'error',text:error.message}));
        } finally {
            try {
                const response = await axios.post('/leasing/get_contract_history_file/',
                    {
                        uuid: props.uuid,
                    },
                    {
                        responseType: "blob",
                        withCredentials: true
                    }
                );
                console.log(response.headers)
                const a = document.createElement("a");
                a.href = URL.createObjectURL(response.data);
                a.download = `${props.contract}-${getFileName(props.contract_history.lease_status)}.docx`;
                a.click();
                URL.revokeObjectURL(a.href);
            } catch (error) {
                dispatch(setAlert({status:'error',text:error.message}));
            }
        }
    };

    return (
        <Block text="SÖZLEŞME GEÇMİŞİ" icon={<HistoryIcon/>} noDivider> 
            <Stack spacing={2}>
                    {
                        props.contract_history
                        ?
                            <>
                                <Grid
                                container
                                spacing={2}
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 33
                                }}
                                >
                                    <Grid size={{xs:3,sm:3}}>
                                        <Typography variant='body1' sx={{textAlign:'center'}}>
                                            <Link
                                            to={`/leasing/update/${props.contract_history.id}/`}
                                            style={{textDecoration:"underline"}}
                                            >
                                                {props.contract_history.code}
                                            </Link>
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs:3,sm:3}}>
                                        <Typography variant='body1' sx={{textAlign:'center'}}>
                                            <ForwardIcon></ForwardIcon>
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs:3,sm:3}}>
                                        <Typography variant='body1' sx={{textAlign:'center'}}>
                                            {props.code}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                container
                                spacing={2}
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 33
                                }} 
                                >
                                    <Grid size={{xs:12,sm:12}}>
                                        <Typography variant='body1' sx={{textAlign:'center'}}>
                                            {getHistoryType(props.contract_history.lease_status)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                container
                                spacing={2}
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 33
                                }}
                                >
                                    <Grid size={{xs:12,sm:12}} sx={{textAlign:'center'}}>
                                        <Button
                                        variant='contained'
                                        color={dark ? "frostedbirch" : "smoke"}
                                        size='small'
                                        endIcon={<DescriptionIcon />}
                                        onClick={getFile}
                                        >
                                            Dosyayı İndir
                                        </Button>
                                    </Grid>
                                </Grid>
                            </>
                        :
                            <Grid
                            container
                            spacing={4}
                            sx={{
                                justifyContent: "center",
                                alignItems: "center",
                                height: 50
                            }}
                            >
                                <Grid size={{xs:12,sm:12}}>
                                    <Typography variant='body1' sx={{textAlign:'center'}}>
                                        İLK SÖZLEŞME
                                    </Typography>
                                </Grid>
                            </Grid>
                    }
                
            </Stack>
        </Block>
    )
}

export default HistoryInfo
