import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { addPayment, fetchincomingPayments } from '../../../../store/slices/accounting/paymentSlice';
import { fetchCurrencies } from '../../../../store/slices/dataSlice';
import { Divider, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import PartnerSelect from '../../../../component/select/PartnerSelect';
import { Grid } from '@mui/material';
import CurrencySelect from '../../../../component/select/CurrencySelect';
import AutocompleteMUI from '../../../../component/select/AutocompleteMUI';

function AddPayment() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const { type } = useParams();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState({companyId: activeCompany.companyId,type:type,currency:user.location.currency,receiver:"Bank"})

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(fetchincomingPayments());
        dispatch(fetchCurrencies());
        dispatch(setIsProgress(false));
    }, [dispatch])

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addPayment({data})).unwrap();
        setDisabled(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`CREATE ${type.toUpperCase()} PAYMENT`}
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:8}}>
                            <PartnerSelect
                            label="Partner"
                            emptyValue={true}
                            value={data.partner}
                            types={type === "incoming" ? `{customer,shareholder}` : `{supplier,shareholder}`}
                            onChange={(value) => handleChangeField("partner",{uuid:value.uuid,name:value.name})}
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Payment No"}
                            variant='outlined'
                            value={data.invoice_no}
                            onChange={(e) => handleChangeField("payment_no",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:4}}>
                            <AutocompleteMUI
                            label="Receiver Account"
                            placeholder="Choose a bank"
                            emptyValue={true}
                            value={data.receiver}
                            options={["Bank","Cash"]}
                            onChange={(value) => handleChangeField("receiver",value)}
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

export default AddPayment
