import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsProgress } from 'store/slices/processSlice';
import { fetchCountries, fetchCurrencies } from 'store/slices/dataSlice';
import { addLease } from 'store/slices/leasing/leaseSlice';
import { Divider, Grid, Paper, Stack, TextField } from '@mui/material';
import FormHeader from 'component/header/FormHeader';
import PartnerSelect from 'component/select/PartnerSelect';
import CurrencySelect from 'component/select/CurrencySelect';
import BankAccountSelect from 'component/select/BankAccountSelect';
import { DatePicker, DateRangePicker, DateTimePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { addBankAccountTransaction } from 'store/slices/finance/bankAccountTransactionSlice';

function AddBankAccounTransaction() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [data, setData] = useState({companyId: activeCompany ? activeCompany.companyId : null, transaction_date: dayjs().startOf('day').format('YYYY-MM-DD HH:mm'), debit: "+"});
    const [date, setDate] = useState(dayjs().startOf('day').format('YYYY-MM-DD HH:mm'));

    useEffect(() => {
        dispatch(setIsProgress(true));
        dispatch(setIsProgress(false));
    }, [dispatch])
    

    const handleChangeTabValue = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    const handleSubmit = async () => {
        setDisabled(true);
        await dispatch(addBankAccountTransaction({data})).unwrap();
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

    const handleDateChange = (newValue) => {
        const date = newValue ? dayjs(newValue).format('YYYY-MM-DD HH:mm') : null;
        setDate(date);
    }

    const today = dayjs();

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`YENİ BANKA HAREKETİ (GELEN PARA)`}
                loadingAdd={disabled}
                disabledAdd={buttonDisabled}
                onClickAdd={() => handleSubmit()}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>    
                        <Grid size={{xs:12,sm:12}}>
                            <BankAccountSelect
                            label="Banka Hesabı"
                            emptyValue={true}
                            value={data.bank_account}
                            onChange={(value) => handleChangeField("bank_account",value ? value.uuid : null)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:3}}>
                            <DateTimePicker
                            label="İşlem Tarihi"
                            defaultValue={dayjs().startOf('day')}
                            format='DD.MM.YYYY HH:mm'
                            onAccept={(newValue) => handleChangeField("transaction_date", newValue ? dayjs(newValue).format('YYYY-MM-DD HH:mm') : dayjs().startOf('day').format('YYYY-MM-DD HH:mm'))}
                            slotProps={{
                                textField: { size: 'small', fullWidth: true }
                            }}
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            size="small"
                            label={"Gönderen İsim"}
                            variant='outlined'
                            value={data.sender_account_name}
                            onChange={(e) => handleChangeField("sender_account_name",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            size="small"
                            label={"Gönderen TC/VKN"}
                            variant='outlined'
                            value={data.sender_vkn}
                            onChange={(e) => handleChangeField("sender_vkn",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:3}}>
                            <TextField
                            type='number'
                            size="small"
                            label={"Tutar"}
                            variant='outlined'
                            value={data.amount}
                            onChange={(e) => handleChangeField("amount",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:12}}>
                            <TextField
                            size="small"
                            label={"Açıklama"}
                            variant='outlined'
                            value={data.description}
                            onChange={(e) => handleChangeField("description",e.target.value)}
                            disabled={disabled}
                            fullWidth
                            multiline
                            rows={4}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default AddBankAccounTransaction
