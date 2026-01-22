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
import { set } from 'lodash';

function ContractPayments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractPayments,contractPaymentsCount,contractPaymentsParams,contractPaymentsLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [exportURL, setExportURL] = useState("")
    const [filterDate, setFilterDate] = useState({
        start: dayjs().startOf('year').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD')
    });

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractPayments({activeCompany,params:{...contractPaymentsParams, startDate: filterDate.start, endDate: filterDate.end}}));
        });
    }, [activeCompany,contractPaymentsParams,filterDate,dispatch]);

    /*
    WHEN 3 THEN 'Banka Otomasyonu'
        WHEN 31 THEN 'ATS Banka Oto.'
        WHEN 32 THEN 'BTS Banka Oto.'
        WHEN 33 THEN 'ZİNCİRLİKUYU Banka Oto.'
        WHEN 2 THEN 'Aktarım Datası'
        WHEN 80 THEN 'Otomatik Tahsilat'
        WHEN 60 THEN 'EFT'
        WHEN 90 THEN 'Satıcı Avansı Tahsilatı'
        ELSE CASE TrnIsPlanned
            WHEN 1 THEN 'Planlanmış'
            ELSE CASE TrnReturnValueId
                WHEN 0 THEN 'Elle Girilmiş'
                ELSE 'Modülden Gelmiş'
            END
        END
    */

    const getSourceType = (code) => {
        switch(code) {
            case '3': return 'Banka Otomasyonu';
            case '31': return 'ATS Banka Oto.';
            case '32': return 'BTS Banka Oto.';
            case '33': return 'ZİNCİRLİKUYU Banka Oto.';
            case '2': return 'Aktarım Datası';
            case '80': return 'Otomatik Tahsilat';
            case '60': return 'EFT';
            case '90': return 'Satıcı Avansı Tahsilatı';
            default: return 'Diğer';
        }
    }

    const columns = [
        { field: 'contract', headerName: 'Sözleşme No' },
        { field: 'project', headerName: 'Proje' },
        { field: 'trn_from_id', headerName: 'Nereden' },
        { field: 'type', headerName: 'Nereye' },
        { field: 'posting_type', headerName: 'İşlem Tipi', width: 150 },
        { field: 'group_name', headerName: 'İşlem Grubu' },
        { field: 'account_code', headerName: 'Hesap Kart Kodu' },
        { field: 'account_name', headerName: 'Cari Kart Adı', width: 250 },
        { field: 'source_type', headerName: 'Tahsilat Tipi', width: 120,
            renderCell: (params) => (
                getSourceType(params.value)
            )
        },
        { field: 'description', headerName: 'Açıklama', width: 400 },
        { field: 'date', headerName: 'İşlem Tarihi', renderHeaderFilter: () => null },
        { field: 'debit_amount', headerName: 'Borç', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'credit_amount', headerName: 'Alacak', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'local_debit_amount', headerName: 'Yerel Borç', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'local_credit_amount', headerName: 'Yerel Alacak', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'exchange_rate', headerName: 'Kur(Yerel)', type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'user_name', headerName: 'Oluşturan' },
    ]

    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');
    //const thirtyDaysAgo = dayjs().subtract(30, 'day');

    const handleDateRangeChange = (newValue) => {
        const startDate = newValue[0] ? dayjs(newValue[0]).format('YYYY-MM-DD') : null;
        const endDate = newValue[1] ? dayjs(newValue[1]).format('YYYY-MM-DD') : null;
        setFilterDate({start: startDate, end: endDate});
    }

    return (
        <PanelContent>
            <ListTableServer
            title="Tahsilat Listesi"
            //autoHeight
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
                    defaultValue={[firstDayOfYear, today]}
                    onAccept={handleDateRangeChange}
                    format='DD.MM.YYYY'
                    slotProps={{
                        textField: { size: 'small' }
                    }}
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
