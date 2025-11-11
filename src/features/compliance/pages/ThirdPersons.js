import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import React, { startTransition, useEffect, useState } from 'react'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GroupsIcon from '@mui/icons-material/Groups';
import PolicyIcon from '@mui/icons-material/Policy';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import { fetchThirdPersons, setThirdPersonsParams } from '../../../store/slices/compliance/thirdPersonSlice';
import { useGridApiRef } from '@mui/x-data-grid';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import WarningIcon from '@mui/icons-material/Warning';
import { Link } from 'react-router-dom';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ThirdPersonStatusDialog from 'component/dialog/ThirdPersonStatusDialog';
import { setThirdPersonStatusDialog } from 'store/slices/notificationSlice';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';


function ThirdPersons() {
    const {mobile} = useSelector((store) => store.sidebar);
    const {activeCompany} = useSelector((store) => store.organization);
    const {thirdPersons,thirdPersonsCount,thirdPersonsParams,thirdPersonsLoading} = useSelector((store) => store.thirdPerson);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [selectedRow, setSelectedRow] = useState({})

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams}));
        });
    }, [activeCompany,thirdPersonsParams,dispatch]);

    const getStatus = (status) => {
        switch (status) {
            case "pending":
                return { color: "primary", icon: <WarningIcon />, label: "Kontrol Et" };
            case "cleared":
                return { color: "success", icon: <CheckIcon />, label: "Temiz" };
            case "flagged":
                return { color: "error", icon: <DoDisturbAltIcon />, label: "Yasaklı" };
            default:
                return { color: "primary", icon: <CheckIcon />, label: "Bilinmiyor" };
        }
    };

    const columns = [
        { field: 'created_date', headerName: 'Sorgu Tarihi', width: 180 },
        { field: 'name', headerName: 'İsim', width: 360 },
        { field: 'tc_vkn_no', headerName: 'TC/VKN No', flex:1 },
        { field: 'status', headerName: 'Sorgu Sonucu', flex:1,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.status === "pending"
                        ?
                            <Button
                            key={params.row.transaction_id}
                            variant='contained'
                            color="info"
                            endIcon={<ArrowOutwardIcon />}
                            size='small'
                            onClick={() => {
                                dispatch(setThirdPersonStatusDialog(true));
                                setSelectedRow(params.row);
                            }}
                            >
                                Kontrol Et ve Güncelle
                            </Button>
                        :
                            <Chip key={params.row.transaction_id} variant='contained' color={getStatus(params.value).color} icon={getStatus(params.value).icon} label={getStatus(params.value).label} size='small'/>
                    }
                </Stack>
            ),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'pending', label: 'Kontrol Edilecek' },
                    { value: 'cleared', label: 'Temiz' },
                    { value: 'flagged', label: 'Yasaklı/Şüpheli' },
                ]}
                />
            )
        },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="3. Şahıs Ödemelerinde Sorgulanacak Kişiler Listesi"
            //autoHeight
            rows={thirdPersons}
            columns={columns}
            getRowId={(row) => row.id}
            loading={thirdPersonsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchThirdPersons({activeCompany,params:thirdPersonsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={thirdPersonsCount}
            //checkboxSelection
            disableRowSelectionOnClick
            setParams={(value) => dispatch(setThirdPersonsParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
            <ThirdPersonStatusDialog
            row={selectedRow}
            />
        </PanelContent>
    )
}

export default ThirdPersons
