import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCountries, fetchCurrencies } from '../../../store/slices/dataSlice';
import { deletePartner, fetchPartner } from '../../../store/slices/partners/partnerSlice';
import { deleteLease, fetchLease, updateLease } from '../../../store/slices/leasing/leaseSlice';
import { Dialog, Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../component/header/FormHeader';
import { setDialog } from '../../../store/slices/notificationSlice';
import PartnerSelect from '../../../component/select/PartnerSelect';
import CurrencySelect from '../../../component/select/CurrencySelect';
import InstallmentsInLease from '../components/InstallmentsInLease';

function UpdateLease() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [switchDisabled, setSwitchDisabled] = useState(false);

    const { uuid } = useParams();

    const [data, setData] = useState({})

    const fetchData = async () => {
        await dispatch(fetchCountries()).unwrap();
        await dispatch(fetchCurrencies()).unwrap();
        const response = await dispatch(fetchLease({activeCompany,params:{uuid}})).unwrap();
        setData(response);
        handleChangeShareholder(response.shareholder);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updateLease({data}));
    };

    const handleDelete = async () => {
        setButtonDisabled(true);
        dispatch(deleteLease({data}));
    };

    const handleChangeShareholder = (value) => {
        setSwitchDisabled(value);
        handleChangeField("customer",false);
        handleChangeField("supplier",false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`KİRA PLANI DETAY - ${data.code || ""}`}
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                onClickDelete={() => dispatch(setDialog(true))}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Kira Planı Kodu"}
                            variant='outlined'
                            value={data.code}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Sözleşme No"}
                            variant='outlined'
                            value={data.contract}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Müşteri"}
                            variant='outlined'
                            value={data.partner}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Müşteri TC/VKN"}
                            variant='outlined'
                            value={data.partner_tc}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:6}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Proje"}
                            variant='outlined'
                            value={data.project}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Blok"}
                            variant='outlined'
                            value={data.block}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Bağımsız Bölüm"}
                            variant='outlined'
                            value={data.unit}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Vade"}
                            variant='outlined'
                            value={data.vade}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Müşteri Baz Maliyet"}
                            variant='outlined'
                            value={data.musteri_baz_maliyet}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"IRR"}
                            variant='outlined'
                            value={data.irr}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Para Birimi"}
                            variant='outlined'
                            value={data.currency}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Finansman Kurum"}
                            variant='outlined'
                            value={data.finansman_kurum}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Aktivasyon Tarihi"}
                            variant='outlined'
                            value={data.activition_date}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Statü 1"}
                            variant='outlined'
                            value={data.lease_status}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Statü 2"}
                            variant='outlined'
                            value={data.status}
                            disabled={false}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <InstallmentsInLease lease_id={uuid}></InstallmentsInLease>
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

export default UpdateLease
