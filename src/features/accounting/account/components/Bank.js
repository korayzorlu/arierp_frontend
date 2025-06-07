import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, fetchBankAccounts, setAccountsLoading, setAccountsParams } from '../../../../store/slices/accounting/accountSlice';
import { Link, useNavigate } from 'react-router-dom';
import { capitalize } from 'lodash';
import { IconButton, Paper, Stack } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import { setDeleteDialog } from '../../../../store/slices/notificationSlice';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function Bank() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {salesAccounts,salesAccountsCount,accountsParams,accountsLoading} = useSelector((store) => store.account);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const response = await dispatch(fetchAccounts({activeCompany,type:"bank",params:accountsParams})).unwrap();
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
                    {capitalize(params.value)} - {params.row.currency}
                </Link>
                
            )
        },
        { field: 'balance', headerName: 'Balance', flex: 2, type: 'number' },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    return (
        <Stack spacing={0}>
            {/* <Paper elevation={0} sx={{p:2}} square>
                <FormHeader
                title={`BANK ACCOUNTS`}
                />
            </Paper> */}
            <ListTableServer
            title="Bank Accounts"
            rows={data}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={accountsLoading}
            customButtons={
                <>
                    <CustomTableButton title="New" link="/accounts/add-account/bank" icon={<AddBoxIcon fontSize="small"/>}/>
                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon fontSize="small"/>}
                    disabled={data.length > 0 ? false : true}
                    />
                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchAccounts({activeCompany,type:"bank",params:accountsParams}))}
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
            finalEvent={() => {dispatch(fetchAccounts({activeCompany,type:"bank"}));dispatch(setAccountsLoading(false));}}
            />
        </Stack>
    )
}

export default Bank
