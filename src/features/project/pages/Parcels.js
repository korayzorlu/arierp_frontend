import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchParcels, setParcelsLoading, setParcelsParams } from 'store/slices/projects/parcelSlice';
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

function Parcels() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {parcels,parcelsCount,parcelsParams,parcelsLoading} = useSelector((store) => store.parcel);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);
    const [project, setProject] = useState("all")

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchParcels({activeCompany,params:parcelsParams}));
        });
    }, [activeCompany,parcelsParams,dispatch]);

    const columns = [
        { field: 'project', headerName: 'Proje', width:280 },
        { field: 'no', headerName: 'Parsel No' },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Parsel Listesi"
            rows={parcels}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={parcelsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchParcels({activeCompany,params:parcelsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={parcelsCount}
            // checkboxSelection
            setParams={(value) => dispatch(setParcelsParams(value))}
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            apiRef={apiRef}
            />
        </PanelContent>
    )
}

export default Parcels
