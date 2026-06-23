import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchKapamaDetaylari, fetchProjects, setKapamaDetaylariLoading, setKapamaDetaylariParams } from 'store/slices/krs/kapamaDetaySlice';
import { setDeleteDialog, setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Chip, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import CurrencyFilter from 'component/table/filter/CurrencyFilter';
import RiskFilter from 'component/table/filter/RiskFilter';

function KapamaDetaylari() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {kapamaDetaylari,kapamaDetaylariCount,kapamaDetaylariParams,kapamaDetaylariLoading,leaseProjects,leaseVendors} = useSelector((store) => store.kapamaDetay);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKapamaDetaylari({activeCompany,params:{...kapamaDetaylariParams,project}}));
        });
    }, [activeCompany,kapamaDetaylariParams,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme', width:160 },
        { field: 'odeme_tarihi', headerName: 'Ödeme Tarihi', width:160 },
        { field: 'fatura_tarihi', headerName: 'Fatura Tarihi', width:160 },
        { field: 'kapatilan_tutar', headerName: 'Kapatılan Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Kapama Detayları"
            rows={kapamaDetaylari}
            columns={columns}
            getRowId={(row) => row.id}
            loading={kapamaDetaylariLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/krs/export_kapama_detaylari/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKapamaDetaylari({activeCompany,params:kapamaDetaylariParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={kapamaDetaylariCount}
            // checkboxSelection
            setParams={(value) => dispatch(setKapamaDetaylariParams(value))}
            // //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            initialState={{
                pinnedColumns: {left: ['code']}
            }}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setKapamaDetaylariLoading(true))}
            finalEvent={() => {dispatch(fetchKapamaDetaylari({activeCompany,params:kapamaDetaylariParams}));dispatch(setKapamaDetaylariLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default KapamaDetaylari
