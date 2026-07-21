import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createKrsReport, fetchKrsReports, fetchProjects, setKrsReportsLoading, setKrsReportsParams } from 'store/slices/krs/krsReportSlice';
import { setAlert, setDeleteDialog, setDialog, setExportDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
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
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


function KrsReports() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {krsReports,krsReportsCount,krsReportsParams,krsReportsLoading} = useSelector((store) => store.krsReport);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKrsReports({activeCompany,params:{...krsReportsParams,project}}));
        });
    }, [activeCompany,krsReportsParams,dispatch]);

    const columns = [
        { field: 'satir', headerName: 'Satır', width:2000, renderCell: (params) => (
            <span style={{ whiteSpace: 'pre' }}>{params.value}</span>
        ) },
        
    ]

    const handleCreateReport = async () => {
        dispatch(setKrsReportsLoading(true));
        await dispatch(createKrsReport({data:{company_uuid: activeCompany.id, date:date}})).unwrap();
        dispatch(fetchKrsReports({activeCompany,params:{...krsReportsParams,project}}));
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

    const today = dayjs();
    const firstDayOfYear = dayjs().startOf('year');

    const handleDateRangeChange = async (newValue) => {
        const date = newValue ? dayjs(newValue).format('YYYY-MM-DD') : null;
        setDate(date);
    }

    return (
        <PanelContent>
            <ListTableServer
            title="Krs Raporları"
            rows={krsReports}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={krsReportsLoading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/krs/export_krs_detaylari/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKrsReports({activeCompany,params:krsReportsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            customFiltersLeft={
                <>  
                    <DatePicker
                    defaultValue={today}
                    onAccept={handleDateRangeChange}
                    format='DD.MM.YYYY'
                    slotProps={{
                        textField: { size: 'small'},
                    }}
                    sx={{mr:2}}
                    />
                    <Button
                    variant='contained'
                    color='mars'
                    endIcon={<PlayCircleFilledWhiteIcon/>}
                    size='small'
                    sx={{mr: 2}}
                    onClick={handleCreateReport}
                    >
                        Rapor Oluştur
                    </Button>
                    <Button
                    variant='contained'
                    color='ari'
                    endIcon={<DownloadIcon/>}
                    size='small'
                    onClick={getFile}
                    >
                        Rapor İndir
                    </Button>
                </>
            }
            rowCount={krsReportsCount}
            // checkboxSelection
            setParams={(value) => dispatch(setKrsReportsParams(value))}
            // //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            noDownloadButton
            apiRef={apiRef}
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            initialState={{
                pinnedColumns: {left: ['code']}
            }}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setKrsReportsLoading(true))}
            finalEvent={() => {dispatch(fetchKrsReports({activeCompany,params:krsReportsParams}));dispatch(setKrsReportsLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default KrsReports
