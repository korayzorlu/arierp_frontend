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
import { Box, Grid, Paper, Stack, TextField, Typography, useTheme } from '@mui/material';
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
import { fetchFinanceSummary, setFinanceSummaryLoading, setFinanceSummaryParams } from '../../../store/slices/finance/financeSlice';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function FinanceSummary() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {collections,collectionsCount,collectionsParams,collectionsLoading} = useSelector((store) => store.collection);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {financeSummary,financeSummaryCount,financeSummaryParams,financeSummaryLoading} = useSelector((store) => store.finance);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchFinanceSummary({activeCompany}));
        });
    }, [activeCompany,financeSummaryParams,dispatch]);

    const bankActivityColumns = [
        { field: 'key', headerName: '', flex: 2 },
        { field: 'value', headerName: '', flex: 2 },
    ]

    return (
        <PanelContent>
            <Stack spacing={0}>
                <Grid container spacing={1}>
                    <Grid size={{xs:12,sm:12}}>
                        <Paper elevation={0} sx={{p:2}} square>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                                30 Günlük Tahsilat Grafiği
                            </Typography>
                            <LineChart
                            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                            series={[
                                {
                                data: [2, 5.5, 2, 8.5, 1.5, 5],
                                area: true,
                                color: theme.palette.primary.main
                                },
                            ]}
                            height={300}
                            sx={{
                                // Style for the main line
                                [`.${lineElementClasses.root}`]: {
                                stroke: '#9E9E9E', // Grey for the line
                                },
                                // Style for the points (markers)
                                [`.${markElementClasses.root}`]: {
                                fill: '#9E9E9E', // Grey for the points
                                },
                            }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Stack>
        </PanelContent>
    )
}

export default FinanceSummary
