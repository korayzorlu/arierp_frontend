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
import dayjs from "dayjs";
import { faker } from '@faker-js/faker';

function randomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i=0; i<length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function FinanceSummary() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const theme = useTheme();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBankActivities({activeCompany,params:{...bankActivitiesParams,created_date_after:'2025-08-13'}}));
        });
    }, [activeCompany,bankActivitiesParams,dispatch]);

    const endDate = new Date('2025-08-14');
    const dates = [];
    const seriesData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        dates.push(date);
        seriesData.push(faker.number.float({ min: 1, max: 10, precision: 0.5 }));
    }

    const xAxisData = bankActivities.map(item =>
        Date(item.created_date) // Grafikte tarih düzgün gözüksün diye
    );
    console.log(xAxisData)
    // amount → data
    const amountData = bankActivities.map(item => Number(item.processed_amount));

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
                            xAxis={[{ 
                                data: dates,
                                scaleType: "time",
                                valueFormatter: (date) => date.toISOString().split('T')[0],
                            }]}
                            series={[
                                {
                                data: amountData,
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
