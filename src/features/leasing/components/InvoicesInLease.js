import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BasicTable from 'component/table/BasicTable';
import { Typography } from '@mui/material';
import { fetchInvoices, resetInvoicesParams } from 'store/slices/accounting/invoiceSlice';

function InvoicesInLease(props) {
    const {lease_uuid,companyName} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {invoicesLoading,invoices,invoicesParams} = useSelector((store) => store.invoice);

    const dispatch = useDispatch();
    const [isPending, startTransition] = useTransition();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorElUserStatus, setAnchorElUserStatus] = useState(null);
    const openUserStatus = Boolean(anchorElUserStatus);
    const [openUserStatusDialog, setOpenUserStatusDialog] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [selectedUserCompanyId, setSelectedUserCompanyId] = useState(null)

    useEffect(() => {
        dispatch(resetInvoicesParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchInvoices({activeCompany,params:{...invoicesParams,lease_uuid}}));
        });
    }, [activeCompany,invoicesParams,lease_uuid,dispatch]);

    const userColumns = [
        { field: 'date', headerName: 'Tarih', width: 150 },
        { field: 'invoice_no', headerName: 'Fatura No',width: 400 },
        { field: 'amount', headerName: 'Tutar', width: 240 , type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', width: 140 },
    ]

    return (
        <>
            <BasicTable
            title="Faturalar"
            rows={invoices}
            columns={userColumns}
            getRowId={(row) => row.uuid}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            loading={invoicesLoading}
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

export default InvoicesInLease
