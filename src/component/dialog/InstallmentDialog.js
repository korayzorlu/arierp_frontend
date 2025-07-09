import React from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setInstallmentDialog } from '../../store/slices/notificationSlice';
import Row from '../grid/Row';
import Col from '../grid/Col';
import MessageIcon from '@mui/icons-material/Message';
import { amber } from '@mui/material/colors';
import InstallmentsInLease from '../../features/leasing/components/InstallmentsInLease';
import BasicTable from '../table/BasicTable';

function InstallmentDialog(props) {
    const {lease_id} = props;

    const {userInformation} = useSelector((store) => store.auth);
    const {installmentDialog} = useSelector((store) => store.notification);
    const {installmentInformation,installmentsLoading} = useSelector((store) => store.installment);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setInstallmentDialog(false))
    };

    const userColumns = [
        { field: 'sequency', headerName: 'Sıra No', flex: 1, type: 'number' },
        { field: 'vat', headerName: 'KDV(%)', flex: 1, type: 'number' },
        { field: 'amount', headerName: 'Taksit', flex: 1, type: 'number' },
        { field: 'principal', headerName: 'Ana Para', flex: 1, type: 'number' },
        { field: 'interest', headerName: 'Kâr Payı', flex: 1, type: 'number' },
        { field: 'paid', headerName: 'Toplam Ödeme', flex: 1, type: 'number' },
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex: 1, type: 'number', cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            },valueFormatter: (value) => {
                if (value == null) {
                        return '';
                }
                return value.toLocaleString('tr-TR', {minimumFractionDigits: 2});
            },
        },
        { field: 'currency', headerName: 'Para Birimi', flex: 1,  type: 'number' },
        { field: 'payment_date', headerName: 'Ödeme Tarihi', flex: 1,  type: 'number' },
        { field: 'overdue_days', headerName: 'Gecikme Süresi', flex: 1,  type: 'number', renderCell: (params) => (
                params.row.overdue_amount > 0
                ?
                    params.value >= 0
                    ?
                        `${params.value} gün`
                    :
                        null
                :
                    null
                
            )
        },
    ]

    return (
        <MUIDialog
        open={installmentDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        elevation={3}
        variant="outlined"
        maxWidth="lg"
        fullWidth
        >
            
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Stack spacing={2}>
                        <>
                            <BasicTable
                            title={`Kira Planı - ${installmentInformation ? installmentInformation.length > 0 ? installmentInformation[0]["lease"] : "" : ""}`}
                            rows={installmentInformation}
                            columns={userColumns}
                            getRowId={(row) => row.id}
                            checkboxSelection={false}
                            disableRowSelectionOnClick={true}
                            loading={installmentsLoading}
                            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
                            />
                        </>
                    </Stack>
                </DialogContentText>
            </DialogContent>
            <DialogActions className=''>
                <Button color="neutral" onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </MUIDialog>
    )
}

export default InstallmentDialog
