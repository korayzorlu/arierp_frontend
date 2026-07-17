import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createKrsReport, fetchKrsReports, fetchKrsReportsCS0200, fetchProjects, setKrsReportsCS0200Params, setKrsReportsLoading, setKrsReportsParams } from 'store/slices/krs/krsReportSlice';
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

function KrsReportsCS0200() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {krsReportsCS0200,krsReportsCS0200Count,krsReportsCS0200Params,krsReportsCS0200Loading} = useSelector((store) => store.krsReport);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKrsReportsCS0200({activeCompany,params:{...krsReportsCS0200Params,project}}));
        });
    }, [activeCompany,krsReportsCS0200Params,dispatch]);

    const columns = [
        { field: 'kayit_turu', headerName: 'Kayıt Türü', width:160 },
        { field: 'versiyon', headerName: 'Versiyon', width:160 },
        { field: 'uye_kodu', headerName: 'Üye Kodu', width:160 },
        { field: 'portfoy_kodu', headerName: 'Portföy Kodu', width:160 },
        { field: 'portfoy_alt_kodu', headerName: 'Portföy Alt Kodu', width:160 },
        { field: 'hesap_numarasi', headerName: 'Hesap Numarası', width:160 },
        { field: 'hesap_sahibinin_numarasi', headerName: 'Hesap Sahibinin Numarası', width:160 },
        { field: 'hesap_sahibi_turu', headerName: 'Hesap Sahibi Türü', width:160 },
        { field: 'birinci_kimlik_turu', headerName: 'Birinci Kimlik Türü', width:160 },
        { field: 'birinci_kimlik_numarasi', headerName: 'Birinci Kimlik Numarası', width:160 },
        { field: 'ikinci_kimlik_turu', headerName: 'İkinci Kimlik Türü', width:160 },
        { field: 'ikinci_kimlik_numarasi', headerName: 'İkinci Kimlik Numarası', width:160 },
        { field: 'uyruk', headerName: 'Uyruk', width:160 },
        { field: 'soyadi', headerName: 'Soyadı', width:160 },
        { field: 'soyadi_eki', headerName: 'Soyadı Eki', width:160 },
        { field: 'ilk_ad_1', headerName: 'İlk Ad 1', width:160 },
        { field: 'ilk_ad_2', headerName: 'İlk Ad 2', width:160 },
        { field: 'anne_adi', headerName: 'Anne Adı', width:160 },
        { field: 'baba_adi', headerName: 'Baba Adı', width:160 },
        { field: 'cinsiyet', headerName: 'Cinsiyet', width:160 },
        { field: 'firma_adi', headerName: 'Firma Adı', width:160 },
        { field: 'dogum_tarihi', headerName: 'Doğum Tarihi', width:160 },
        { field: 'dogum_yeri', headerName: 'Doğum Yeri', width:160 },
        { field: 'kisinin_dogduru_bolge_il', headerName: 'Kişinin Doğduğu Bölge İl', width:160 },
        { field: 'dogum_yeri_kod', headerName: 'Doğum Yeri Kod', width:160 },


        
    ]

    const handleCreateReport = async () => {
        dispatch(setKrsReportsLoading(true));
        await dispatch(createKrsReport({data:{company_uuid: activeCompany.id}})).unwrap();
        dispatch(fetchKrsReportsCS0200({activeCompany,params:{...krsReportsCS0200Params,project}}));
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
            rows={krsReportsCS0200}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={krsReportsCS0200Loading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/krs/export_krs_detaylari/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKrsReportsCS0200({activeCompany,params:krsReportsCS0200Params})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={krsReportsCS0200Count}
            // checkboxSelection
            setParams={(value) => dispatch(setKrsReportsCS0200Params(value))}
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
            finalEvent={() => {dispatch(fetchKrsReportsCS0200({activeCompany,params:krsReportsCS0200Params}));dispatch(setKrsReportsLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default KrsReportsCS0200
