import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractPayments, setContractPaymentsParams } from '../../../store/slices/contracts/contractSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import { useGridApiRef } from '@mui/x-data-grid';

function ContractPayments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractPayments,contractPaymentsCount,contractPaymentsParams,contractPaymentsLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractPayments({activeCompany,params:contractPaymentsParams}));
        });
    }, [activeCompany,contractPaymentsParams,dispatch]);

    const columns = [
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
        <PanelContent>
            <ListTableServer
            title="Tahsilat Listesi"
            rows={contractPayments}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={contractPaymentsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchContractPayments({activeCompany,params:contractPaymentsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={contractPaymentsCount}
            setParams={(value) => dispatch(setContractPaymentsParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default ContractPayments
