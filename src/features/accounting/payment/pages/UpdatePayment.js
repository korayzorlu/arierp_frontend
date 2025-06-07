import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCurrencies } from '../../../../store/slices/dataSlice';
import { deletePayment, fetchPayment, updatePayment } from '../../../../store/slices/accounting/paymentSlice';
import { Divider, Paper, Stack, TextField } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { toUpper } from 'lodash';
import { setDialog } from '../../../../store/slices/notificationSlice';
import { Grid } from '@mui/material';
import PartnerSelect from '../../../../component/select/PartnerSelect';
import CurrencySelect from '../../../../component/select/CurrencySelect';
import Dialog from '../../../../component/feedback/Dialog';
import AutocompleteMUI from '../../../../component/select/AutocompleteMUI';

function UpdatePayment() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const { type,uuid } = useParams();

    const [data, setData] = useState({});
    const [transactions, setTransactions] = useState({});
   
    const fetchData = async () => {
        await dispatch(fetchCurrencies()).unwrap();
        const response = await dispatch(fetchPayment({activeCompany,params:{uuid}})).unwrap();
        setData(response);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updatePayment({data}))
    };

    const handleDelete = async () => {
        setButtonDisabled(true);

        dispatch(deletePayment({data}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    return (
        <Paper elevation={0} sx={{p:2}} square>
            <Stack spacing={2}>
                <FormHeader
                title={`${toUpper(type)} PAYMENT DETAILS`}
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                onClickDelete={() => dispatch(setDialog(true))}
                />
                <Divider></Divider>
                <Stack spacing={2}>
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,sm:8}}>
                            <PartnerSelect
                            label="Partner"
                            emptyValue={true}
                            value={data.partner || 0}
                            types={type === "incoming" ? `{customer}` : `{supplier}`}
                            onChange={(value) => handleChangeField("partner",{uuid:value.uuid,name:value.name})}
                            />
                        </Grid>
                        <Grid size={{xs:12,sm:4}}>
                            <TextField
                            type="text"
                            size="small"
                            label={"Payment No"}
                            variant='outlined'
                            value={data.payment_no}
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
                            value={data.currency || ""}
                            onChange={(value) => handleChangeField("currency",value)}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
            <Dialog
            title="Delete payment"
            onClickText="Delete"
            onClickColor="error"
            dismissText="Cancel"
            onClick={handleDelete}
            >
                Are you sure you want to delete this payment? You cant't undo this action.
            </Dialog>
        </Paper>
    )
}

export default UpdatePayment
