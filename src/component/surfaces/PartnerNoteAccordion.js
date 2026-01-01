import { Accordion, AccordionDetails, AccordionSummary, Chip, Grid, IconButton, InputAdornment, Stack, TextareaAutosize, TextField, Typography } from '@mui/material'
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

function PartnerNoteAccordion(props) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerInformation,partnerNotesParams} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const [edit, setEdit] = useState(false)
    const [data, setData] = useState({uuid: props.note.uuid, title: props.note.title, text: props.note.text})
    const [expanded, setExpanded] = useState(false);
    const [deleteCheck, setDeleteCheck] = useState(false)

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

    const handleAccordionChange = (_, isExpanded) => {
        if (edit) return;          // edit modunda tıklamayı yut
        setExpanded(isExpanded);
    };

    const handleSubmitEditTitle = async () => {
        await dispatch(updatePartnerNote({params: {data, type: "title"}})).unwrap();
        await dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.uuid}})).unwrap();
        setEdit(!edit)
    }

    const handleSubmitEditText = async () => {
        await dispatch(updatePartnerNote({params: {data, type: "text"}})).unwrap();
        await dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.uuid}})).unwrap();
        setEdit(!edit)
    }

    const handleDelete = async () => {
        await dispatch(deletePartnerNote({params: {data}})).unwrap();
        await dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.uuid}})).unwrap();
        setEdit(!edit)
    }

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };
    
    return (
        <Accordion expanded={edit ? true : expanded} onChange={handleAccordionChange}>
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
                                        slotProps={{
                                            input: {
                                                endAdornment:(
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                        onClick={handleSubmitEditTitle}
                                                        edge="end"
                                                        >
                                                            <CheckIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                        }}
                                        
                                        />
                                    </>
                                :
                                    props.note.title ? props.note.title : <Chip label="Başlıksız Not" size="small" />
                            }
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} size={{xs:12,sm:6}}>
                        <Grid size={{xs:12,sm:8}} sx={{textAlign: 'right'}}>
                            <Chip label={props.note.user} size="small" color={dark ? 'silvercoin' : 'frostedbirch'} icon={<PersonIcon />} />
                        </Grid>
                        <Grid size={{xs:12,sm:4}} sx={{textAlign: 'right'}}>
                            {props.note.date}
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
                                slotProps={{
                                    input: {
                                        endAdornment:(
                                            <InputAdornment position="end">
                                                <IconButton
                                                onClick={handleSubmitEditText}
                                                edge="end"
                                                >
                                                    <CheckIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                
                                />
                            </>
                        :
                            props.note.text
                    }
                    <Typography variant='body2' sx={{color:'text.secondary'}} align='right'>
                        <IconButton aria-label="delete" size='small' color={dark ? 'silvercoin' : 'ari'} onClick={() => {setEdit(!edit)}}>
                            <EditIcon/>
                        </IconButton>
                        {
                            deleteCheck
                            ?
                                <>
                                    <IconButton aria-label="delete" size='small' color={dark ? 'silvercoin' : 'ari'} onClick={handleDelete}>
                                        <CheckIcon/>
                                    </IconButton>
                                    <IconButton aria-label="delete" size='small' color={dark ? 'silvercoin' : 'ari'} onClick={() => setDeleteCheck(false)}>
                                        <ClearIcon/>
                                    </IconButton>
                                </>
                            :
                                <IconButton aria-label="delete" size='small' color='error' onClick={() => setDeleteCheck(true)}>
                                    <DeleteIcon/>
                                </IconButton>
                        }
                    </Typography>
                </Stack>
            </AccordionDetails>
        </Accordion>
    )
}

export default PartnerNoteAccordion
