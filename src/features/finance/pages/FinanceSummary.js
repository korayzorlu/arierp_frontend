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

import { getGridStringOperators, useGridApiRef, useKeepGroupedColumnsHidden } from '@mui/x-data-grid-premium';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { fetchLeases, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { fetchUserInformation } from '../../../store/slices/authSlice';
import { fetchPartnerInformation } from '../../../store/slices/partners/partnerSlice';
import { fetchInstallmentInformation, setInstallmentsLoading } from '../../../store/slices/leasing/installmentSlice';
import { fetchBankActivities, fetchBankActivityLeases, setBankActivitiesLoading, setBankActivitiesParams } from '../../../store/slices/leasing/bankActivitySlice';
import ListTable from '../../../component/table/ListTable';
import BasicTable from '../../../component/table/BasicTable';
import ExportDialog from '../../../component/feedback/ExportDialog';
import DownloadIcon from '@mui/icons-material/Download';
import OverdueDialog from '../../../component/dialog/OverdueDialog';
import { fetchFinanceSummary, setFinanceSummaryLoading, setFinanceSummaryParams } from '../../../store/slices/finance/financeSlice';

function FinanceSummary() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {financeSummary,financeSummaryCount,financeSummaryParams,financeSummaryLoading} = useSelector((store) => store.finance);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [project, setProject] = useState("kizilbuk")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchFinanceSummary({activeCompany,project}));
        });
    }, [activeCompany,project,dispatch]);

    const bankActivityColumns = [
        { field: 'title', headerName: '', flex: 2 },
        { field: 'amount_try', headerName: 'Toplam Tutar TRY', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount_usd', headerName: 'Toplam Tutar USD', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount_eur', headerName: 'Toplam Tutar EUR', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
    ]

    const changeProject = (newValue) => {
        setProject(newValue);
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTable
                title="Satıcı Ödemeleri Yönetici Özeti"
                autoHeight
                rows={financeSummary}
                columns={bankActivityColumns}
                getRowId={(row) => row.id}
                loading={financeSummaryLoading}
                customButtons={
                    <>
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchFinanceSummary({activeCompany})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                customFiltersLeft={
                    <>
                        <FormControl sx={{mr: 2}}>
                            <InputLabel>Satıcı</InputLabel>
                            <Select
                            size='small'
                            value={project}
                            label="Satıcı"
                            onChange={(e) => changeProject(e.target.value)}
                            disabled={financeSummaryLoading}
                            >
                                <MenuItem value='kizilbuk'>KIZILBÜK</MenuItem>
                                <MenuItem value='sinpas'>SİNPAŞ GYO</MenuItem>
                                <MenuItem value='kasaba'>KASABA</MenuItem>
                                <MenuItem value='servet'>SERVET</MenuItem>
                                <MenuItem value='diger'>Diğer</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{mr: 2}}>
                            <InputLabel>Proje</InputLabel>
                            <Select
                            size='small'
                            value="hepsi"
                            label="Proje"
                            onChange={(e) => changeProject(e.target.value)}
                            disabled={financeSummaryLoading}
                            >
                                <MenuItem value='hepsi'>Hepsi</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                }
                setParams={(value) => dispatch(setFinanceSummaryParams(value))}
                noDownloadButton
                disableVirtualization
                />
            </Grid>
        </PanelContent>
    )
}

export default FinanceSummary
