import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GroupsIcon from '@mui/icons-material/Groups';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';

function ScanPartners() {
    const {mobile} = useSelector((store) => store.sidebar);

    return (
        <Stack
        sx={{
            height: 'calc(100vh - 56px)',
            overflow: 'hidden',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
        }}
        justifyContent="center"
        alignItems="center">
            <Grid container spacing={1} direction={"column"} alignItems="center" sx={{width: mobile ? '100%' : '40%'}}>
                <Grid size={{xs:12,sm:12}}>
                    <Button
                    variant="contained"
                    color='paper'
                    fullWidth
                    sx={{
                        height: 180,
                        flexDirection: 'column',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >   
                        <Typography sx={{color:'text.secondary', width: '100%', textAlign: 'start'}}>
                            <PolicyIcon sx={{fontSize: '2.5rem'}}/>
                        </Typography>
                        <Typography sx={{color:'text.primary'}}>
                            <PersonIcon sx={{fontSize: '4rem'}}/>
                        </Typography>
                        <Typography sx={{color:'text.primary', fontSize: '1.5rem'}}>
                            Tekil kişi Sorgulama
                        </Typography>
                    </Button>
                </Grid>
                <Grid size={{xs:12,sm:12}}>
                    <Button
                    variant="contained"
                    color='paper'
                    fullWidth
                    sx={{
                        height: 180,
                        flexDirection: 'column',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >   
                        <Typography sx={{color:'text.secondary', width: '100%', textAlign: 'start'}}>
                            <PolicyIcon sx={{fontSize: '2.5rem'}}/>
                        </Typography>
                        <Typography sx={{color:'text.primary'}}>
                            <GroupsIcon sx={{fontSize: '4rem'}}/>
                        </Typography>
                        <Typography sx={{color:'text.primary', fontSize: '1.5rem'}}>
                            Toplu Sorgulama
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </Stack>
    )
}

export default ScanPartners
