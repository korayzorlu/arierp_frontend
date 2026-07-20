import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstallmentsInLease } from 'store/slices/leasing/leaseSlice';
import BasicTable from 'component/table/BasicTable';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { fetchInstallmentInformation } from 'store/slices/leasing/installmentSlice';
import { useGridApiRef } from '@mui/x-data-grid-premium';

function InstallmentsInLease(props) {
    const {lease_id,lease_code,companyName} = props;

    const {user,dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {installmentsLoading,installmentsInLease} = useSelector((store) => store.lease);
    const {installmentInformation} = useSelector((store) => store.installment);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [anchorElUserStatus, setAnchorElUserStatus] = useState(null);
    const openUserStatus = Boolean(anchorElUserStatus);
    const [openUserStatusDialog, setOpenUserStatusDialog] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState(null);
    const [selectedUserCompanyId, setSelectedUserCompanyId] = useState(null)

    useEffect(() => {
        //dispatch(fetchInstallmentsInLease({activeCompany,lease_id}));
        dispatch(fetchInstallmentInformation({lease_id:lease_id}));
    }, [])

    const handleClick = (event,params) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserEmail(params.row.email);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const userColumns = [
        { field: 'sequency', headerName: 'Sıra No', flex: 1, type: 'number' },
        { field: 'payment_date', headerName: 'Ödeme Tarihi', flex: 1 },
        { field: 'payment', headerName: 'Ödeme', flex: 1, type: 'number',
            valueGetter: (value) => value ? parseFloat(value) : 0,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value),
        },
        { field: 'interest', headerName: 'Leasing Geliri', flex: 1, type: 'number',
            valueGetter: (value) => value ? parseFloat(value) : 0,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value),
        },
        { field: 'principal', headerName: 'Ana Para', flex: 1, type: 'number',
            valueGetter: (value) => value ? parseFloat(value) : 0,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value),
        },
        { field: 'vat', headerName: 'KDV(%)', flex: 1, type: 'number',
            aggregable: false,
            valueGetter: (value) => (value !== null && value !== undefined && value !== '') ? parseFloat(value) : null,
            valueFormatter: (value) => value !== null && value !== undefined ? new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value) : '',
        },
        { field: 'vat_amount', headerName: 'KDV Tutarı', flex: 1, type: 'number',
            valueGetter: (value) => value ? parseFloat(value) : 0,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value),
        },
        { field: 'amount', headerName: 'Toplam Ödeme', flex: 1, type: 'number',
            valueGetter: (value) => value ? parseFloat(value) : 0,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value),
        },
        // { field: 'transactions', headerName: 'Tahsilat Tarihi', flex: 1,
        //     renderCell: (params) => {
        //         if (!params.row?.transactions) return null;
        //         return (
        //             params.row.transactions.map((transaction) => {
        //                 const formattedAmount = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(transaction.amount);
        //                 const formattedAppliedAmount = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(transaction.applied_amount);
        //                 const formattedCurrency = transaction.currency ? transaction.currency === "TRY" ? "TL" : transaction.currency : params.row.currency;
        //                 return (
        //                     <Typography key={transaction.id} variant="body2" color="textSecondary">
        //                         {transaction.due_date}
        //                     </Typography>
        //                 );
        //             })
        //         );
        //     }
        // },
        // { field: 'tt', headerName: 'Tahsilat Tutarı', flex: 1,
        //     renderCell: (params) => {
        //         if (!params.row?.transactions) return null;
        //         return (
        //             params.row.transactions.map((transaction) => {
        //                 const formattedAmount = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(transaction.amount);
        //                 const formattedCurrency = transaction.currency ? transaction.currency === "TRY" ? "TL" : transaction.currency : params.row.currency;
        //                 return (
        //                     <Typography key={transaction.id} variant="body2" color="textSecondary">
        //                         {formattedAmount} {formattedCurrency}
        //                     </Typography>
        //                 );
        //             })
        //         );
        //     }
        // },
        // { field: 'ttt', headerName: 'Tahsilattan İşlenen Tutar', flex: 1,
        //     renderCell: (params) => {
        //         if (!params.row?.transactions) return null;
        //         return (
        //             params.row.transactions.map((transaction) => {
        //                 const formattedAppliedAmount = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(transaction.applied_amount);
        //                 const formattedCurrency = transaction.currency ? transaction.currency === "TRY" ? "TL" : transaction.currency : params.row.currency;
        //                 return (
        //                     <Typography key={transaction.id} variant="body2" color="textSecondary">
        //                         {formattedAppliedAmount} {formattedCurrency}
        //                     </Typography>
        //                 );
        //             })
        //         );
        //     }
        // },
        // { field: 'tttt', headerName: 'Tahsilattan Kalan Bakiye', flex: 1,
        //     renderCell: (params) => {
        //         if (!params.row?.transactions) return null;
        //         return (
        //             params.row.transactions.map((transaction) => {
        //                 const formattedRemainingAmount = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(transaction.remaining_amount);
        //                 const formattedCurrency = transaction.currency ? transaction.currency === "TRY" ? "TL" : transaction.currency : params.row.currency;
        //                 return (
        //                     <Typography key={transaction.id} variant="body2" color="textSecondary">
        //                         {formattedRemainingAmount} {formattedCurrency}
        //                     </Typography>
        //                 );
        //             })
        //         );
        //     }
        // },
        // { field: 'islenen_tutar', headerName: 'İşlenen Tutar', flex: 1, type: 'number',
        //     valueGetter: (value) => value ? parseFloat(value) : 0,
        //     renderCell: (params) => {
        //         const value = params.row.islenen_tutar;
        //         const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value);
        //         return `+ ${formattedValue}`;
        //     }
        // },
        // { field: 'bakiye', headerName: 'Bakiye', flex: 1, type: 'number',
        //     valueGetter: (value) => value ? parseFloat(value) : 0,
        //     renderCell: (params) => {
        //         const value = params.row.bakiye;
        //         const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value);
        //         return `+ ${formattedValue}`;
        //     }
        // },
        { field: 'currency', headerName: 'Para Birimi', flex: 1,  type: 'number' },
        { field: 'type_display', headerName: 'Ödeme Tipi', flex: 1 },
    ]

    return (
         <>
            <Stack spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <Paper elevation={0} sx={{p:2,height:'100%'}} square>
                        <BasicTable
                        rows={installmentInformation}
                        columns={userColumns}
                        getRowId={(row) => row.id}
                        checkboxSelection={false}
                        disableRowSelectionOnClick={true}
                        loading={installmentsLoading}
                        getRowClassName={(params) => params.row.type !== '1' ? `table-row-${dark ? "cream" : "celticglow"}` : ''}
                        apiRef={apiRef}
                        initialState={{
                            aggregation: {
                                model: {
                                    amount: 'sum',
                                    payment: 'sum',
                                    vat_amount: 'sum',
                                },
                            },
                        }}
                        />
                    </Paper>
                </Grid>
            </Stack>
        </>
    )
}

export default InstallmentsInLease
