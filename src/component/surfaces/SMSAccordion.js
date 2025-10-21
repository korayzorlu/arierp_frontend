import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DoneIcon from '@mui/icons-material/Done';

function SMSAccordion(props) {
    const {sms} = props;

    const getStatusParams = (status) => {
        switch (status) {
            case "0":
                return { color: "error", icon: <PriorityHighIcon /> };
            case "1":
                return { color: "success", icon: <DoneAllIcon /> };
            case "2":
                return { color: "warning", icon: <HourglassBottomIcon /> };
            default:
                return { color: "primary", icon: <DoneIcon /> };
        }
    };
    
    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            >
                <Typography component="span">
                    <Grid container spacing={1}>
                        <Grid item>
                            {sms.delivery_date}
                        </Grid>
                        <Grid item>
                            <Chip
                            key={sms.uuid}
                            variant='outlined'
                            color={getStatusParams(sms.status).color}
                            icon={getStatusParams(sms.status).icon}
                            label={sms.status_display}
                            size='small'
                            sx={{border:'none'}}
                            />
                        </Grid>
                    </Grid>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1}>
                    <Typography>
                        {sms.text}
                    </Typography>
                    <Typography variant='body2' sx={{color:'text.secondary'}} align='right'>
                        {sms.phone_number}
                    </Typography>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}

export default SMSAccordion
