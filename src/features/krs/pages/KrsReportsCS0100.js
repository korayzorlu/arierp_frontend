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
        { field: 'kredi_tutari', headerName: 'Kredi Tutarı', width:160 },
        { field: 'depozito_tutari', headerName: 'Depozito Tutarı', width:160 },
        { field: 'sozlesme_suresi', headerName: 'Sözleşme Süresi', width:160 },
        { field: 'odeme_sikligi', headerName: 'Ödeme Sıklığı', width:160 },
        { field: 'taksit_tutari', headerName: 'Taksit Tutarı', width:160 },
        { field: 'son_taksit_tutari', headerName: 'Son Taksit Tutarı', width:160 },
        { field: 'taksit_sayisi', headerName: 'Taksit Sayısı', width:160 },
        { field: 'odeme_sekli', headerName: 'Ödeme Şekli', width:160 },
        { field: 'kredi_limiti', headerName: 'Kredi Limiti', width:160 },
        { field: 'hesap_odeme_durumu', headerName: 'Hesap Ödeme Durumu', width:160 },
        { field: 'toplam_borc_bakiyesi', headerName: 'Toplam Borç Bakiyesi', width:160 },
        { field: 'kredi_bakiyesi_gostergesi', headerName: 'Kredi Bakiyesi Göstergesi', width:160 },
        { field: 'borc_faizi_bakiyesi', headerName: 'Borç Faizi Bakiyesi', width:160 },
        { field: 'gecikmedeki_bakiye', headerName: 'Gecikmedeki Bakiye', width:160 },
        { field: 'vadesinde_yapilmayan_odeme', headerName: 'Vadesinde Yapılmayan Ödeme', width:160 },
        { field: 'son_odeme_tutari', headerName: 'Son Ödeme Tutarı', width:160 },
        { field: 'son_odeme_tarihi', headerName: 'Son Ödeme Tarihi', width:160 },
        { field: 'kapanis_tarihi', headerName: 'Kapanış Tarihi', width:160 },
        { field: 'kanuni_takip_tarihi', headerName: 'Kanuni Takip Tarihi', width:160 },
        { field: 'tahsil_edilme_tarihi', headerName: 'Tahsil Edilme Tarihi', width:160 },
        { field: 'kapanma_nedeni', headerName: 'Kapanma Nedeni', width:160 },
        { field: 'hesabin_ozel_durumu', headerName: 'Hesabın Özel Durumu', width:160 },
        { field: 'yeni_hesap_numarasi', headerName: 'Yeni Hesap Numarası', width:160 },
        { field: 'kalan_taksit_bakiyesi', headerName: 'Kalan Taksit Bakiyesi', width:160 },
        { field: 'taksit_tarihi_gostergesi', headerName: 'Taksit Tarihi Göstergesi', width:160 },
        { field: 'yeniden_yapilandirma_gostergesi', headerName: 'Yeniden Yapılandırma Göstergesi', width:160 },
        { field: 'yeniden_yapilandirma_tarihi', headerName: 'Yeniden Yapılandırma Tarihi', width:160 },
        { field: 'tedbir_karari_gostergesi', headerName: 'Tedbir Kararı Göstergesi', width:160 },
        { field: 'kayittan_dusulen_tutar', headerName: 'Kayıttan Düşülen Tutar', width:160 },
        { field: 'nakit_cekim_tutari', headerName: 'Nakit Çekim Tutarı', width:160 },
        { field: 'gecikme_gun_sayisi', headerName: 'Gecikme Gün Sayısı', width:160 },
        { field: 'ekstre_odeme_orani', headerName: 'Ekstre Ödeme Oranı', width:160 },
    
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
