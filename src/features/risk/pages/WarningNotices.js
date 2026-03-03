import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchWarningNotices, setWarningNoticesLoading, setWarningNoticesParams } from 'store/slices/contracts/contractSlice';
import PanelContent from 'component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExportDialog from 'component/feedback/ExportDialog';
import { setExportDialog } from 'store/slices/notificationSlice';
import { fetchExportProcess } from 'store/slices/processSlice';
import DownloadIcon from '@mui/icons-material/Download';

function WarningNotices() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {warningNotices,warningNoticesCount,warningNoticesParams,warningNoticesLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [project, setProject] = useState("kizilbuk")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchWarningNotices({activeCompany,params:{...warningNoticesParams,project}}));
        });

        
    }, [activeCompany,warningNoticesParams,dispatch]);

    const columns = [
        { field: 'partner_name', headerName: 'Müşteri', flex: 4 },
        { field: 'contract_code', headerName: 'Sözleşme No', flex: 1 },
        { field: 'process_start_date', headerName: 'İhtar Tarihi', flex: 2 },
        { field: 'service_date', headerName: 'Tebliğ Tarihi', flex: 2 },
        { field: 'official_cancellation_date', headerName: 'Öngörülen Fesih Tarihi', flex: 2 },
        { field: 'termination_days', headerName: 'Fesihe Kalan Gün Sayısı', flex: 1 },
        { field: 'debit_amount', headerName: 'İhtar Borcu', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'paid', headerName: 'Ödenen Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'diff', headerName: 'Kalan Tutar', flex: 1, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'state', headerName: 'Durum', flex: 1 },
    ]

    const changeProject = (newValue) => {
        setProject(newValue);
        dispatch(setWarningNoticesParams({project:newValue}));
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="İhtar Listesi"
                autoHeight
                rows={warningNotices}
                columns={columns}
                getRowId={(row) => row.id}
                loading={warningNoticesLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Excel'e Aktar"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/contracts/export_warning_notices/`)}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchWarningNotices({activeCompany,params:{...warningNoticesParams,project}})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                rowCount={warningNoticesCount}
                setParams={(value) => dispatch(setWarningNoticesParams(value))}
                headerFilters={true}
                noDownloadButton
                disableRowSelectionOnClick={true}
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setWarningNoticesLoading(true))}
            finalEvent={() => {dispatch(fetchWarningNotices({activeCompany,params:warningNoticesParams}));dispatch(setWarningNoticesLoading(false));}}
            status={status}
            />
        </PanelContent>
        
    )
}

export default WarningNotices
