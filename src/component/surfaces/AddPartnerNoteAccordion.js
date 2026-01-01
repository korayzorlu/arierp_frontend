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
import { fetchPartnerInformation, fetchPartnerNotes, updatePartnerNote } from 'store/slices/partners/partnerSlice';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

function AddPartnerNoteAccordion(props) {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerInformation,partnerNotesParams} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const [edit, setEdit] = useState(false);
    const [data, setData] = useState({uuid: '', title: '', text: ''});
    const [expanded, setExpanded] = useState(false);

    const handleAccordionChange = (_, isExpanded) => {
        if (edit) return;          // edit modunda tıklamayı yut
        setExpanded(isExpanded);
    };

    const handleSubmitEditTitle = () => {
        dispatch(updatePartnerNote({params: {data, type: "title"}}));
        dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.partner_id}}));
        setEdit(!edit)
    };

    const handleSubmitEditText = () => {
        dispatch(updatePartnerNote({params: {data, type: "text"}}));
        dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.partner_id}}));
        setEdit(!edit)
    };

    const handleSubmitEdit = () => {
        //dispatch(addPartnerNote({params: {data}}));
        dispatch(fetchPartnerNotes({activeCompany,params:{...partnerNotesParams,partner_id:partnerInformation.partner_id}}));
        setEdit(!edit)
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
    };
    
    return (
        <Stack spacing={2}>
            <Grid container spacing={1} size={{xs:12,sm:12}}>
                <Grid size={{xs:12,sm:12}}>
                    <TextField
                    variant="outlined"
                    size='small'
                    label='Başlık'
                    value={props.title}
                    onChange={(e) => props.onChangeTitle(e.target.value)}
                    fullWidth
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} size={{xs:12,sm:12}}>
                <Grid size={{xs:12,sm:12}}>
                    <TextField
                    variant="outlined"
                    size='small'
                    label='Not'
                    multiline
                    rows={4}
                    value={props.text}
                    onChange={(e) => props.onChangeText(e.target.value)}
                    fullWidth
                    />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default AddPartnerNoteAccordion
