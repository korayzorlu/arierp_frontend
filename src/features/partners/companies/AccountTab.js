import React, { useEffect, useState, useTransition } from 'react'
import { Grid } from '@mui/material';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import ListTableServer from '../../../component/table/ListTableServer';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../../store/slices/notificationSlice';
import { setPayableAccountsParams, setReceivableAccountsParams } from '../../../store/slices/accounting/accountSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AccountTab(props) {
    const {children,partnerUuid} = props;
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {receivableAccountsCount} = useSelector((store) => store.account);
    const {payableAccountsCount} = useSelector((store) => store.account);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [receivableAccounts, setReceivableAccounts] = useState([]);
    const [payableAccounts, setPayableAccounts] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=receivable&partner=${partnerUuid}`,
                {headers: {"X-Requested-With": "XMLHttpRequest"}}
            );
            
            setReceivableAccounts(response.data)
        } catch (error) {
            dispatch(setAlert({status:"error",text:error.response.data.message}));
        };

        try {
            const response = await axios.get(`/accounting/accounts/?active_company=${activeCompany.id}&type=payable&partner=${partnerUuid}`,
                {headers: {"X-Requested-With": "XMLHttpRequest"}}
            );
            
            setPayableAccounts(response.data)
        } catch (error) {
            dispatch(setAlert({status:"error",text:error.response.data.message}));
        };
    };
    
    useEffect(() => {
        startTransition(() => {
            fetchData();
        });
    }, [activeCompany])

    const receivableAccountsColumns = [
        { field: 'partner', headerName: 'Partner', flex: 6, editable: true, renderCell: (params) => (
                <Link
                to={`/accounts/update/receivable/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.row.partner.name}
                </Link>
                
            ),
        },
        { field: 'balance', headerName: 'Balance', type: 'number', flex: 2 },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    const payableAccountsColumns = [
        { field: 'partner', headerName: 'Partner', flex: 6, editable: true, renderCell: (params) => (
                <Link
                to={`/accounts/update/payable/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.row.partner.name}
                </Link>
                
            )
        },
        { field: 'balance', headerName: 'Balance', type: 'number', flex: 2 },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    return (
        <Grid container spacing={{xs:2,sm:12}} sx={{justifyContent: "space-between",}}>

            <Grid size={{xs:12,sm:6}} sx={{ display: 'flex',flexDirection:'column'}}>
                <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box sx={{ p: 2,backgroundColor: dark ? 'blackhole.main' : 'cream.main' }}>
                        <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                        >
                        <Typography gutterBottom variant="h5" component="div">
                            ACCOUNTS RECEIVABLE (AR)
                        </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            This table displays all outstanding receivables, representing amounts owed to the company by its customers.
                        </Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <ListTableServer
                        rows={receivableAccounts}
                        columns={receivableAccountsColumns}
                        height="auto"
                        getRowId={(row) => row.uuid}
                        loading={isPending}
                        checkboxSelection={false}
                        rowCount={receivableAccountsCount}
                        setParams={(value) => {dispatch(setReceivableAccountsParams(value));console.log(value)}}
                        noOverlay
                        />
                    </Box>
                </Card>
            </Grid>

            <Grid size={{xs:12,sm:6}} sx={{ display: 'flex',flexDirection:'column'}}>
                <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box sx={{ p: 2,backgroundColor: dark ? 'blackhole.main' : 'cream.main' }}>
                        <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                        >
                        <Typography gutterBottom variant="h5" component="div">
                            ACCOUNTS PAYABLE (AP)
                        </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            This table lists all outstanding payables, representing amounts the company owes to its suppliers or creditors.
                        </Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <ListTableServer
                        rows={payableAccounts}
                        columns={payableAccountsColumns}
                        height="auto"
                        getRowId={(row) => row.uuid}
                        loading={isPending}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setSelectedItems(newRowSelectionModel);
                        }}
                        rowCount={payableAccountsCount}
                        setParams={(value) => {dispatch(setPayableAccountsParams(value));console.log(value)}}
                        noOverlay
                        />
                    </Box>
                </Card>
            </Grid>

        </Grid>
    )
}

export default AccountTab
