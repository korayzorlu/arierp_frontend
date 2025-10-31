import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTitleDeeds, setTitleDeedsLoading, setTitleDeedsParams } from 'store/slices/projects/titleDeedSlice';
import { setDeleteDialog, setImportDialog } from 'store/slices/notificationSlice';
import PanelContent from 'component/panel/PanelContent';
import ListTableServer from 'component/table/ListTableServer';
import CustomTableButton from 'component/table/CustomTableButton';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link } from 'react-router-dom';
import 'static/css/Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Chip, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import { type } from 'jquery';

function TitleDeeds() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {titleDeeds,titleDeedsCount,titleDeedsParams,titleDeedsLoading} = useSelector((store) => store.titleDeed);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchTitleDeeds({activeCompany,params:titleDeedsParams}));
        });
    }, [activeCompany,titleDeedsParams,dispatch]);

    const columns = [
        { field: 'tasinmaz_no', headerName: 'Taşınmaz No',flex: 2, type: 'number' },
        { field: 'nitelik', headerName: 'Nitelik', width: 240 },
        { field: 'il', headerName: 'İl', flex: 2 },
        { field: 'ilce', headerName: 'İlçe', flex: 2 },
        { field: 'mahalle', headerName: 'Mahalle', flex: 2 },
        { field: 'yuzolcum', headerName: 'Yüzölçüm', flex: 2, type: 'number', renderHeaderFilter: () => null, },
        { field: 'ada', headerName: 'Ada', flex: 2, type: 'number' },
        { field: 'parsel', headerName: 'Parsel', flex: 2, type: 'number' },
        { field: 'unit', headerName: 'Bağımsız Bölüm No', flex: 2 },
        { field: 'zemin_hisse_id', headerName: 'Zemin Hisse ID', flex: 2, type: 'number' },
        { field: 'zemin_tipi', headerName: 'Zemin Tipi', flex: 2 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Arı Leasing Tapu Listesi"
            rows={titleDeeds}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={titleDeedsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchTitleDeeds({activeCompany,params:titleDeedsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={titleDeedsCount}
            // checkboxSelection
            setParams={(value) => dispatch(setTitleDeedsParams(value))}
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default TitleDeeds
