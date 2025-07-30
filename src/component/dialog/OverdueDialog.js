import React, { useEffect } from 'react'
import MUIDialog from '@mui/material/Dialog';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setOverdueDialog } from '../../store/slices/notificationSlice';
import BasicTable from '../table/BasicTable';
import { fetchOverdueInformation } from '../../store/slices/leasing/leaseSlice';

function OverdueDialog(props) {
    const {children} = props;

    const {activeCompany} = useSelector((store) => store.organization);
    const {overdueDialog} = useSelector((store) => store.notification);
    const {leaseOverdues} = useSelector((store) => store.lease);

    const dispatch = useDispatch();



    const handleClose = () => {
        dispatch(setOverdueDialog(false))
    };

    const userColumns = [
        { field: 'overdue_0_30', headerName: '0 - 30', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_31_60', headerName: '31 - 60', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_61_90', headerName: '61 - 90', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_91_120', headerName: '91 - 120', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_121_150', headerName: '121 - 150', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_151_180', headerName: '151 - 180', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_181_gte', headerName: '181>', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
    ]

    return (
        <MUIDialog
        open={overdueDialog}
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
                            //title={`Kira Planı - ${overdueInformation ? overdueInformation.length > 0 ? overdueInformation[0]["lease"] : "" : ""}`}
                            title="Vadesi Geçmiş Borçlar"
                            rows={leaseOverdues}
                            columns={userColumns}
                            getRowId={(row) => row.id}
                            disableRowSelectionOnClick={true}
                            //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
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

export default OverdueDialog
