import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setWarningNoticeDialog, setMessageDialog } from 'store/slices/notificationSlice';
import MUIDialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from '@mui/material';
import BasicTable from 'component/table/BasicTable';
import { fetchWarningNoticeInformation, fetchWarningNoticeInLease } from 'store/slices/contracts/contractSlice';

function WarningNoticeDialog(props) {
    const {user,contract} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {warningNoticeDialog} = useSelector((store) => store.notification);
    const {warningNoticesLoading,warningNoticesInLease,warningNoticesInLeaseCode,warningNoticeInformation} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setWarningNoticeDialog(false))
    };

    const columns = [
        { field: 'partner_name', headerName: 'Müşteri', flex: 4 },
        { field: 'contract_code', headerName: 'Sözleşme No', flex: 1 },
        { field: 'process_start_date', headerName: 'İhtar Tarihi', flex: 2 },
        { field: 'service_date', headerName: 'Tebliğ Tarihi', flex: 2 },
        { field: 'official_cancellation_date', headerName: 'Öngörülen Fesih Tarihi', flex: 2 },
        { field: 'termination_days', headerName: 'Fesihe Kalan Gün Sayısı', flex: 1 },
        { field: 'debit_amount', headerName: 'İhtar Borcu', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'paid', headerName: 'Ödenen Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'diff', headerName: 'Kalan Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'state', headerName: 'Durum', flex: 1 },
    ]

    return (
        <MUIDialog
        open={warningNoticeDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="md"
        fullWidth
        >
            
            <DialogTitle id="alert-dialog-title">
                İhtar Detayı
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <TextField
                        type="text"
                        size="small"
                        label={"Müşteri İsmi"}
                        variant='standard'
                        value={warningNoticeInformation.partner}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Sözleşme No"}
                        variant='standard'
                        value={warningNoticeInformation.contract}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"İhtar Tarihi"}
                        variant='standard'
                        value={warningNoticeInformation.process_start_date}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Tebliğ Tarihi"}
                        variant='standard'
                        value={warningNoticeInformation.service_date}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Öngörülen Fesih Tarihi"}
                        variant='standard'
                        value={warningNoticeInformation.official_cancellation_date}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Fesihe Kalan Gün Sayısı"}
                        variant='standard'
                        value={warningNoticeInformation.termination_days}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"İhtar Borcu"}
                        variant='standard'
                        value={`${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(warningNoticeInformation.debit_amount)} ${warningNoticeInformation.currency}`}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Ödenen Tutar"}
                        variant='standard'
                        value={`${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(warningNoticeInformation.paid)} ${warningNoticeInformation.currency}`}
                        disabled={false}
                        fullWidth
                        />
                        <TextField
                        type="text"
                        size="small"
                        label={"Kalan Tutar"}
                        variant='standard'
                        value={`${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(warningNoticeInformation.diff)} ${warningNoticeInformation.currency}`}
                        disabled={false}
                        fullWidth
                        />
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default WarningNoticeDialog
