import axios from 'axios';
import React, { useEffect, useState, useTransition } from 'react'
import PanelContent from '../../../component/panel/PanelContent';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners, setPartnersLoading, setPartnersParams } from '../../../store/slices/partners/partnerSlice';
import { Link } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { setAlert, setDeleteDialog, setDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import { Avatar, Button, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { capitalize } from 'lodash';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListTableServer from '../../../component/table/ListTableServer';
import KeyIcon from '@mui/icons-material/Key';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import StarIcon from '@mui/icons-material/Star';
import { DataGrid } from '@mui/x-data-grid';
import SelectHeaderFilter from '../../../component/table/SelectHeaderFilter';

function TuketiciPartners() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {partners,partnersCount,partnersParams,partnersLoading} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPartners({activeCompany,params:{...partnersParams,is_commercial:false}}));
        });
    }, [activeCompany,partnersParams,dispatch]);
      
    const columns = [
        { field: 'name', headerName: 'İsim', flex: 6, editable: true, renderCell: (params) => (
                <Link
                to={`/partners/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'customerCode', headerName: 'Müşteri Kodu', flex: 1},
        { field: 'crmCode', headerName: 'CRM Kodu', flex: 1},
        { field: 'tcVknNo', headerName: 'TC/VKN No', flex: 2 },
        { field: 'country_name', headerName: 'Ülke', flex: 1 },
        { field: 'city_name', headerName: 'Şehir', flex: 1 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Tüketici Müşteriler Listesi"
            rows={partners}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={partnersLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchPartners({activeCompany,params:partnersParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={partnersCount}
            //checkboxSelection
            setParams={(value) => dispatch(setPartnersParams(value))}
            headerFilters={true}
            />
        </PanelContent>
    )
}

export default TuketiciPartners
