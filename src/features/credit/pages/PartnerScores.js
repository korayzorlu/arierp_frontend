import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerScores, fetchProjects, setPartnerScoresLoading, setPartnerScoresParams } from 'store/slices/partners/partnerScoreSlice';
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
import { cellProgress, cellRiskBar } from 'component/progress/CellProgress';

function PartnerScores() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerScores,partnerScoresCount,partnerScoresParams,partnerScoresLoading} = useSelector((store) => store.partnerScore);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")
    const [exportURL, setExportURL] = useState("")
    const [status, setStatus] = useState("all")
    const [overdueStatus, setOverdueStatus] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPartnerScores({activeCompany,params:{...partnerScoresParams,project}}));
            //dispatch(fetchProjects({activeCompany,params:projectsParams}));
        });
    }, [activeCompany,partnerScoresParams,dispatch]);

    const columns = [
        { field: 'partner_name', headerName: 'Müşteri', width: 600, editable: true, renderCell: (params) => (
                <Link
                to={`/partner-financial-profiles/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.row.partner.name}
                </Link>
                
            )
        },
        { field: 'partner_tc_vkn_no', headerName: 'TC/VKN No', width: 120, align: 'right', headerAlign: 'right',
            renderCell: (params) => params.row.partner.tc_vkn_no
        },
        { field: 'partner_customer_code', headerName: 'Müşteri Kodu', width: 90, align: 'right', headerAlign: 'right',
            renderCell: (params) => params.row.partner.customer_code
        },
        { field: 'partner_crm_code', headerName: 'CRM Kodu', width: 90, align: 'right', headerAlign: 'right',
            renderCell: (params) => params.row.partner.crm_code
        },
        { field: 'score', headerName: 'Skor', width: 180, type: 'number', renderCell: cellRiskBar, renderHeaderFilter: () => null },
        { field: 'mr_score', headerName: 'Müşteri Riski', width: 180, type: 'number', renderCell: cellRiskBar, renderHeaderFilter: () => null },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Müşteri Mali Profil Listesi"
            rows={partnerScores}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={partnerScoresLoading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Excel'e Aktar"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/partners/export_ppartner_scores/`)}}
                    icon={<DownloadIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchPartnerScores({activeCompany,params:partnerScoresParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={partnerScoresCount}
            // checkboxSelection
            setParams={(value) => dispatch(setPartnerScoresParams(value))}
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
            startEvent={() => dispatch(setPartnerScoresLoading(true))}
            finalEvent={() => {dispatch(fetchPartnerScores({activeCompany,params:partnerScoresParams}));dispatch(setPartnerScoresLoading(false));}}
            status={status}
            />
        </PanelContent>
    )
}

export default PartnerScores
