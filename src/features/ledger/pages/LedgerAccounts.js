import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLedgerAccounts, resetLedgerAccountsParams, setLedgerAccountsLoading, setLedgerAccountsParams } from '../../../store/slices/ledger/ledgerAccountSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

function LedgerAccounts() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {ledgerAccounts,ledgerAccountsCount,ledgerAccountsParams,ledgerAccountsLoading} = useSelector((store) => store.ledgerAccount);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchLedgerAccounts({activeCompany,params:ledgerAccountsParams}));
        });
    }, [activeCompany,ledgerAccountsParams,dispatch]);

    const columns = [
        { field: 'code', headerName: 'Hesap Kodu', flex: 1 },
        { field: 'name', headerName: 'İsim', flex: 4 },
        { field: 'currency', headerName: 'Para Birimi', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/ledger/delete_all_ledger_accouns/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Cari Hesaplar Listesi"
            rows={ledgerAccounts}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={ledgerAccountsLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/ledger/add-ledgerAccoun"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={ledgerAccounts.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Tümünü Sil"
                    onClick={handleAllDelete}
                    disabled={user.email === "korayzorllu@gmail.com" ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchLedgerAccounts({activeCompany,params:ledgerAccountsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={ledgerAccountsCount}
            checkboxSelection
            setParams={(value) => dispatch(setLedgerAccountsParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/ledger/ledger_accouns_template"
            importURL="/ledger/import_ledger_accouns/"
            startEvent={() => dispatch(setLedgerAccountsLoading(true))}
            finalEvent={() => {dispatch(fetchLedgerAccounts({activeCompany}));dispatch(setLedgerAccountsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/ledger/delete_ledger_accouns/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setLedgerAccountsLoading(true))}
            finalEvent={() => {dispatch(fetchLedgerAccounts({activeCompany}));dispatch(setLedgerAccountsLoading(false));}}
            />
        </PanelContent>
    )
}

export default LedgerAccounts
