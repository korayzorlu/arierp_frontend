import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { addAccount, fetchReceivableAccounts } from '../../../../store/slices/accounting/accountSlice';
import { fetchCountries, fetchCurrencies } from '../../../../store/slices/dataSlice';
import { Divider, Paper, Stack } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { Grid } from '@mui/material';
import CurrencySelect from '../../../../component/select/CurrencySelect';
import { capitalize } from 'lodash';
import PartnerSelect from '../../../../component/select/PartnerSelect';

function AddAccount() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const { type } = useParams();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [data, setData] = useState({companyId: activeCompany.companyId,type:type,currency:user.location.currency})

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(fetchReceivableAccounts());
        dispatch(fetchCurrencies());
        dispatch(fetchCountries());
        dispatch(setIsProgress(false));
    }, [dispatch])

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addAccount({data})).unwrap();
        setDisabled(false);
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    const getTitle = (type) => {
        switch (type) {
            case "receivable":
                return "ACCOUNTS RECEIVABLE (AR)"
            case "payable":
                return "ACCOUNTS PAYABLE (AP)"
            case "sales":
                return `SALES INCOME - ${data.currency}`
            case "expense":
                return `EXPENSE - ${data.currency}`
            default:
                return "ACCOUNT DETAIL"
        }
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`Create Account ${capitalize(type)}`}
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:10}}>
                            {
                                data.type === "receivable" || data.type === "payable"
                                ?
                                    <PartnerSelect
                                    label="Partner"
                                    emptyValue={true}
                                    value={data.partner}
                                    types={type === "receivable" ? `{customer}` : `{supplier}`}
                                    onChange={(value) => handleChangeField("partner",{uuid:value.uuid,name:value.name})}
                                    />
                                :
                                    null
                            }
                        </Grid>
                        <Grid size={{xs:12,sm:data.type === "receivable" || data.type === "payable" ? 2 : 12}}>
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

export default AddAccount
