import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchContracts, setContractsLoading, setContractsParams } from '../../../store/slices/contracts/contractSlice';
import { Chip, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import { capitalize } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';

function Contracts() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {contracts,contractsCount,contractsParams,contractsLoading} = useSelector((store) => store.contract);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContracts({activeCompany,params:contractsParams}));
        });
    }, [activeCompany,contractsParams,dispatch]);

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/contracts/delete_all_contracts/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const columns = [
        { field: 'code', headerName: 'Sözleşme Kodu', flex:1, editable: true, renderCell: (params) => (
                <Link
                to={`/contracts/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'partner', headerName: 'Müşteri', flex: 2 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', flex: 1 },
        { field: 'quotation', headerName: 'Teklif', flex: 1 },
        { field: 'kof_tan_sozlesmeye_aktarim_tarihi', headerName: "Kof'tan Sözleşmeye Aktarım Tarihi", flex: 1 },
        { field: 'supplier', headerName: "Satıcı", flex: 3 },
        { field: 'project', headerName: "Proje", flex: 3 },
        { field: 'customer_representative', headerName: "Müşteri Temsilcisi", flex: 1 },
        { field: 'status', headerName: "Statü", flex: 1 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Sözleşme Listesi"
            rows={contracts}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={contractsLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/contracts/add-contract"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={contracts.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Tümünü Sil"
                    onClick={handleAllDelete}
                    disabled={user.email === "korayzorllu@gmail.com" ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchContracts({activeCompany,params:contractsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={contractsCount}
            checkboxSelection
            setParams={(value) => dispatch(setContractsParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/contracts/contracts_template"
            importURL="/contracts/import_contracts/"
            startEvent={() => dispatch(setContractsLoading(true))}
            finalEvent={() => {dispatch(fetchContracts({activeCompany}));dispatch(setContractsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/contracts/delete_contracts/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setContractsLoading(true))}
            finalEvent={() => {dispatch(fetchContracts({activeCompany}));dispatch(setContractsLoading(false));}}
            />
        </PanelContent>
    )
}

export default Contracts
