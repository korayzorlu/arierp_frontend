import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setInstallmentDialog } from '../../store/slices/notificationSlice';

function AddLeaseDialog() {
    const {lease_id} = props;

    const {userInformation} = useSelector((store) => store.auth);
    const {installmentDialog} = useSelector((store) => store.notification);
    const {installmentInformation,installmentsLoading} = useSelector((store) => store.installment);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(setInstallmentDialog(false))
    };

    return (
        <div>
        
        </div>
    )
}

export default AddLeaseDialog
