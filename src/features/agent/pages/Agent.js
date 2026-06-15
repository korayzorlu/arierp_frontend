import { Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import { useSelector } from 'react-redux';
import NetworkIntelligenceIcon from 'component/icon/NetworkIntelligenceIcon';
import IhtarAgent from '../components/IhtarAgent';
import AgentDialog from '../components/AgentDialog';


function Agent() {
    const {dark} = useSelector((store) => store.auth);

    const [agentDialogProps, setAgentDialogProps] = useState(null);

    const handleChangeProps = (key,value) => {
        setAgentDialogProps(data => ({...data, [key]:value}));
    };

    return (
        <Stack spacing={1}>
            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:12}}>
                    <Paper elevation={0} sx={{p:2}} square>
                        <Stack spacing={2} sx={{justifyContent:'center',alignItems:'center'}}>
                            <NetworkIntelligenceIcon color={dark ? "silvercoin" : "ari"} sx={{fontSize:'4rem'}} />
                            <Typography variant='h4' fontWeight={600} sx={{color: dark ? "silvercoin" : "ari"}}>ARI AGENT</Typography>
                            <Typography variant='body'>Gelişmiş agent özellikleri ile rutin uzun işlemleri otomatikleştirin ve verimliliği artırın.</Typography>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:4}}>
                    <IhtarAgent
                    onChangeProps={handleChangeProps}
                    
                    />
                </Grid>
            </Grid>
            <AgentDialog {...agentDialogProps}/>
        </Stack>
    )
}

export default Agent
