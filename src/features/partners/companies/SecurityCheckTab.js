import { Button, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import GppGoodIcon from '@mui/icons-material/GppGood';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useDispatch, useSelector } from 'react-redux';
import { setScanning } from '../../../store/slices/compliance/scanPartnerSlice';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';

function SecurityCheckTab(props) {
    const {reliable} = props;
    const {scanning} = useSelector((store) => store.scanPartner);

    const dispatch = useDispatch();

    const handleScan = () => {
        dispatch(setScanning(true));

        setTimeout(() => {
            dispatch(setScanning(false));
        }, 3000);
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
                                        Kontrol edilen yasaklı listelerde bulunmuştur! Lütfen detaylı inceleyiniz.
                                    </Typography>
                                </>
                            }
                        </Grid>
                    </Grid>
                    
                    {
                        reliable
                        ?
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
                        :
                            null

                    }
                    

                </Stack>
        
        
    )
}

export default SecurityCheckTab
