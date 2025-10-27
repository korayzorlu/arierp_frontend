import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import ListTable from 'component/table/ListTable';
import { fetchManagerSummary, setManagerSummaryParams } from 'store/slices/leasing/riskPartnerSlice';

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
        { field: 'amount_try', headerName: 'TRY', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount_usd', headerName: 'USD', flex: 2, type: 'number', valueFormatter: (value) => 
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount_eur', headerName: 'EUR', flex: 2, type: 'number', valueFormatter: (value) => 
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
                        onClick={() => dispatch(fetchManagerSummary({activeCompany, project})).unwrap()}
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
                columnGroupingModel={[
                    {
                        groupId: 'Toplam Gecikme Tutarı',
                        children: [{ field: 'amount_try' }, { field: 'amount_usd' }, { field: 'amount_eur' }],
                        headerClassName: 'ColumnGroupingModel'
                    },
                ]}
                />
            </Grid>
        </PanelContent>
    )
}

export default ManagerSummary
