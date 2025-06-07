import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, fetchPayableAccounts, fetchReceivableAccounts, fetchSalesAccounts, setAccountsLoading, setAccountsParams, setPayableAccountsParams, setReceivableAccountsLoading } from '../../../../store/slices/accounting/accountSlice';
import { setAlert, setDeleteDialog } from '../../../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Paper, Stack } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';
import { capitalize } from 'lodash';

function Sales() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {salesAccounts,salesAccountsCount,accountsParams,accountsLoading} = useSelector((store) => store.account);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const response = await dispatch(fetchAccounts({activeCompany,type:"sales",params:accountsParams})).unwrap();
        setData(response);
    }

    useEffect(() => {
        fetchData();
    }, [activeCompany,accountsParams]);

    const columns = [
        { field: 'type', headerName: 'Account', flex: 15, editable: true, renderCell: (params) => (
                <Link
                to={`/accounts/update/${params.row.type}/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {capitalize(params.value)} Income - {params.row.currency}
                </Link>
                
            )
        },
        { field: 'balance', headerName: 'Balance', flex: 2, type: 'number' },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    return (
        <Stack spacing={0}>
            <ListTableServer
            title="Sales Income Accounts"
            rows={data}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={accountsLoading}
            customButtons={
                <>
                    <CustomTableButton title="New" link="/accounts/add-account/sales" icon={<AddBoxIcon fontSize="small"/>}/>
                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon fontSize="small"/>}
                    disabled={data.length > 0 ? false : true}
                    />
                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchAccounts({activeCompany,type:"sales",params:accountsParams}))}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={data.length}
            setParams={(value) => dispatch(setAccountsParams(value))}
            checkboxSelection
            backButton
            ></ListTableServer>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/accounting/delete_account/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setAccountsLoading(true))}
            finalEvent={() => {dispatch(fetchAccounts({activeCompany,type:"sales"}));dispatch(setAccountsLoading(false));}}
            />
        </Stack>
    )
}

export default Sales
