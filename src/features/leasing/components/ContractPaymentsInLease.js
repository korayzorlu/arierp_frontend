import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BasicTable from '../../../component/table/BasicTable';
import { fetchContractPaymentsInLease } from '../../../store/slices/contracts/contractSlice';

function ContractPaymentsInLease(props) {
    const {contract_id,companyName} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractPaymentsLoading,contractPaymentsInLease} = useSelector((store) => store.contract);

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
        dispatch(fetchContractPaymentsInLease({activeCompany,contract_id}));
    }, [])

    const handleClick = (event,params) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserEmail(params.row.email);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const userColumns = [
        { field: 'contract', headerName: 'Sözleşme No' },
        { field: 'trn_from_id', headerName: 'Nereden' },
        { field: 'type', headerName: 'Nereye' },
        { field: 'posting_type', headerName: 'İşlem Tipi', width: 150 },
        { field: 'group_name', headerName: 'İşlem Grubu' },
        { field: 'account_code', headerName: 'Hesap Kart Kodu' },
        { field: 'account_name', headerName: 'Cari Kart Adı', width: 250 },
        { field: 'date', headerName: 'İşlem Tarihi' },
        { field: 'debit_amount', headerName: 'Borç', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'credit_amount', headerName: 'Alacak', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'local_debit_amount', headerName: 'Yerel Borç', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'local_credit_amount', headerName: 'Yerel Alacak', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'exchange_rate', headerName: 'Kur(Yerel)', type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'description', headerName: 'Açıklama', width: 400 },
        { field: 'user_name', headerName: 'Oluşturan' },
    ]

    return (
        <>
            <BasicTable
            title="Tahsilatlar"
            rows={contractPaymentsInLease}
            columns={userColumns}
            getRowId={(row) => row.id}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            loading={contractPaymentsLoading}
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

export default ContractPaymentsInLease
