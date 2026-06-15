import { Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import Block from './Block'
import NetworkIntelligenceIcon from 'component/icon/NetworkIntelligenceIcon'
import { PlayArrowIcon } from 'icons'
import Dialog from 'component/feedback/Dialog'
import UploadFileIcon from 'component/icon/UploadFileIcon'
import FilePresentIcon from 'component/icon/FilePresentIcon'
import { useDispatch } from 'react-redux'
import { setAgentDialog } from 'store/slices/notificationSlice'
import AgentDialog from './AgentDialog'

function IhtarAgent(props) {
    const dispatch = useDispatch();

    const handleRun = () => {
        props.onChangeProps('title', 'İhtar Çekme');
        props.onChangeProps('templateName', 'ihtar-cekilecekler.xlsx');
        props.onChangeProps('agentName', 'ihtar_cekme');
        dispatch(setAgentDialog(true));
    }

    return (
        <Block text="İhtar Çekme" icon={<NetworkIntelligenceIcon />}>
            <Stack spacing={2}>
                <Typography variant='body2' sx={{color: 'text.secondary'}}>
                    Leaseflex üzerinde yapılan ihtar çekme işlemini otomatikleştirir.
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
                        endIcon={<PlayArrowIcon/>}
                        size='small'
                        fullWidth
                        >
                            Çalıştır
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
        </Block>
    )
}

export default IhtarAgent
