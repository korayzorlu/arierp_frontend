import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCurrencies } from '../../../store/slices/dataSlice';
import { deleteSector, fetchSector, updateSector } from '../../../store/slices/partners/sectorSlice';
import { Dialog, Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../component/header/FormHeader';
import PartnerSelect from '../../../component/select/PartnerSelect';
import CurrencySelect from '../../../component/select/CurrencySelect';
import { setDialog } from '../../../store/slices/notificationSlice';

function UpdateSector() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const { type,uuid } = useParams();

    const [data, setData] = useState({});
    const [transactions, setTransactions] = useState({});
   
    const fetchData = async () => {
        const response = await dispatch(fetchSector({activeCompany,params:{uuid}})).unwrap();
        setData(response);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updateSector({data}))
    };

    const handleDelete = async () => {
        setButtonDisabled(true);

        dispatch(deleteSector({data}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title="SEKTÖR DETAYI"
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                onClickDelete={() => dispatch(setDialog(true))}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"İsim"}
                            variant='outlined'
                            value={data.name}
                            onChange={(e) => handleChangeField("name",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Kod"}
                            variant='outlined'
                            value={data.code}
                            onChange={(e) => handleChangeField("code",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Ana Sektör Kodu"}
                            variant='outlined'
                            value={data.mainSectorCode}
                            onChange={(e) => handleChangeField("mainSectorCode",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Eşleştirme Kodu"}
                            variant='outlined'
                            value={data.matchCode}
                            onChange={(e) => handleChangeField("matchCode",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"KKBMB Sektör Kodu"}
                            variant='outlined'
                            value={data.kkbmbSectorCode}
                            onChange={(e) => handleChangeField("kkbmbSectorCode",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
            <Dialog
            title="Delete invoice"
            onClickText="Delete"
            onClickColor="error"
            dismissText="Cancel"
            onClick={handleDelete}
            >
                Are you sure you want to delete this invoice? You cant't undo this action.
            </Dialog>
        </Paper>
    )
}

export default UpdateSector
