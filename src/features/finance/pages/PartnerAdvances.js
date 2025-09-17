import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Button, Chip, Grid, Stack, TextField } from '@mui/material';
import { addPartnerAdvanceActivity, fetchPartnerAdvances, setPartnerAdvancesLoading, setPartnerAdvancesParams, updatePartnerAdvance } from '../../../store/slices/finance/partnerAdvanceSlice';
import CheckIcon from '@mui/icons-material/Check';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { updatePartnerAdvanceActivity } from '../../../store/slices/operation/partnerAdvanceActivitySlice';

function PartnerAdvances() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerAdvances,partnerAdvancesCount,partnerAdvancesParams,partnerAdvancesLoading} = useSelector((store) => store.partnerAdvance);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPartnerAdvances({activeCompany,params:partnerAdvancesParams}));
        });
    }, [activeCompany,partnerAdvancesParams,dispatch]);

    const columns = [
        { field: 'name', headerName: 'Müşteri İsmi', width: 400 },
        { field: 'tc_vkn_no', headerName: 'TC/VKN No', flex: 1 },
        { field: 'crm_code', headerName: 'CRM Kodu', flex: 1 },
        { field: 'advance_amount', headerName: 'TL Bakiye', flex: 1, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'tahsilat', headerName: 'Avans İşleme', width: 240, renderHeaderFilter: () => null, renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.row.debit === "+"
                        ?
                            params.row.partner_advance_activity
                            ?
                                <Chip key={params.row.uuid} variant='contained' color="success" icon={<CheckIcon />} label="Avans İşlemeye Gönderildi" size='small'/>
                            :
                                <Button
                                key={params.row.uuid}
                                variant='contained'
                                color="info"
                                endIcon={<ArrowOutwardIcon />}
                                size='small'
                                onClick={() => {
                                    dispatch(addPartnerAdvanceActivity({data:params.row}));
                                    dispatch(updatePartnerAdvance({uuid: params.row.uuid}));
                                    
                                }}
                                >
                                    Avans İşlemeye Gönder
                                </Button>
                        :
                            null
                    }
                </Stack>
            ) 
        },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Müşteri Avansları"
            autoHeight
            rows={partnerAdvances}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={partnerAdvancesLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchPartnerAdvances({activeCompany,params:partnerAdvancesParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            rowCount={partnerAdvancesCount}
            setParams={(value) => dispatch(setPartnerAdvancesParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default PartnerAdvances
