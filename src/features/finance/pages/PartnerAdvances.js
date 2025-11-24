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
import ExportDialog from '../../../component/feedback/ExportDialog';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import PartnerAdvanceDetailPanel from '../components/PartnerAdvanceDetailPanel';

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
        { field: 'trial_balance_amount', headerName: 'Mizan TL Bakiye', flex: 1, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        // { field: 'partner_advance_activity', headerName: 'Avans İşleme', width: 240, renderHeaderFilter: () => null, renderCell: (params) => (
        //         <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
        //             {
        //                 params.value
        //                 ?
        //                     <Chip key={params.row.uuid} variant='contained' color="success" icon={<CheckIcon />} label="Avans İşlemeye Gönderildi" size='small'/>
        //                 :
        //                     <Button
        //                     key={params.row.uuid}
        //                     variant='contained'
        //                     color="info"
        //                     endIcon={<ArrowOutwardIcon />}
        //                     size='small'
        //                     onClick={() => {
        //                         dispatch(addPartnerAdvanceActivity({data:params.row}));
        //                         dispatch(updatePartnerAdvance({uuid: params.row.uuid}));
                                
        //                     }}
        //                     >
        //                         Avans İşlemeye Gönder
        //                     </Button>
        //             }
        //         </Stack>
        //     ) 
        // },
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
                        title="Excel Hazırla ve İndir"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchPartnerAdvances({activeCompany,params:partnerAdvancesParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            noDownloadButton
            rowCount={partnerAdvancesCount}
            setParams={(value) => dispatch(setPartnerAdvancesParams(value))}
            headerFilters={true}
            apiRef={apiRef}
            getDetailPanelHeight={() => "auto"}
            getDetailPanelContent={(params) => {return(<PartnerAdvanceDetailPanel uuid={params.row.uuid} partnerAdvanceLeases={params.row.leases.leases}></PartnerAdvanceDetailPanel>)}}
            />
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/operation/export_partner_advances/"
            startEvent={() => dispatch(setPartnerAdvancesLoading(true))}
            finalEvent={() => {dispatch(fetchPartnerAdvances({activeCompany,params:partnerAdvancesParams}));dispatch(setPartnerAdvancesLoading(false));}}
            >
            </ExportDialog>
        </PanelContent>
    )
}

export default PartnerAdvances
