import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsProgress } from '../../../store/slices/processSlice';
import { fetchCountries, fetchCurrencies } from '../../../store/slices/dataSlice';
import { addLease } from '../../../store/slices/leasing/leaseSlice';
import { Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../component/header/FormHeader';
import PartnerSelect from '../../../component/select/PartnerSelect';
import CurrencySelect from '../../../component/select/CurrencySelect';

function AddLease() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState({companyId: activeCompany.companyId})

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(fetchCountries());
        dispatch(fetchCurrencies());
        dispatch(setIsProgress(false));
    }, [dispatch])
    

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addLease({data})).unwrap();
        setDisabled(false);
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
                title={`YENİ KİRA PLANI`}
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <PartnerSelect
                            label="Partner"
                            emptyValue={true}
                            value={data.partner}
                            onChange={(value) => handleChangeField("partner",{uuid:value.uuid,name:value.name})}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Invoice No"}
                            variant='outlined'
                            value={data.invoice_no}
                            onChange={(e) => handleChangeField("invoice_no",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                        <TextField
                            type="number"
                            size="small"
                            label={"Amount"}
                            variant='outlined'
                            value={data.amount}
                            onChange={(e) => handleChangeField("amount",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <CurrencySelect
                            label="Currency"
                            emptyValue={true}
                            value={data.currency}
                            onChange={(value) => handleChangeField("currency",value)}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default AddLease
