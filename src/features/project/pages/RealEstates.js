import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRealEstates, setRealEstatesLoading, setRealEstatesParams } from 'store/slices/projects/realEstateSlice';
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

function RealEstates() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {realEstates,realEstatesCount,realEstatesParams,realEstatesLoading} = useSelector((store) => store.realEstate);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchRealEstates({activeCompany,params:realEstatesParams}));
        });
    }, [activeCompany,realEstatesParams,dispatch]);

    const columns = [
        { field: 'project', headerName: 'Proje', width:280 },
        { field: 'parcel', headerName: 'Parsel', flex: 2 },
        { field: 'block', headerName: 'Blok', flex: 2 },
        { field: 'unit', headerName: 'Bağımsız Bölüm', flex: 2 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Taşınmazlar Listesi"
            rows={realEstates}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={realEstatesLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchRealEstates({activeCompany,params:realEstatesParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={realEstatesCount}
            // checkboxSelection
            setParams={(value) => dispatch(setRealEstatesParams(value))}
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default RealEstates
