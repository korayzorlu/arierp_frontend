import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayableAccounts, fetchReceivableAccounts, setPayableAccountsParams, setReceivableAccountsLoading } from '../../../../store/slices/accounting/accountSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../../store/slices/notificationSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../../store/slices/processSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Paper, Stack } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';

function Payable() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {payableAccounts,payableAccountsCount,payableAccountsParams,payableAccountsLoading} = useSelector((store) => store.account);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchPayableAccounts({activeCompany,params:payableAccountsParams}))
    }, [activeCompany,payableAccountsParams,dispatch]);

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/partners/delete_all_partners/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const columns = [
        { field: 'partner', headerName: 'Partner', flex: 15, editable: true, renderCell: (params) => (
                <Link
                to={`/accounts/update/${params.row.type}/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.row.partner.name}
                </Link>
                
            )
        },
        { field: 'type', headerName: 'Type', flex: 2 },
        { field: 'balance', headerName: 'Balance', flex: 2, type: 'number' },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    return (
        <Stack spacing={0}>
            <ListTableServer
            title="Accounts Payable"
            rows={payableAccounts}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={payableAccountsLoading}
            customButtons={
                <>
                    <CustomTableButton title="New" link="/accounts/add-account/payable" icon={<AddBoxIcon fontSize="small"/>}/>
                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon fontSize="small"/>}
                    disabled={payableAccounts.length > 0 ? false : true}
                    />
                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchPayableAccounts({activeCompany,params:payableAccountsParams}))}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={payableAccountsCount}
            setParams={(value) => {dispatch(setPayableAccountsParams(value));console.log(value)}}
            checkboxSelection
            backButton
            ></ListTableServer>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/accounting/delete_account/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setReceivableAccountsLoading(true))}
            finalEvent={() => {dispatch(fetchReceivableAccounts({activeCompany}));dispatch(setReceivableAccountsLoading(false));}}
            />
        </Stack>
        
    )
}

export default Payable
