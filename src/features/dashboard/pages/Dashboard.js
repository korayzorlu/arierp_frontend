import { Box, Card, Chip, Divider, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'
import { Grid } from '@mui/material';
import { ReactComponent as EagleIcon2 } from "../../../images/icons/global/eagle.svg";
import { useDispatch, useSelector } from 'react-redux';
import  ctuIcon  from "../../../images/icons/global/ctu-logo.png";
import EagleIcon from '../../../component/icon/EagleIcon';
import ListTableServer from '../../../component/table/ListTableServer';
import { setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { LineChart, lineElementClasses, markElementClasses } from '@mui/x-charts/LineChart';
import { faker } from '@faker-js/faker';

function Dashboard() {
    const {dark} = useSelector((store) => store.auth);

    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);
    const {bankActivities,bankActivitiesCount,bankActivitiesParams,bankActivitiesLoading} = useSelector((store) => store.bankActivity);

    const dispatch = useDispatch();
    const theme = useTheme();

    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', width:120, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.uuid}/${params.row.contract}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'contract', headerName: 'Sözleşme Kodu' },
        { field: 'partner', headerName: 'Müşteri', width:280, renderCell: (params) => (
                params.row.partner_special
                ?
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            {params.value}
                        </Grid>
                        <Grid size={4}>
                            <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Özel" size='small'/>
                        </Grid>
                    </Grid>
                :
                    params.value
            )
        },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', width:160 },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', renderHeaderFilter: () => null },
        //{ field: 'quotation', headerName: 'Teklif No' },
        //{ field: 'kof', headerName: 'KOF No' },
        { field: 'project', headerName: 'Proje', width:280 },
        { field: 'block', headerName: 'Blok' },
        { field: 'unit', headerName: 'Bağımsız Bölüm' },
        //{ field: 'vade', headerName: 'Vade', type: 'number' },
        //{ field: 'vat', headerName: 'KDV(%)', type: 'number' },
        //{ field: 'musteri_baz_maliyet', headerName: 'Müşteri Baz Maliyet', type: 'number'},
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', width:160, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            },
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'overdue_days', headerName: 'Gecikme Süresi', width:120, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => (
                params.row.overdue_amount > 0
                ?
                    params.value >= 0
                    ?
                        `${params.value} gün`
                    :
                        null
                :
                    null
                
            )
        },
        { field: 'status', headerName: 'Alt Statü', width:120 },
        { field: 'lease_status', headerName: 'Statü', width:120 },
    ]

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
        <Stack>
            <Grid
            container
            spacing={2}
            >{/*
                <Grid
                size={{xs:12,sm:4}}
                >
                    <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ p: 2,backgroundColor: dark ? 'bluelemonade.main' : 'white.main' }}>
                            <Stack
                            direction="row"
                            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                            >
                            <Typography gutterBottom variant="h5" component="div">
                                KİRA PLANLARI
                            </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Sözleşmelere bağlı kira planlarının tüm detaylarını Arınet'te görüntüleyebilirsiniz.
                            </Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <ListTableServer
                            rows={leases}
                            columns={columns}
                            height="auto"
                            getRowId={(row) => row.uuid}
                            loading={leasesLoading}
                            checkboxSelection={false}
                            rowCount={leasesCount}
                            setParams={(value) => {dispatch(setLeasesParams(value));console.log(value)}}
                            noOverlay
                            />
                        </Box>
                    </Card>
                </Grid>
                <Grid
                size={{xs:12,sm:4}}
                >
                    <Card variant="outlined" square={true} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                    </Card>
                </Grid>*/}
            </Grid>
        </Stack>
    )
}

export default Dashboard
