import { Button, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import GppGoodIcon from '@mui/icons-material/GppGood';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useDispatch, useSelector } from 'react-redux';
import { setScanning } from '../../../store/slices/compliance/scanPartnerSlice';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import WarningIcon from '@mui/icons-material/Warning';
import { fetchPartner, ignorePartner, updatePartner } from 'store/slices/partners/partnerSlice';
import { setDialog, setExportDialog } from 'store/slices/notificationSlice';
import Dialog from 'component/feedback/Dialog';
import SummarizeIcon from '@mui/icons-material/Summarize';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';

function ManagerSummaryTab(props) {
    const {reliable,uuid,ignoreClick} = props;
    const {user} = useSelector((store) => store.auth);
    const {scanning} = useSelector((store) => store.scanPartner);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [exportURL, setExportURL] = useState("")
    
    const handleScan = () => {
        dispatch(setScanning(true));

        setTimeout(() => {
            dispatch(setScanning(false));
        }, 3000);
    };

    const handleIgnore = async () => {
        await dispatch(ignorePartner({data:{uuid:uuid}})).unwrap();
        await dispatch(fetchPartner({activeCompany,uuid})).unwrap();
        dispatch(setDialog(false));
    };

    return (
        <Stack spacing={8}>

            <Grid
            container
            spacing={2}
            >
                <Grid size={{xs:12,sm:12}}>
                    <Typography variant='body1' sx={{textAlign:"center",color:"text.secondary"}}>
                        <QueryStatsIcon sx={{fontSize: '5rem'}} />
                    </Typography>
                    <Typography variant='body1' sx={{textAlign:"center",color:"text.secondary"}}>
                        Müşterinin tüm sözleşmeleri için yönetici özeti raporu oluşturulur. Raporu oluşturmak ve indirmek için aşağıdaki butona tıklayabilirsiniz.
                    </Typography>
                </Grid>
            </Grid>
            
            <Grid
            container
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
            >
                <Grid size={{xs:6,sm:3}}>
                    <Button
                    variant='contained'
                    color='mars'
                    startIcon={<SummarizeIcon />}
                    fullWidth
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/leasing/export_manager_summary/`)}}
                    >Rapor Oluştur</Button>
                </Grid>
            </Grid>

            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => console.log("starting")}
            finalEvent={() => console.log("finalizing")}
            partner={uuid}
            />
            

        </Stack>
        
        
    )
}

export default ManagerSummaryTab
