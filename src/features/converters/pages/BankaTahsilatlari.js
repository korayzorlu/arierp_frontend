import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners, setPartnersParams } from '../../../store/slices/partners/partnerSlice';
import { Chip, Stack, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Link } from 'react-router-dom';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImportDialog from '../../../component/feedback/ImportDialog';
import { fetchBankaTahsilatlari, setBankaTahsilatlariLoading, setBankaTahsilatlariParams } from '../../../store/slices/converters/bankaTahsilatlariSlice';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';

function BankaTahsilatlari() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankaTahsilatlari,bankaTahsilatlariCount,bankaTahsilatlariParams,bankaTahsilatlariLoading} = useSelector((store) => store.bankaTahsilati);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [itemsTotal, setItemsTotal] = useState(0.00)

    const fetchData = async () => {
        await dispatch(fetchBankaTahsilatlari({activeCompany,params:bankaTahsilatlariParams})).unwrap();
        const response = await dispatch(fetchBankaTahsilatlari({activeCompany})).unwrap();
        //setItemsTotal(response.reduce((sum, item) => sum + Number(item.tutar), 0));
        const Decimal = require('decimal.js');
        setItemsTotal(response.reduce((sum, item) => sum.plus(new Decimal(item.tutar)),new Decimal(0)));
    };
    

     useEffect(() => {
        fetchData();
    }, [activeCompany,bankaTahsilatlariParams,dispatch]);

    const columns = [
        { field: 'gonderen_unvani', headerName: 'Gönderen Ünvanı', width: 400, editable: true, renderCell: (params) => (
                <Link
                to={`/banka-tahsilatlari/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'tc_vkn_no', headerName: 'TC / VKN No', flex: 1 },
        { field: 'aciklama', headerName: 'Açıklama', flex: 4 },
        { field: 'tutar', headerName: 'Tutar', flex: 1, type: 'number' },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/converters/delete_all_banka_tahsilatlari/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title={`Banka Tahsilatları (Toplam: ${itemsTotal.toString()})`}
            rows={bankaTahsilatlari}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={bankaTahsilatlariLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="Import"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchBankaTahsilatlari({activeCompany,params:bankaTahsilatlariParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={bankaTahsilatlari.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete All"
                    onClick={handleAllDelete}
                    disabled={bankaTahsilatlari.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={bankaTahsilatlariCount}
            checkboxSelection
            setParams={(value) => dispatch(setBankaTahsilatlariParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/partners/partners_template"
            importURL="/converters/import_banka_tahsilatlari/"
            startEvent={() => dispatch(setBankaTahsilatlariLoading(true))}
            finalEvent={() => {dispatch(fetchBankaTahsilatlari({activeCompany}));dispatch(setBankaTahsilatlariLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/converters/delete_banka_tahsilatlari/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setBankaTahsilatlariLoading(true))}
            finalEvent={() => {dispatch(fetchBankaTahsilatlari({activeCompany}));dispatch(setBankaTahsilatlariLoading(false));}}
            />
        </PanelContent>
    )
}

export default BankaTahsilatlari
