import React, { createRef, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCollections, resetCollectionsParams, setCollectionsLoading, setCollectionsParams } from '../../../store/slices/leasing/collectionSlice';
import { setAlert, setDeleteDialog, setExportDialog, setImportDialog, setInstallmentDialog, setPartnerDialog, setUserDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import './Installments.css';
import { getGridStringOperators, useGridApiRef, useKeepGroupedColumnsHidden } from '@mui/x-data-grid-premium';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { fetchLeases, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchUserInformation } from '../../../store/slices/authSlice';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { fetchBankActivities, fetchBankActivityLeases, setBankActivitiesLoading, setBankActivitiesParams } from '../../../store/slices/leasing/bankActivitySlice';
import ListTable from '../../../component/table/ListTable';
import BasicTable from '../../../component/table/BasicTable';
import DetailPanel from '../components/DetailPanel';
import ExportDialog from '../../../component/feedback/ExportDialog';
import DownloadIcon from '@mui/icons-material/Download';
import OverdueDialog from '../../../component/dialog/OverdueDialog';
import { fetchManagerSummary, setManagerSummaryLoading, setManagerSummaryParams } from '../../../store/slices/leasing/riskPartnerSlice';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function ManagerSummary() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {collections,collectionsCount,collectionsParams,collectionsLoading} = useSelector((store) => store.collection);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {managerSummary,managerSummaryCount,managerSummaryParams,managerSummaryLoading} = useSelector((store) => store.riskPartner);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [project, setProject] = useState("kizilbuk")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchManagerSummary({activeCompany,project}));
        });
    }, [activeCompany,project,dispatch]);

    const bankActivityColumns = [
        { field: 'title', headerName: '', flex: 2 },
        { field: 'amount_try', headerName: 'Toplam Gecikme Tutarı TRY', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount_usd', headerName: 'Toplam Gecikme Tutarı USD', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount_eur', headerName: 'Toplam Gecikme Tutarı EUR', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'quantity', headerName: 'Toplam Sözleşme Sayısı', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0,maximumFractionDigits: 0,}).format(value)
        },
        { field: 'partner', headerName: 'Toplam Müşteri Sayısı', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0,maximumFractionDigits: 0,}).format(value)
        },
    ]

    const changeProject = (newValue) => {
        setProject(newValue);
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
                title="Risk İzleme Yönetici Özeti"
                autoHeight
                rows={managerSummary}
                columns={bankActivityColumns}
                getRowId={(row) => row.id}
                loading={managerSummaryLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchManagerSummary({activeCompany})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                customFiltersLeft={
                    <>
                        <FormControl sx={{mr: 2}}>
                            <InputLabel id="demo-simple-select-label">Proje</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            size='small'
                            value={project}
                            label="Proje"
                            onChange={(e) => changeProject(e.target.value)}
                            disabled={managerSummaryLoading}
                            >
                                <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                                <MenuItem value='sinpas'>SİNPAŞ GYO</MenuItem>
                                <MenuItem value='kasaba'>KASABA</MenuItem>
                                <MenuItem value='servet'>SERVET</MenuItem>
                                <MenuItem value='diger'>Diğer</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                }
                setParams={(value) => dispatch(setManagerSummaryParams(value))}
                noDownloadButton
                disableVirtualization
                />
            </Grid>
        </PanelContent>
    )
}

export default ManagerSummary
