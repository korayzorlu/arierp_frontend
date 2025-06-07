import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { addAccount, fetchReceivableAccounts } from '../../../../store/slices/accounting/accountSlice';
import { fetchCountries, fetchCurrencies } from '../../../../store/slices/dataSlice';
import { addInvoice, fetchSaleInvoices } from '../../../../store/slices/accounting/invoiceSlice';
import { Divider, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { capitalize } from 'lodash';
import { Grid } from '@mui/material';
import PartnerSelect from '../../../../component/select/PartnerSelect';
import CurrencySelect from '../../../../component/select/CurrencySelect';

function AddInvoice() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const { type } = useParams();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState({companyId: activeCompany.companyId,type:type,currency:user.location.currency})

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(fetchSaleInvoices());
        dispatch(fetchCurrencies());
        dispatch(setIsProgress(false));
    }, [dispatch])

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addInvoice({data})).unwrap();
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
                title={`CREATE ${type.toUpperCase()} INVOICE`}
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
                            types={type === "sale" ? `{customer}` : `{supplier}`}
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

export default AddInvoice
