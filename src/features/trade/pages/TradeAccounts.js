import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTradeAccounts, resetTradeAccountsParams, setTradeAccountsLoading, setTradeAccountsParams } from '../../../store/slices/trade/tradeAccountSlice';
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

function TradeAccounts() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {tradeAccounts,tradeAccountsCount,tradeAccountsParams,tradeAccountsLoading} = useSelector((store) => store.tradeAccount);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTradeAccounts({activeCompany,params:tradeAccountsParams}));
        });
    }, [activeCompany,tradeAccountsParams,dispatch]);

    const columns = [
        { field: 'account_id', headerName: 'Kart No', flex: 1 },
        { field: 'crm_id', headerName: 'CRM No', flex: 1 },
        { field: 'name', headerName: 'İsim', flex: 4 },
        { field: 'crm_type', headerName: 'CRM Kart Tipi', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/trade/delete_all_trade_accouns/`,
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
            rows={tradeAccounts}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={tradeAccountsLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/trade/add-tradeAccoun"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={tradeAccounts.length > 0 ? false : true}
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
                    onClick={() => dispatch(fetchTradeAccounts({activeCompany,params:tradeAccountsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={tradeAccountsCount}
            checkboxSelection
            setParams={(value) => dispatch(setTradeAccountsParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/trade/trade_accouns_template"
            importURL="/trade/import_trade_accouns/"
            startEvent={() => dispatch(setTradeAccountsLoading(true))}
            finalEvent={() => {dispatch(fetchTradeAccounts({activeCompany}));dispatch(setTradeAccountsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/trade/delete_trade_accouns/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setTradeAccountsLoading(true))}
            finalEvent={() => {dispatch(fetchTradeAccounts({activeCompany}));dispatch(setTradeAccountsLoading(false));}}
            />
        </PanelContent>
    )
}

export default TradeAccounts
