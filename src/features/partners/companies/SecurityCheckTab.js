import { Button, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import GppGoodIcon from '@mui/icons-material/GppGood';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useDispatch, useSelector } from 'react-redux';
import { setScanning } from '../../../store/slices/compliance/scanPartnerSlice';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import WarningIcon from '@mui/icons-material/Warning';
import { fetchPartner, ignorePartner, updatePartner } from 'store/slices/partners/partnerSlice';
import { setDialog } from 'store/slices/notificationSlice';
import Dialog from 'component/feedback/Dialog';

function SecurityCheckTab(props) {
    const {reliable,uuid,ignoreClick} = props;
    const {scanning} = useSelector((store) => store.scanPartner);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

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
        
            scanning
            ?
                <Stack spacing={8}>

                    <Grid
                    container
                    spacing={2}
                    >
                        <Grid size={{xs:12,sm:12}}>
                            <Typography variant="body1" sx={{ textAlign: "center", color: "text.secondary" }}>
                                <span>
                                    <svg width="56" height="56" viewBox="0 0 56 56">
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray="120"
                                            strokeDashoffset="60"
                                            strokeLinecap="round"
                                            style={{ opacity: 0.3 }}
                                        />
                                        <circle
                                            cx="28"
                                            cy="28"
                                            r="24"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray="40"
                                            strokeDashoffset="0"
                                            strokeLinecap="round"
                                        >
                                            <animateTransform
                                                attributeName="transform"
                                                type="rotate"
                                                from="0 28 28"
                                                to="360 28 28"
                                                dur="1s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                    </svg>
                                </span>
                            </Typography>
                            <Typography variant='body1' sx={{textAlign:"center",color:"text.secondary"}}>
                                Sorgulama işlemi devam ediyor. Lütfen bekleyiniz...
                            </Typography>
                        </Grid>
                    </Grid>

                </Stack>
            :
                <Stack spacing={8}>

                    <Grid
                    container
                    spacing={2}
                    >
                        <Grid size={{xs:12,sm:12}}>
                            {reliable
                            ?
                                <>
                                    <Typography variant='body1' sx={{textAlign:"center",color:"text.secondary"}}>
                                        <GppGoodIcon sx={{fontSize: '5rem'}} />
                                    </Typography>
                                    <Typography variant='body1' sx={{textAlign:"center",color:"text.secondary"}}>
                                        Herhangi bir yasaklı listede bulunmamaktadır.
                                    </Typography>
                                </>
                            :
                                <>
                                    <Typography variant='body1' sx={{textAlign:"center",color:"text.error"}}>
                                        <GppMaybeIcon color='error' sx={{fontSize: '5rem'}} />
                                    </Typography>
                                    <Typography variant='body1' sx={{textAlign:"center",color:"text.error"}}>
                                        Kontrol edilen yasaklı listelerde bulunmuştur! Lütfen detaylı inceleyiniz veya yöneticinizle iletişime geçiniz.
                                    </Typography>
                                </>
                            }
                        </Grid>
                    </Grid>
                    
                    {
                        reliable
                        ?
                            <Stack spacing={2}>
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
                                        startIcon={<TravelExploreIcon />}
                                        fullWidth
                                        onClick={handleScan}
                                        >Sorgula</Button>
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
                                        color='error'
                                        startIcon={<WarningIcon />}
                                        fullWidth
                                        onClick={() => dispatch(setDialog(true))}
                                        >Yasaklı Listesine Ekle</Button>
                                    </Grid>
                                </Grid>
                                <Dialog
                                title={"Partneri Yasaklı Listesine Ekle"}
                                text={"Bu partner yasaklı listesine eklemek istediğinize emin misiniz?"}
                                onClickText={"Ekle"}
                                onClick={() => ignoreClick()}
                                />
                            </Stack>
                            
                        :
                            null

                    }
                    

                </Stack>
        
        
    )
}

export default SecurityCheckTab
