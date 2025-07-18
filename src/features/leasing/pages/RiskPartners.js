import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRiskPartners, setRiskPartnersLoading, setRiskPartnersParams } from '../../../store/slices/leasing/riskPartnerSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog, setPartnerDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import DetailPanel from '../components/DetailPanel';
import ListTableServer from '../../../component/table/ListTableServer';
import RiskPartnerDetailPanel from '../components/RiskPartnerDetailPanel';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';

function RiskPartners() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {riskPartners,riskPartnersCount,riskPartnersParams,riskPartnersLoading} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [selectedItemsPerRow, setSelectedItemsPerRow] = useState({});
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [selectedPartnerCrmCode, setSelectedPartnerCrmCode] = useState(null);
    const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = useState(new Set());

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams}));
        });

        
    }, [activeCompany,riskPartnersParams,dispatch]);

    const riskPartnerColumns = [
        { field: 'name', headerName: 'İsim', flex: 4, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    {params.value}
                </div>
            )
        },
        { field: 'tc_vkn_no', headerName: 'TC/VKN', flex: 2 },
        { field: 'crm_code', headerName: 'CRM kodu', flex: 1 },
        { field: 'overdue_days', headerName: 'Gecikmedeki Maks. Gün Sayısı', flex: 2, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                if (params.value <= 30){
                    return 'bg-yellow'
                } else if (params.value > 30 && params.value <= 60){
                    return 'bg-orange'
                } else if (params.value > 60 && params.value <= 90){
                    return 'bg-light-red'
                } else if (params.value > 90){
                    return 'bg-dark-red'
                }
            }
        },
        { field: 'a', headerName: 'Aranma Durumu', flex: 2, renderCell: (params) => (
                <div style={{ cursor: 'pointer' }}>
                    Detay için tıkla
                </div>
            )
        },
        { field: 's', headerName: 'Statü', flex: 2 },
        { field: 'i', headerName: 'İhtar', flex: 2 },
    ]

    const handleProfileDialog = async (params,event) => {
        if(params.field==="name"){
            await dispatch(fetchPartnerInformation(params.row.crm_code)).unwrap();
            dispatch(setPartnerDialog(true));
        }
    };

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/leasing/delete_all_risk_partners/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Müşteri Risk Listesi"
                //autoHeight
                rows={riskPartners}
                columns={riskPartnerColumns}
                getRowId={(row) => row.id}
                loading={riskPartnersLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="İçe Aktar"
                        onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                        icon={<UploadFileIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                rowCount={riskPartnersCount}
                checkboxSelection
                setParams={(value) => dispatch(setRiskPartnersParams(value))}
                onCellClick={handleProfileDialog}
                headerFilters={true}
                noDownloadButton
                disableRowSelectionOnClick={true}
                //apiRef={apiRef}
                //detailPanelExpandedRowIds={detailPanelExpandedRowIds}
                //onDetailPanelExpandedRowIdsChange={(newExpandedRowIds) => {setDetailPanelExpandedRowIds(new Set(newExpandedRowIds));dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams}));}}
                getDetailPanelHeight={() => "auto"}
                getDetailPanelContent={(params) => {return(<RiskPartnerDetailPanel uuid={params.row.uuid} riskPartnerLeases={params.row.leases}></RiskPartnerDetailPanel>)}}
                />
            </Grid>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_risk_partners/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setRiskPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchRiskPartners({activeCompany,params:riskPartnersParams}));dispatch(setRiskPartnersLoading(false));}}
            />
        </PanelContent>
    )
}

export default RiskPartners
