import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstallmentsInLease } from 'store/slices/leasing/leaseSlice';
import BasicTable from 'component/table/BasicTable';
import { Typography } from '@mui/material';
import { fetchInstallmentInformation } from 'store/slices/leasing/installmentSlice';

function InstallmentsInLease(props) {
    const {lease_id,lease_code,companyName} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {installmentsLoading,installmentsInLease} = useSelector((store) => store.lease);
    const {installmentInformation} = useSelector((store) => store.installment);

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
        //dispatch(fetchInstallmentsInLease({activeCompany,lease_id}));
        console.log(lease_id)
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
        { field: 'vat', headerName: 'KDV(%)', flex: 1, type: 'number' },
        { field: 'amount', headerName: 'Taksit', flex: 1, type: 'number' },
        { field: 'principal', headerName: 'Ana Para', flex: 1, type: 'number' },
        { field: 'interest', headerName: 'Kâr Payı', flex: 1, type: 'number' },
        { field: 'paid', headerName: 'Toplam Ödeme', flex: 1, type: 'number' },
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex: 1, type: 'number' },
        { field: 'currency', headerName: 'Para Birimi', flex: 1,  type: 'number' },
        { field: 'payment_date', headerName: 'Ödeme Tarihi', flex: 1,  type: 'number' },
        // { field: 'overdue_days', headerName: 'Gecikme Süresi', flex: 1,  type: 'number', renderCell: (params) => (
        //         params.row.overdue_amount > 0
        //         ?
        //             params.value >= 0
        //             ?
        //                 `${params.value} gün`
        //             :
        //                 null
        //         :
        //             null
                
        //     )
        // },
    ]

    return (
         <>
            <BasicTable
            title="Kira Planı"
            rows={installmentInformation}
            columns={userColumns}
            getRowId={(row) => row.id}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            loading={installmentsLoading}
            //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            />
        </>
    )
}

export default InstallmentsInLease
