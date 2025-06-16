import { Stack } from '@mui/material';
import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSectors, setSectorsLoading, setSectorsParams } from '../../../store/slices/partners/sectorSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import KeyIcon from '@mui/icons-material/Key';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function Sectors() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {sectors,sectorsCount,sectorsParams,sectorsLoading} = useSelector((store) => store.sector);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

     useEffect(() => {
        startTransition(() => {
            dispatch(fetchSectors({activeCompany,params:sectorsParams}));
        });
    }, [activeCompany,sectorsParams,dispatch]);
      
    const columns = [
        { field: 'name', headerName: 'Name', flex: 5, editable: true, renderCell: (params) => (
                <Link
                to={`/partners/update-sector/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'code', headerName: 'Kod', flex: 1, type: 'number' },
        { field: 'mainSectorCode', headerName: 'Ana Sektör Kodu', flex: 1, type: 'number' },
        { field: 'matchCode', headerName: 'Kod', flex: 1 },
        { field: 'kkbmbSectorCode', headerName: 'Kod', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/partners/delete_all_sectors/`,
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
            title="Sektörler"
            rows={sectors}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={sectorsLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="Import"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="New"
                    link="/partners/add-sector"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={sectors.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete All"
                    onClick={handleAllDelete}
                    disabled={sectors.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Permissions"
                    onClick={handleTest}
                    icon={<KeyIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchSectors({activeCompany,params:sectorsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={sectorsCount}
            checkboxSelection
            setParams={(value) => dispatch(setSectorsParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/partners/sectors_template"
            importURL="/partners/import_sectors/"
            startEvent={() => dispatch(setSectorsLoading(true))}
            finalEvent={() => {dispatch(fetchSectors({activeCompany}));dispatch(setSectorsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/partners/delete_sectors/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setSectorsLoading(true))}
            finalEvent={() => {dispatch(fetchSectors({activeCompany}));dispatch(setSectorsLoading(false));}}
            />
        </PanelContent>
    )
}

export default Sectors
