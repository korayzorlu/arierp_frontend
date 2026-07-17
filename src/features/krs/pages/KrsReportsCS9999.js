import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createKrsReport, fetchKrsReports, fetchKrsReportsCS9999, fetchProjects, setKrsReportsCS9999Params, setKrsReportsLoading, setKrsReportsParams } from 'store/slices/krs/krsReportSlice';
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

function KrsReportsCS9999() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {krsReportsCS9999,krsReportsCS9999Count,krsReportsCS9999Params,krsReportsCS9999Loading} = useSelector((store) => store.krsReport);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKrsReportsCS9999({activeCompany,params:{...krsReportsCS9999Params,project}}));
        });
    }, [activeCompany,krsReportsCS9999Params,dispatch]);

    const columns = [
        { field: 'kayit_turu', headerName: 'Kayıt Türü', width:160 },
        {field: 'versiyon', headerName: 'Versiyon', width:160},
        {field: 'uye_kodu', headerName: 'Üye Kodu', width:160},
        {field: 'portfoy_kodu', headerName: 'Portföy Kodu', width:160},
        {field: 'hesap_kayitlarinin_toplam_sayisi', headerName: 'Hesap Kayıtlarının Toplam Sayısı', width:160},
        {field: 'diger_para_birimine_gore_hesap_kayitlarinin_toplam_sayisi', headerName: 'Diğer Para Birimine Göre Hesap Kayıtlarının Toplam Sayısı', width:160},
        {field: 'hesap_gecmisi_kayitlarinin_toplam_sayisi', headerName: 'Hesap Geçmişi Kayıtlarının Toplam Sayısı', width:160},
        {field: 'isim_kayitlarinin_toplam_sayisi', headerName: 'İsim Kayıtlarının Toplam Sayısı', width:160},
        {field: 'formatlanmamis_adres_kayitlarinin_toplam_sayisi', headerName: 'Formatlanmamış Adres Kayıtlarının Toplam Sayısı', width:160},
        {field: 'detayli_kisisel_bilgiler_kayitlarinin_toplam_sayisi', headerName: 'Detaylı Kişisel Bilgiler Kayıtlarının Toplam Sayısı', width:160},
        {field: 'detayli_isveren_bilgileri_kayitlarinin_toplam_sayisi', headerName: 'Detaylı İşveren Bilgileri Kayıtlarının Toplam Sayısı', width:160},
        {field: 'detayli_banka_bilgileri_kayitlarinin_toplam_sayisi', headerName: 'Detaylı Banka Bilgileri Kayıtlarının Toplam Sayısı', width:160},


        
    ]

    const handleCreateReport = async () => {
        dispatch(setKrsReportsLoading(true));
        await dispatch(createKrsReport({data:{company_uuid: activeCompany.id}})).unwrap();
        dispatch(fetchKrsReportsCS9999({activeCompany,params:{...krsReportsCS9999Params,project}}));
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
            rows={krsReportsCS9999}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={krsReportsCS9999Loading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/krs/export_krs_detaylari/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKrsReportsCS9999({activeCompany,params:krsReportsCS9999Params})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={krsReportsCS9999Count}
            // checkboxSelection
            setParams={(value) => dispatch(setKrsReportsCS9999Params(value))}
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
            finalEvent={() => {dispatch(fetchKrsReportsCS9999({activeCompany,params:krsReportsCS9999Params}));dispatch(setKrsReportsLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default KrsReportsCS9999
