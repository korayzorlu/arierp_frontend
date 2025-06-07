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
import { Avatar, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { capitalize } from 'lodash';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListTableServer from '../../../component/table/ListTableServer';
import KeyIcon from '@mui/icons-material/Key';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

function Partners() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {partners,partnersCount,partnersParams,partnersLoading} = useSelector((store) => store.partner);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPartners({activeCompany,params:partnersParams}));
        });
    }, [activeCompany,partnersParams,dispatch]);
      
    const columns = [
        { field: 'types', headerName: 'Type', flex: 1.5, renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                    {
                        params.value.map((value,index) => {
                                return (
                                        value === "customer"
                                        ?   
                                            <Chip key={index} variant='contained' color="mars" icon={<PeopleIcon />} label={capitalize(value)} size='small'/>
                                        :
                                        value === "supplier"
                                        ?
                                            <Chip key={index} variant='contained' color="primary" icon={<LocalShippingIcon />} label={capitalize(value)} size='small'/>
                                        :
                                            <Chip key={index} variant='contained' color="success" icon={<BusinessCenterIcon />} label={capitalize(value)} size='small'/>
                                )
                        })
                    }
                </Stack>
            ) 
        },
        { field: 'name', headerName: 'Name', width: 400, editable: true, renderCell: (params) => (
                <Link
                to={`/partners/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'country_name', headerName: 'Country', flex: 1 },
        { field: 'city_name', headerName: 'City', flex: 1 },
        { field: 'address', headerName: 'Address', flex: 4, renderCell: (params) => (
            <>
                {params.value} {params.row.address2}
            </>
            
        )
        },
        { field: 'email', headerName: 'Email', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/partners/delete_all_partners/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const handleTest = async () => {
        try {
            const response = await axios.post(`/partners/test/`,
                { withCredentials: true},
            );
            //dispatch(setAlert({status:response.data.status,text:response.data.message}));
        } catch (error) {
            //dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Partners"
            rows={partners}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={partnersLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="Import"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="New"
                    link="/partners/add-partner"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={partners.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete All"
                    onClick={handleAllDelete}
                    disabled={partners.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Permissions"
                    onClick={handleTest}
                    icon={<KeyIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchPartners({activeCompany,params:partnersParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={partnersCount}
            checkboxSelection
            setParams={(value) => dispatch(setPartnersParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/partners/partners_template"
            importURL="/partners/import_partners/"
            startEvent={() => dispatch(setPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchPartners({activeCompany}));dispatch(setPartnersLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/partners/delete_partners/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setPartnersLoading(true))}
            finalEvent={() => {dispatch(fetchPartners({activeCompany}));dispatch(setPartnersLoading(false));}}
            />
        </PanelContent>
    )
}

export default Partners
