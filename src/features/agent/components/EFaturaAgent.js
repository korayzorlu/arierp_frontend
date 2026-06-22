import { Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import Block from './Block'
import NetworkIntelligenceIcon from 'component/icon/NetworkIntelligenceIcon'
import { PlayArrowIcon } from 'icons'
import Dialog from 'component/feedback/Dialog'
import UploadFileIcon from 'component/icon/UploadFileIcon'
import FilePresentIcon from 'component/icon/FilePresentIcon'
import { useDispatch, useSelector } from 'react-redux'
import { setAgentDialog } from 'store/slices/notificationSlice'
import AgentDialog from './AgentDialog'
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

function EFaturaAgent(props) {
    const {agentTasks,agentRunning} = useSelector((store) => store.agentTask);

    const dispatch = useDispatch();

    const handleRun = () => {
        props.onChangeProps('title', 'E-Fatura Kesme');
        props.onChangeProps('templateName', 'e-fatura-kesilecekler.xlsx');
        props.onChangeProps('agentName', 'e_fatura_kesme');
        props.onChangeProps('needLF', true);
        dispatch(setAgentDialog(true));
    }

    return (
        <Block text="E-Fatura Kesme" icon={<NetworkIntelligenceIcon />}  chipLabel="Muhasebe" chipColor="success">
            <Stack spacing={2}>
                <Typography variant='body2' sx={{color: 'text.secondary'}}>
                    Leaseflex üzerinde yapılan e-fatura kesme işlemini otomatikleştirir.
                </Typography>
                <Typography variant='body2' sx={{color: 'text.secondary'}}>
                    Çalıştır butonu ile sözleşme listesinin yer aldığı excel dosyasını yükleyerek işlemi başlatabilirsiniz.
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{xs:12,sm:4}} offset={{xs:0,sm:'auto'}}>
                        <Button
                        variant="contained"
                        color="opposite"
                        onClick={handleRun}
                        endIcon={agentRunning ? <HourglassTopIcon /> : <PlayArrowIcon/>}
                        size='small'
                        disabled={agentRunning}
                        fullWidth
                        >
                            {
                                agentRunning ? "Çalışıyor" : "Çalıştır"
                            }
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
        </Block>
    )
}

export default EFaturaAgent
