import { useGridApiRef } from '@mui/x-data-grid-premium';
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import ListTableServer from 'component/table/ListTableServer';
import React, { startTransition, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchVPosTransactions, setVPosTransactionsLoading, setVPosTransactionsParams } from 'store/slices/finance/vposTransactionSlice';
import { setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExportDialog from 'component/feedback/ExportDialog';
import ImportDialog from 'component/feedback/ImportDialog';
import { DoneAllIcon, DoneIcon, HourglassBottomIcon, PriorityHighIcon } from 'icons';
import { Chip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PendingIcon from '@mui/icons-material/Pending';

function VPosTransactions() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {vposTransactions,vposTransactionsCount,vposTransactionsParams,vposTransactionsLoading,} = useSelector((store) => store.vposTransaction);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [exportURL, setExportURL] = useState("")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchVPosTransactions({activeCompany,params:{...vposTransactionsParams}}));
        });
    }, [activeCompany,vposTransactionsParams,dispatch]);

    const getStatusParams = (status) => {
        switch (status) {
            case "pending":
                return { color: "info", icon: <PendingIcon />, label: "Beklemede" };
            case "sending":
                return { color: "warning", icon: <HourglassBottomIcon />, label: "Leaseflex'e Gönderiliyor" };
            case "sent":
                return { color: "success", icon: <DoneAllIcon />, label: "Leaseflex'e Gönderildi" };
            case "rejected":
                return { color: "error", icon: <BlockIcon />, label: "Reddedildi" };
            case "invalid":
                return { color: "error", icon: <BlockIcon />, label: "Geçersiz" };
            case "unknown":
                return { color: "primary", icon: <QuestionMarkIcon />, label: "Bilinmiyor" };
            default:
                return { color: "primary", icon: <QuestionMarkIcon />, label: "Bilinmiyor" };
        }
    };

    const columns = [
        { field: 'process_date', headerName: 'İşlem Tarihi', width: 150 },
        { field: 'ext_transaction_id', headerName: 'İşlem ID', width: 160 },
        { field: 'status', headerName: 'Durum', width: 200,
            renderCell: (params) => (
                <Chip
                key={params.row.uuid}
                variant='contained'
                color={getStatusParams(params.value).color}
                icon={getStatusParams(params.value).icon}
                label={getStatusParams(params.value).label}
                size='small'
                sx={{border:'none'}}
                />
            )
        },
        { field: 'ad', headerName: 'Ad', width: 200 },
        { field: 'soyad', headerName: 'Soyad', width: 200 },
        { field: 'contract_code', headerName: 'Kira Planı', width: 90 },
        { field: 'paid_amount', headerName: 'Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', width: 90 },
        { field: 'response_message', headerName: 'Yanıt Mesajı', width: 200 },
        { field: 'last_error', headerName: 'Hata Mesajı', width: 200 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Sanal Pos Hareketleri"
            rows={vposTransactions}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={vposTransactionsLoading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/leasing/export_active_leases/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchVPosTransactions({activeCompany,params:vposTransactionsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={vposTransactionsCount}
            // checkboxSelection
            setParams={(value) => dispatch(setVPosTransactionsParams(value))}
            //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            //noDownloadButton
            apiRef={apiRef}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setVPosTransactionsLoading(true))}
            finalEvent={() => {dispatch(fetchVPosTransactions({activeCompany,params:vposTransactionsParams}));dispatch(setVPosTransactionsLoading(false));}}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/activeLeases_template"
            importURL="/leasing/import_activeLeases/"
            startEvent={() => dispatch(setVPosTransactionsLoading(true))}
            finalEvent={() => {dispatch(fetchVPosTransactions({activeCompany,params:vposTransactionsParams}));dispatch(setVPosTransactionsLoading(false));}}
            />
        </PanelContent>
    )
}

export default VPosTransactions
