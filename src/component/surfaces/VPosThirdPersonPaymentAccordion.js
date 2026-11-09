import { Accordion, AccordionDetails, AccordionSummary, Chip, Divider, Grid, IconButton, InputAdornment, Stack, TextareaAutosize, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DoneIcon from '@mui/icons-material/Done';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import CheckIcon from '@mui/icons-material/Check';
import { deletePartnerNote, fetchPartnerInformation, fetchPartnerNotes, updatePartnerNote } from 'store/slices/partners/partnerSlice';
import { type } from 'jquery';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';

function VPosThirdPersonPaymentAccordion(props) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [edit, setEdit] = useState(false)
    const [data, setData] = useState({uuid: props.obj.uuid, title: props.obj.title, text: props.obj.text})
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = (_, isExpanded) => {
        if (edit) return;          // edit modunda tıklamayı yut
        setExpanded(isExpanded);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };
    
    return (
        <Accordion expanded={true} onChange={handleAccordionChange}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            >
                <Grid
                container
                spacing={1}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: '100%'
                }}
                >
                    <Grid container spacing={1} size={{xs:12,sm:6}}>
                        <Grid size={{xs:12,sm:12}}>
                            {
                                edit
                                ?   
                                    <>
                                        <TextField
                                        variant="outlined"
                                        size='small'
                                        label=''
                                        value={data.title}
                                        onChange={(e) => handleChangeField("title",e.target.value)}
                                        fullWidth
                                        />
                                    </>
                                :
                                    <Typography>
                                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(props.obj.amount || 0)}
                                        {" "}{props.obj.currency}
                                    </Typography>
                            }
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} size={{xs:12,sm:6}}>
                        <Grid size={{xs:12,sm:12}} sx={{textAlign: 'right',pr:2}}>
                            {props.obj.transaction_date}
                        </Grid>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1}>
                    {
                        edit
                        ?   
                            <>
                                <TextField
                                variant="outlined"
                                size='small'
                                label=''
                                multiline
                                rows={4}
                                value={data.text}
                                onChange={(e) => handleChangeField("text",e.target.value)}
                                fullWidth
                                />
                            </>
                        :
                            props.obj.text
                    }
                    <Typography color='primary'>
                        Açıklama
                    </Typography>
                    <Typography>
                        {props.obj.contract_code || "00000"} No'lu sözleşme, {props.obj.customer_name || ""} adına yapılan ödeme.
                    </Typography>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}

export default VPosThirdPersonPaymentAccordion
