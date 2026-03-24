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

    const columns = [
        { field: 'process_date', headerName: 'İşlem Tarihi', width: 150 },
        { field: 'musteri_tipi', headerName: 'Müşteri Tipi', width: 120 },
        { field: 'paid_amount', headerName: 'Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
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
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/leasing/export_active_leases/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
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
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            noDownloadButton
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
