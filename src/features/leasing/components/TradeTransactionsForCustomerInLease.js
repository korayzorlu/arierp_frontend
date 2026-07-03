import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BasicTable from 'component/table/BasicTable';
import { fetchTradeTransactionsForCustomerInLease } from 'store/slices/trade/tradeTransactionSlice';
import { Chip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

function TradeTransactionsForCustomerInLease(props) {
    const {lease_uuid,companyName} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {tradeTransactionsLoading,tradeTransactionsForCustomerInLease,tradeTransactionsForCustomerInLeaseParams} = useSelector((store) => store.tradeTransaction);

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
        dispatch(fetchTradeTransactionsForCustomerInLease({activeCompany,lease_uuid}));
    }, [])

    const rowsWithBalance = [];
    let newIndex = 0;
    tradeTransactionsForCustomerInLease.map((row, index) => {
        const prevRow = newIndex > 0 ? rowsWithBalance[newIndex - 1] : null;
        if((prevRow && prevRow.posting_group_name !== row.posting_group_name && !prevRow.is_total)){
            rowsWithBalance.push({
                is_total: true,
                uuid: row.uuid + newIndex,
                due_date: null,
                record_date: null,
                posting_group_name: prevRow.posting_group_name + ' Bakiyesi',
                document_no: null,
                description: prevRow.posting_group_name + ' Bakiyesi',
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
        if(index + 1 === tradeTransactionsForCustomerInLease.length){
            rowsWithBalance.push({
                is_total: true,
                uuid: row.uuid + newIndex,
                due_date: null,
                record_date: null,
                posting_group_name: row.posting_group_name + ' Bakiyesi',
                document_no: null,
                description: row.posting_group_name + ' Bakiyesi',
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
        { field: 'date', headerName: 'Tarih', type:'number', width: 100, sortable: false },
        { field: 'description', headerName: 'Açıklama', type:'string', width: 600, sortable: false,
            cellClassName: (params) => {return params.row.amount_type === '1' ? 'negative-cell' : '';},
            rowSpanValueGetter: () => null,
         },
        { field: 'amount', headerName: 'Tutar', width: 160, type: 'number', sortable: false, renderHeaderFilter: () => null,
            cellClassName: (params) => {return params.row.amount_type === '1' ? 'negative-cell' : 'positive-cell';},
            renderCell: (params) =>
                !params.row.is_total
                ?
                    params.row.amount_type === '1'
                    ?
                        new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)
                    :
                        `-${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.amount)}`
                :
                    null,
            rowSpanValueGetter: () => null,
        },
        { field: 'currency', headerName: 'PB', type:'string', width: 80, sortable: false, rowSpanValueGetter: () => null, },
        { field: 'balances', headerName: 'Bakiye', width: 160, type: 'number', sortable: false, renderHeaderFilter: () => null,
            cellClassName: (params) => {return params.row.balances.balance <= 0 ? 'positive-cell' : 'negative-cell';},
            renderCell: (params) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance),
            // renderCell: (params) => {
            //     const rowIndex = rowsWithBalance.findIndex((r) => r.uuid === params.row.uuid);
            //     const nextRow = rowsWithBalance[rowIndex + 1];
            //     if(nextRow && nextRow.date === params.row.date){
            //         return '';
            //     }
            //     return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance);
            // },
            rowSpanValueGetter: () => null,
        },
        // { field: 'balances', headerName: 'Bakiye', width: 160, type: 'number', sortable: false, renderHeaderFilter: () => null,
        //     cellClassName: (params) => {return params.row.balances.balance <= 0 ? 'positive-cell' : 'negative-cell';},
        //     renderCell: (params) =>
        //         params.row.balances.balance < 0
        //         ?
        //             `+${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance*-1)}`
        //         :
        //             new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.row.balances.balance)
        // },
        { field: 'overdue_days', headerName: 'Gecikme', type:'number', width: 120, sortable: false, rowSpanValueGetter: () => null,
            renderCell: (params) => 
                params.row.transaction_type === "installment"
                ?
                    params.value === 0
                    ?
                        'Gecikme yok'
                    :
                        params.value + ' gün'
                :
                    null
        },
        { field: 'applied_status', headerName: 'Durum', type:'string', width: 180, sortable: false, rowSpanValueGetter: () => null,
            renderCell: (params) => 
                params.row.transaction_type === "installment"
                ?
                    params.value === 'Ödendi'
                    ?
                        params.row.overdue_days === 0
                        ?
                            <Chip variant='contained' color="success" icon={<CheckCircleIcon />} label="Zamanında Ödendi" size='small'/>
                        :
                            <Chip variant='contained' color="mars" icon={<WarningIcon />} label="Gecikmeli Ödendi" size='small'/>
                    :
                        <Chip variant='contained' color="error" icon={<ErrorIcon />} label="Ödenmedi" size='small'/>
                :
                    null
        },

    ]

    return (
        <>
            <BasicTable
            rows={rowsWithBalance}
            columns={userColumns}
            getRowId={(row) => row.uuid}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            loading={tradeTransactionsLoading}
            getRowClassName={(params) => `super-app-theme--${params.row.is_total ? "today" : ""}`}
            noPagination
            rowSpanning={true}
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

export default TradeTransactionsForCustomerInLease
