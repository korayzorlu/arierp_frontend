import { Alert, Box, Card, Chip, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material'
import React, { startTransition, useEffect } from 'react'
import { Grid } from '@mui/material';
import { ReactComponent as EagleIcon2 } from "../../../images/icons/global/eagle.svg";
import { useDispatch, useSelector } from 'react-redux';
import  ctuIcon  from "../../../images/icons/global/ctu-logo.png";
import EagleIcon from '../../../component/icon/EagleIcon';
import ListTableServer from '../../../component/table/ListTableServer';
import { fetchTerminatedSummary, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { faker } from '@faker-js/faker';
import { fetchContractsSummary } from '../../../store/slices/contracts/contractSlice';
import SummaryCard from '../components/SummaryCard';
import ContractsGraph from '../components/ContractsGraph';
import ContractsPie from '../components/ContractsPie';
import RisksBar from '../components/RisksBar';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import ReportIcon from '@mui/icons-material/Report';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentsIcon from '@mui/icons-material/Payments';
import Installment from '../../leasing/pages/Installment';
import InstallmentPaymentWarningGraph from '../components/InstallmentPaymentWarningGraph';
import PortfoysPie from '../components/PortfoysPie';
import PortfolioGraph from '../components/PortfolioGraph';

function Dashboard() {
    const {dark,user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractsSummary,contractPaymentsSummary,warningNoticesSummary} = useSelector((store) => store.contract);
    const {terminatedSummary,terminatedSummaryParams} = useSelector((store) => store.lease);

        const dispatch = useDispatch();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTerminatedSummary({activeCompany,params:{...terminatedSummaryParams,paginate:false}}));
        });
    }, [activeCompany,terminatedSummaryParams,dispatch]);
    
    const endDate = new Date('2025-08-14');
    const dates = [];
    const seriesData = [];

    for (let i = 29; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(endDate.getDate() - i);
        dates.push(date);
        seriesData.push(faker.number.float({ min: 1, max: 10, precision: 0.5 }));
    }

    const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul' });

    function formatTRY(amount) {
        return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <Stack spacing={1}>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:3}}>
                    <SummaryCard
                    icon={<IconButton color="success" sx={{backgroundColor: dark ? '#00000040' : '#00000020'}}><EditDocumentIcon /></IconButton>}
                    title="Ekim 2025"
                    //text={`${contractsSummary.slice(-7).reduce((sum, item) => sum + (item.count || 0), 0)} Sözleşme eklendi`}
                    text={`${contractsSummary.length > 0 ? contractsSummary[contractsSummary.length - 1].count : 0} Sözleşme eklendi`}
                    />
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <SummaryCard
                    icon={<IconButton color="warning" sx={{backgroundColor: dark ? '#00000040' : '#00000020'}}><ReportIcon /></IconButton>}
                    title="Ekim 2025"
                    //text={`${warningNoticesSummary.slice(-7).reduce((sum, item) => sum + (item.count || 0), 0)} İhtar çekildi`}
                    text={`${warningNoticesSummary.length > 0 ? warningNoticesSummary[warningNoticesSummary.length - 1].count : 0} İhtar çekildi`}
                    />
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <SummaryCard
                    icon={<IconButton color="error" sx={{backgroundColor: dark ? '#00000040' : '#00000020'}}><CancelIcon /></IconButton>}
                    title="Ekim 2025"
                    //text={`${terminatedSummary.slice(-7).reduce((sum, item) => sum + (item.count || 0), 0)} Sözleşme feshedildi`}
                    text={`${terminatedSummary.reduce((sum, item) => sum + (item.count || 0), 0)} Sözleşme feshedildi`}
                    />
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <SummaryCard
                    icon={<IconButton color="primary" sx={{backgroundColor: dark ? '#00000040' : '#00000020'}}><PaymentsIcon /></IconButton>}
                    title="Ekim 2025"
                    // text={`
                    //         ${
                    //             formatTRY(
                    //                 contractPaymentsSummary.slice(-7).reduce((sum, item) => 
                    //                     sum + (item.amount || 0), 0
                    //                 )
                    //             )
                    //         } TRY tahsilat yapıldı
                    //     `}
                    text={`
                            ${
                                formatTRY(
                                    contractPaymentsSummary.length > 0
                                    ?
                                        contractPaymentsSummary[contractPaymentsSummary.length - 1].amount
                                    :
                                        0
                                )
                            } TRY tahsilat yapıldı
                        `}
                    />
                </Grid>
            </Grid>

            {/* <Grid container spacing={1}>
                <Grid size={{xs:12,sm:6}}>
                    <PortfolioGraph/>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                    <RisksBar/>
                </Grid>
            </Grid> */}

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:9}}>
                    <ContractsGraph/>
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <ContractsPie/>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid size={{xs:12,sm:9}}>
                    <InstallmentPaymentWarningGraph/>
                </Grid>
                <Grid size={{xs:12,sm:3}}>
                    <RisksBar/>
                </Grid>
            </Grid>

        </Stack>
        
        
    )
}

export default Dashboard
