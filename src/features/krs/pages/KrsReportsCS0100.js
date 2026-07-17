import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createKrsReport, fetchKrsReports, fetchKrsReportsCS0100, fetchProjects, setKrsReportsCS0100Params, setKrsReportsLoading, setKrsReportsParams } from 'store/slices/krs/krsReportSlice';
import { setAlert, setDeleteDialog, setDialog, setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Button, Chip, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';
import CurrencyFilter from 'component/table/filter/CurrencyFilter';
import RiskFilter from 'component/table/filter/RiskFilter';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import axios from 'axios';

function KrsReportsCS0100() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {krsReportsCS0100,krsReportsCS0100Count,krsReportsCS0100Params,krsReportsCS0100Loading} = useSelector((store) => store.krsReport);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKrsReportsCS0100({activeCompany,params:{...krsReportsCS0100Params,project}}));
        });
    }, [activeCompany,krsReportsCS0100Params,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme', width:160 },
        { field: 'kayit_turu', headerName: 'Kayıt Türü', width:160 },
        { field: 'versiyon', headerName: 'Versiyon', width:160 },
        { field: 'uye_kodu', headerName: 'Üye Kodu', width:160 },
        { field: 'portfoy_kodu', headerName: 'Portföy Kodu', width:160 },
        { field: 'portfoy_alt_kodu', headerName: 'Portföy Alt Kodu', width:160 },
        { field: 'hesap_numarasi', headerName: 'Hesap Numarası', width:160 },
        { field: 'sube_kodu', headerName: 'Şube Kodu', width:160 },
        { field: 'birim_kodu', headerName: 'Birim Kodu', width:160 },
        { field: 'hesapla_iliskili_kisi_sayisi', headerName: 'Hesapla İlişkili Kişi Sayısı', width:160 },
        { field: 'doviz_kodu', headerName: 'Döviz Kodu', width:160 },
        { field: 'doviz_boleni', headerName: 'Döviz Böleni', width:160 },
        { field: 'ozel_talimakt_gostergesi', headerName: 'Özel Talimakt Göstergesi', width:160 },
        { field: 'acilis_tarihi', headerName: 'Açılış Tarihi', width:160 },
        { field: 'basvuru_referans_numarasi', headerName: 'Başvuru Referans Numarası', width:160 },
        { field: 'kredi_turu', headerName: 'Kredi Türü', width:160 },
        { field: 'faiz_orani_gostergesi', headerName: 'Faiz Oranı Göstergesi', width:160 },
        { field: 'kreid_kullanim_amaci', headerName: 'Kredi Kullanım Amacı', width:160 },
        { field: 'teminat_gostergesi', headerName: 'Teminat Göstergesi', width:160 },
        
    ]

    const handleCreateReport = async () => {
        dispatch(setKrsReportsLoading(true));
        await dispatch(createKrsReport({data:{company_uuid: activeCompany.id}})).unwrap();
        dispatch(fetchKrsReportsCS0100({activeCompany,params:{...krsReportsCS0100Params,project}}));
        dispatch(setKrsReportsLoading(false));
    };

    const getFile = async () => {
        try {
            const response = await axios.post('/krs/get_krs_report_document/',
                {
                    company_uuid: activeCompany.id,
                },
                {
                    responseType: "blob",
                    withCredentials: true
                }
            );
            console.log(response)
            const disposition = response.headers.get('Content-Disposition');
            const filename = disposition?.match(/filename="?(.+?)"?$/)?.[1];
            const a = document.createElement("a");
            a.href = URL.createObjectURL(response.data);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (error) {
            dispatch(setAlert({status:'error',text:error.message}));
        } finally {

        }
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Krs Raporları"
            rows={krsReportsCS0100}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={krsReportsCS0100Loading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/krs/export_krs_detaylari/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKrsReportsCS0100({activeCompany,params:krsReportsCS0100Params})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={krsReportsCS0100Count}
            // checkboxSelection
            setParams={(value) => dispatch(setKrsReportsCS0100Params(value))}
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
            startEvent={() => dispatch(setKrsReportsLoading(true))}
            finalEvent={() => {dispatch(fetchKrsReportsCS0100({activeCompany,params:krsReportsCS0100Params}));dispatch(setKrsReportsLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default KrsReportsCS0100
