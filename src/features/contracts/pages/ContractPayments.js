import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractPayments, setContractPaymentsLoading, setContractPaymentsParams } from '../../../store/slices/contracts/contractSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import { useGridApiRef } from '@mui/x-data-grid';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';
import ExportDialog from '../../../component/feedback/ExportDialog';

function ContractPayments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractPayments,contractPaymentsCount,contractPaymentsParams,contractPaymentsLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [exportURL, setExportURL] = useState("")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractPayments({activeCompany,params:contractPaymentsParams}));
        });
    }, [activeCompany,contractPaymentsParams,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme No' },
        { field: 'project', headerName: 'Proje' },
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

    // Bugünün tarihini dayjs ile al
    const today = dayjs();
    const thirtyDaysAgo = dayjs().subtract(30, 'day');

    const handleDateRangeChange = (newValue) => {
        console.log(newValue[0].date)
        console.log(newValue[1].date)
    }

    return (
        <PanelContent>
            <ListTableServer
            title="Tahsilat Listesi"
            autoHeight
            rows={contractPayments}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={contractPaymentsLoading}
            noDownloadButton
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL("/contracts/export_contract_payments/")}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchContractPayments({activeCompany,params:contractPaymentsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            customFiltersLeft={
                <>
                    <DateRangePicker
                    defaultValue={[thirtyDaysAgo, today]}
                    onAccept={(newValue) => handleDateRangeChange(newValue)}
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
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setContractPaymentsLoading(true))}
            finalEvent={() => {dispatch(fetchContractPayments({activeCompany,params:contractPaymentsParams}));dispatch(setContractPaymentsLoading(false));}}
            />
        </PanelContent>
    )
}

export default ContractPayments
