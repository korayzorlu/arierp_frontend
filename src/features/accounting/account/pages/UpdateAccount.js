import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setIsProgress } from '../../../../store/slices/processSlice';
import { fetchCurrencies } from '../../../../store/slices/dataSlice';
import axios from 'axios';
import { setAlert, setDialog } from '../../../../store/slices/notificationSlice';
import { Box, Card, Divider, Paper, Stack, Typography } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import { capitalize, toUpper } from 'lodash';
import { Grid } from '@mui/material';
import PartnerSelect from '../../../../component/select/PartnerSelect';
import CurrencySelect from '../../../../component/select/CurrencySelect';
import Dialog from '../../../../component/feedback/Dialog';
import { deleteAccount, fetchAccount, updateAccount } from '../../../../store/slices/accounting/accountSlice';
import ListTableServer from '../../../../component/table/ListTableServer';
import { fetchTransactions } from '../../../../store/slices/accounting/transactionSlice';

function UpdateAccount() {
    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany,disabled} = useSelector((store) => store.organization);
    const {transactionsParams} = useSelector((store) => store.transaction);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const { type,uuid } = useParams();

    const [data, setData] = useState({});
    const [transactions, setTransactions] = useState({});
   
    const fetchData = async () => {
        await dispatch(fetchCurrencies()).unwrap();
        const response = await dispatch(fetchAccount({activeCompany,params:{uuid}})).unwrap();
        setData(response);
        const responseTransactions = await dispatch(fetchTransactions({activeCompany,params:{...transactionsParams, account:response.uuid,currency:response.currency}})).unwrap();
        setTransactions(responseTransactions);
    };
    
    useEffect(() => {
        fetchData();
    }, [activeCompany])

    const handleSubmit = async () => {
        setButtonDisabled(true);
        dispatch(updateAccount({data}))
    };

    const handleDelete = async () => {
        setButtonDisabled(true);

        dispatch(deleteAccount({data}));
    };

    const handleChangeField = (field,value) => {
        setData(data => ({...data, [field]:value}));
        setButtonDisabled(false);
    };

    const columns = [
        { field: 'date', headerName: 'Date', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 4 },
        { field: 'debit', headerName: 'Debit', type: 'number', flex: 1, renderCell: (params) => (
                
                    params.row.type === "debit"
                    ?
                    params.row.amount
                    :
                    <>-</>
            ),
        },
        { field: 'credit', headerName: 'Credit', type: 'number', flex: 1, renderCell: (params) => (
                
                params.row.type === "credit"
                ?
                params.row.amount
                :
                <>-</>
            ),
    },
    ]

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
                title={getTitle(data.type)}
                loadingSave={disabled}
                disabledSave={buttonDisabled}
                onClickSave={() => handleSubmit()}
                onClickDelete={() => dispatch(setDialog(true))}
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
                                    value={data.partner || null}
                                    types={type === "receivable" ? `{customer}` : `{supplier}`}
                                    onChange={(value) => handleChangeField("partner",value ? {uuid:value.uuid,name:value.name} : null)}
                                    />
                                :
                                    null
                            }
                            
                        </Grid>
                        <Grid size={{xs:12,sm:2}}>
                            <CurrencySelect
                            label="Currency"
                            emptyValue={true}
                            value={data.currency || ""}
                            onChange={(value) => handleChangeField("currency",value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid size={{xs:12,sm:12}} sx={{ display: 'flex',flexDirection:'column'}}>
                            <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Box sx={{ p: 2,backgroundColor: dark ? 'blackhole.main' : 'cream.main' }}>
                                    <Stack
                                    direction="row"
                                    sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                    <Typography gutterBottom variant="h5" component="div">
                                        TRANSACTIONS
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {data.balance} {data.currency}
                                    </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        This table lists all transactions related to the customer's receivable account, including invoices, payments, and outstanding balances.
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box>
                                    <ListTableServer
                                    rows={transactions}
                                    columns={columns}
                                    height="auto"
                                    getRowId={(row) => row.uuid}
                                    loading={false}
                                    checkboxSelection={false}
                                    rowCount={0}
                                    //setParams={(value) => {dispatch(setReceivableAccountsParams(value));console.log(value)}}
                                    noOverlay
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Stack>
            <Dialog
            title="Delete company"
            onClickText="Delete"
            onClickColor="error"
            dismissText="Cancel"
            onClick={handleDelete}
            >
                Are you sure you want to delete {data.name}? You cant't undo this action.
            </Dialog>
        </Paper>
    )
}

export default UpdateAccount
