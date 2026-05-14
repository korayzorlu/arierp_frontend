import { Autocomplete, Button, Chip, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material'
import AriCheckBox from 'component/checkbox/AriCheckBox'
import { ArrowOutwardIcon } from 'icons'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info';
import Title from './Title'
import Block from './Block'

function Info(props) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/partners/update/${props.partner.id}`);
    }

    return (
        <Block
        noDivider
        // icon={<InfoIcon />}
        // text={(
        //     <>
        //         Partner Bilgileri 
        //         <Button
        //         onClick={handleNavigate}
        //         size='small'
        //         variant='text'
        //         color='primary'
        //         endIcon={<ArrowOutwardIcon />}
        //         >
        //             Profile Git
        //         </Button>
        //     </>
        // )}
        > 
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            İsim
                        </Typography>
                        <Typography>
                            {props.partner.name} 
                            {
                                props.partner.customer_type === "individual" ? (
                                    <Chip key={props.partner.id} variant='contained' color="primary" label="Bireysel" size='small' sx={{ml:1}} />
                                ) : (
                                    <Chip key={props.partner.id} variant='contained' color="ari" label="Tüzel" size='small' sx={{ml:1}} />
                                )
                            }
                            <Button
                            onClick={handleNavigate}
                            size='small'
                            variant='text'
                            color='primary'
                            endIcon={<ArrowOutwardIcon />}
                            >
                                Profile Git
                            </Button>
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            TC/VKN No
                        </Typography>
                        <Typography>
                            {props.partner.tc_vkn_no}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            Müşteri Kodu
                        </Typography>
                        <Typography>
                            {props.partner.customer_code}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <Stack>
                        <Typography variant='body2' color="textSecondary">
                            CRM Kodu
                        </Typography>
                        <Typography>
                            {props.partner.crm_code}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Block>
    )
}

export default Info
