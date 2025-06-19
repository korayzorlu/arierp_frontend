import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases, setLeasesLoading, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
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

function Leases() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchLeases({activeCompany,params:leasesParams}));
        });
    }, [activeCompany,leasesParams,dispatch]);
      
    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', flex:1, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'contract', headerName: 'Sözleşme Kodu', flex: 1 },
        { field: 'partner', headerName: 'Müşteri', flex: 3 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', flex: 1 },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', flex: 1 },
        { field: 'quotation', headerName: 'Teklif No', flex: 1 },
        { field: 'kof', headerName: 'KOF No', flex: 1 },
        { field: 'project', headerName: 'Proje', flex: 3 },
        { field: 'vade', headerName: 'Vade', flex: 1, type: 'number' },
        { field: 'vat', headerName: 'KDV(%)', flex: 1, type: 'number' },
        { field: 'musteri_baz_maliyet', headerName: 'Müşteri Baz Maliyet', flex: 1, type: 'number' },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'lease_status', headerName: 'Statü', flex: 2 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/leasing/delete_all_leases/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Kira Planları Listesi"
            rows={leases}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={leasesLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="Import"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="New"
                    link="/leasing/add-lease"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={leases.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete All"
                    onClick={handleAllDelete}
                    disabled={user.email === "korayzorllu@gmail.com" ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchLeases({activeCompany,params:leasesParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={leasesCount}
            checkboxSelection
            setParams={(value) => dispatch(setLeasesParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/leases_template"
            importURL="/leasing/import_leases/"
            startEvent={() => dispatch(setLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchLeases({activeCompany}));dispatch(setLeasesLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_leases/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchLeases({activeCompany}));dispatch(setLeasesLoading(false));}}
            />
        </PanelContent>
    )
}

export default Leases
