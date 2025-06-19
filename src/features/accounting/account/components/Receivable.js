import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayableAccounts, fetchReceivableAccounts, setReceivableAccountsLoading, setReceivableAccountsParams } from '../../../../store/slices/accounting/accountSlice';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../../store/slices/notificationSlice';
import { fetchImportProcess } from '../../../../store/slices/processSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setPartnersParams } from '../../../../store/slices/partners/partnerSlice';
import ImportDialog from '../../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import FormHeader from '../../../../component/header/FormHeader';

function Receivable() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {receivableAccounts,receivableAccountsCount,receivableAccountsParams,receivableAccountsLoading} = useSelector((store) => store.account);

    const dispatch = useDispatch();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchReceivableAccounts({activeCompany,params:receivableAccountsParams}))
    }, [activeCompany,receivableAccountsParams,dispatch]);

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
        // { field: 'accounts', headerName: 'Accounts', flex: 8, editable: true, renderCell: (params) => (
        //     <TableContainer>
        //         <Table>
        //         <TableHead sx={{backgroundColor:'#111'}}>
        //             <TableRow>
        //             <TableCell align="right">Currency</TableCell>
        //             <TableCell align="right">Balance</TableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody>
        //             {params.value.map((row) => (
        //                 <TableRow key={row.uuid}>
        //                     <TableCell align="right">{row.currency}</TableCell>
        //                     <TableCell align="right">{row.balance}</TableCell>
        //                 </TableRow>
        //             ))}
        //         </TableBody>
        //         </Table>
        //     </TableContainer>
                
        //     )
        // },
        { field: 'balance', headerName: 'Balance', flex: 2, type: 'number' },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    return (
            <Stack spacing={0}>
                <ListTableServer
                title="Accounts Receivable"
                rows={receivableAccounts}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={receivableAccountsLoading}
                customButtons={
                    <>
                        <CustomTableButton title="Yeni" link="/accounts/add-account/receivable" icon={<AddBoxIcon fontSize="small"/>}/>
                        <CustomTableButton
                        title="Sil"
                        onClick={() => dispatch(setDeleteDialog(true))}
                        icon={<DeleteIcon fontSize="small"/>}
                        disabled={receivableAccounts.length > 0 ? false : true}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchReceivableAccounts({activeCompany,params:receivableAccountsParams}))}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={receivableAccountsCount}
                setParams={(value) => {dispatch(setReceivableAccountsParams(value));console.log(value)}}
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

export default Receivable
