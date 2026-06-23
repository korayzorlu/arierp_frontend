import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchKapamaHareketleri, fetchProjects, setKapamaHareketleriLoading, setKapamaHareketleriParams } from 'store/slices/krs/kapamaHareketiSlice';
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

function KapamaHareketleri() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {kapamaHareketleri,kapamaHareketleriCount,kapamaHareketleriParams,kapamaHareketleriLoading} = useSelector((store) => store.kapamaHareketi);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKapamaHareketleri({activeCompany,params:{...kapamaHareketleriParams,project}}));
        });
    }, [activeCompany,kapamaHareketleriParams,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme', width:160 },
        { field: 'tarih', headerName: 'Tarih', width:160 },
        { field: 'fatura_tutar', headerName: 'Fatura Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'odeme_tutar', headerName: 'Ödeme Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'kapatilan_fatura_tutar', headerName: 'Kapatılan Fatura Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'temerrut_tutar', headerName: 'Temerrüt Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'bugune_kadar_temerrut', headerName: 'Bugüne Kadar Temerrüt', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'odenmis_temerrut', headerName: 'Ödenmiş Temerrüt', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'gercek_odeme_tutar', headerName: 'Gerçek Ödeme Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'protokol', headerName: 'Protokol', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Kapama Hareketları"
            rows={kapamaHareketleri}
            columns={columns}
            getRowId={(row) => row.id}
            loading={kapamaHareketleriLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/krs/export_kapama_hareketleri/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKapamaHareketleri({activeCompany,params:kapamaHareketleriParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={kapamaHareketleriCount}
            // checkboxSelection
            setParams={(value) => dispatch(setKapamaHareketleriParams(value))}
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
            startEvent={() => dispatch(setKapamaHareketleriLoading(true))}
            finalEvent={() => {dispatch(fetchKapamaHareketleri({activeCompany,params:kapamaHareketleriParams}));dispatch(setKapamaHareketleriLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default KapamaHareketleri
