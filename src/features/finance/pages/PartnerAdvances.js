import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases, resetLeasesParams, setLeasesLoading, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Chip, Grid, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { fetchPartnerAdvances, setPartnerAdvancesLoading, setPartnerAdvancesParams } from '../../../store/slices/finance/partnerAdvanceSlice';

function PartnerAdvances() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {partnerAdvances,partnerAdvancesCount,partnerAdvancesParams,partnerAdvancesLoading} = useSelector((store) => store.partnerAdvance);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

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
