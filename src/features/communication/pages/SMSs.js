import { gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSMSs, setSMSsParams } from '../../../store/slices/communication/smsSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Chip, Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import DoneIcon from '@mui/icons-material/Done';

function SMSs() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {smss,smssCount,smssParams,smssLoading} = useSelector((store) => store.sms);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchSMSs({activeCompany,params:smssParams}));
        });
    }, [activeCompany,smssParams,dispatch]);

    const columns = [
        { field: 'send_date', headerName: 'Gönderim Tarihi', width: 120 },
        { field: 'partner', headerName: 'Müşteri', width: 400 },
        { field: 'phone_number', headerName: 'Tel. No.', width: 140 },
        { field: 'text', headerName: 'Mesaj', flex: 1 },
        { field: 'status_display', headerName: 'Durum', width: 120,
            renderCell: (params) => {
                <Chip
                key={params.row.uuid}
                variant='outlined'
                color={getStatusParams(params.row.status).color}
                icon={getStatusParams(params.row.status).icon}
                label={params.value}
                size='small'
                sx={{border:'none'}}
                />
            }
        },
        
    ]

    const getStatusParams = (status) => {
        switch (status) {
            case "0":
                return { color: "error", icon: <PriorityHighIcon /> };
            case "1":
                return { color: "success", icon: <DoneAllIcon /> };
            case "2":
                return { color: "warning", icon: <HourglassBottomIcon /> };
            default:
                return { color: "primary", icon: <DoneIcon /> };
        }
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Gönderilen SMS'ler"
                rows={smss}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={smssLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchSMSs({activeCompany,params:smssParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                apiRef={apiRef}
                autoRowHeight
                getRowHeight={() => 'auto'}
                sx={{
                    [`& .${gridClasses.cell}`]: {
                        py: 1,
                    },
                }}
                rowCount={smssCount}
                setParams={(value) => dispatch(setSMSsParams(value))}
                headerFilters={true}
                />
            </Grid>
            
        </PanelContent>
    )
}

export default SMSs
