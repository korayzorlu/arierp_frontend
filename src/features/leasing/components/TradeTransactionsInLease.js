import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BasicTable from 'component/table/BasicTable';
import { fetchTradeTransactionsInLease } from 'store/slices/trade/tradeTransactionSlice';
import { Typography } from '@mui/material';

function TradeTransactionsInLease(props) {
    const {lease_uuid,companyName} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {tradeTransactionsLoading,tradeTransactionsInLease} = useSelector((store) => store.tradeTransaction);

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorElUserStatus, setAnchorElUserStatus] = useState(null);
    const openUserStatus = Boolean(anchorElUserStatus);
    const [openUserStatusDialog, setOpenUserStatusDialog] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [selectedUserCompanyId, setSelectedUserCompanyId] = useState(null)

    useEffect(() => {
        dispatch(fetchTradeTransactionsInLease({activeCompany,lease_uuid}));
    }, [])

    const handleClick = (event,params) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserEmail(params.row.email);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // const rowsWithBalance = tradeTransactionsInLease.map((row, idx) => {
    //     console.log(tradeTransactionsInLease[idx - 1])
    //     let newRow = { ...row };
    //     const prevBalance = idx === 0 ? 0 : tradeTransactionsInLease[idx - 1].__balance;
    //     console.log(prevBalance)
    //     const amount = newRow.amount_type === '1' ? newRow.amount : -newRow.amount;
    //     newRow.__balance = prevBalance + amount
    //     return newRow;
    // });

    // const prevBalance = idx === 0 ? 0 : acc[idx - 1].__balance;
    //     const amount = row.amount_type === '1' ? row.amount : -row.amount;
    //     acc.push({
    //         ...row,
    //         __balance: prevBalance + amount
    //     });
    //     return acc;

    const handleBalance = (params) => {
        const idx = tradeTransactionsInLease.findIndex(row => row.uuid === params.row.uuid);
        const prevRow = idx > 0 ? tradeTransactionsInLease[idx - 1] : null;
        
        const prevBalance = prevRow ? prevRow.__balance : 0;
        const currentAmount = params.row.amount_type === '1' ? params.row.amount : -params.row.amount;
        return Number(currentAmount) + Number(prevBalance)
    }
    const rowsWithBalance = [];
    let newIndex = 0;
    tradeTransactionsInLease.map((row, index) => {
        const prevRow = newIndex > 0 ? rowsWithBalance[newIndex - 1] : null;
        if((prevRow && prevRow.posting_group_name !== row.posting_group_name && !prevRow.is_total)){
            rowsWithBalance.push({
                is_total: true,
                uuid: row.uuid + newIndex,
                due_date: null,
                record_date: null,
                posting_group_name: prevRow.posting_group_name + ' Toplamı',
                document_no: null,
                description: null,
                currency: null,
                amount: null,
                amount_type: null,
                balances: {balance: prevRow.balances.balance, tl_balance: prevRow.balances.tl_balance},
                exchange_rate: null,
                local_amount: null,
                _balances: null,
            })
            newIndex += 1;
        }
        newIndex += 1;
        rowsWithBalance.push({...row, is_total: false});
        if(index + 1 === tradeTransactionsInLease.length){
            rowsWithBalance.push({
                is_total: true,
                uuid: row.uuid + newIndex,
                due_date: null,
                record_date: null,
                posting_group_name: row.posting_group_name + ' Toplamı',
                document_no: null,
                description: null,
                currency: null,
                amount: null,
                amount_type: null,
                balances: {balance: row.balances.balance, tl_balance: row.balances.tl_balance},
                exchange_rate: null,
                local_amount: null,
                _balances: null,
            })
        }
    })


    

    const userColumns = [
        { field: 'due_date', headerName: 'Vade Tarihi', flex: 1, sortable: false },
        { field: 'record_date', headerName: 'Kayıt Tarihi', flex: 1.5, sortable: false },
        { field: 'posting_group_name', headerName: 'İşlem Grubu', flex: 1.5, sortable: false },
        { field: 'document_no', headerName: 'Belge No', flex: 1, sortable: false },
        { field: 'description', headerName: 'Açıklama', width: 400, sortable: false },
        { field: 'amount_type', headerName: 'İşlem Tİpi', flex: 1, sortable: false, renderCell : (params) =>
            !params.row.is_total
            ?
                params.value === '1'
                ?
                    'Borç'
                :
                    'Alacak'
            :
                null
        },
        { field: 'amount', headerName: 'Tutar', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
            !params.row.is_total
            ?
                params.row.amount_type === '1'
                ?
                    <Typography variant='body' sx={{color: 'error.main'}}>
                        {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)}
                    </Typography>
                :
                    <Typography variant='body' sx={{color: 'success.main'}}>
                        -{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)}
                    </Typography>
            :
                null
        },
        { field: 'balances', headerName: 'Bakiye', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
            params.row.balances.balance <= 0
            ?
                <Typography variant='body' sx={{color: 'success.main'}}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance)}
                </Typography>
            :
                <Typography variant='body' sx={{color: 'error.main'}}>
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance)}
                </Typography>
        },
        { field: 'currency', headerName: 'PB', flex: 1, sortable: false },
        // { field: 'exchange_rate', headerName: 'Kur', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, valueFormatter: (value) =>
        //     value
        //     ?
        //         new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        //     :
        //         null
        // },
        // { field: 'local_amount', headerName: 'TL Tutar', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
        //     !params.row.is_total
        //     ?
        //         params.row.amount_type === '1'
        //         ?
        //             new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.local_amount)
        //         :
        //             new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(-params.row.local_amount)
        //     :
        //         null
        // },
        // { field: '_balances', headerName: 'TL Bakiye', flex: 1, type: 'number', sortable: false, renderHeaderFilter: () => null, renderCell: (params) =>
        //     new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.tl_balance)
        // },
    ]

    return (
        <>
            <BasicTable
            title="Cari Hesap Ekstresi"
            rows={rowsWithBalance}
            columns={userColumns}
            getRowId={(row) => row.uuid}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            loading={tradeTransactionsLoading}
            getRowClassName={(params) => `super-app-theme--${params.row.is_total ? "today" : ""}`}
            // initialState={{
            //     aggregation: {
            //         model: {
            //             debit_amount: 'sum',
            //             credit_amount: 'sum',
            //             local_debit_amount: 'sum',
            //             local_credit_amount: 'sum',
            //         },
            //     },
            // }}
            />
        </>
    )
}

export default TradeTransactionsInLease
