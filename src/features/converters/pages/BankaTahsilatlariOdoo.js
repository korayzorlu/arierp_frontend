import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBankaTahsilatlariOdoo, fixBankaTahsilatiOdoo, fixBankaTahsilatlariOdoo, setBankaTahsilatlariOdooLoading, setBankaTahsilatlariOdooParams } from '../../../store/slices/converters/bankaTahsilatlariOdooSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess, setIsProgress } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

function BankaTahsilatlariOdoo() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankaTahsilatlariOdoo,bankaTahsilatlariOdooCount,bankaTahsilatlariOdooParams,bankaTahsilatlariOdooLoading} = useSelector((store) => store.bankaTahsilatiOdoo);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [itemsTotal, setItemsTotal] = useState(0.00)

    const fetchData = async () => {
        await dispatch(fetchBankaTahsilatlariOdoo({activeCompany,params:bankaTahsilatlariOdooParams})).unwrap();
        const response = await dispatch(fetchBankaTahsilatlariOdoo({activeCompany})).unwrap();
        const Decimal = require('decimal.js');
        setItemsTotal(response.reduce((sum, item) => sum.plus(new Decimal(item.tutar)),new Decimal(0)));
    };

     useEffect(() => {
        fetchData();
    }, [activeCompany,bankaTahsilatlariOdooParams,dispatch]);

    const columns = [
        { field: 'gonderen_unvani', headerName: 'Gönderen Ünvanı', width: 400, editable: true, renderCell: (params) => (
                <Link
                to={`/banka-tahsilatlari-odoo/update/${params.row.uuid}/`}
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

            const response = await axios.post(`/converters/delete_all_banka_tahsilatlari_odoo/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const handleFix = async () => {
        dispatch(setIsProgress(true));
        try {
            const response = await axios.post(`/converters/fix_banka_tahsilatlari_odoo/`,
                { 
                    withCredentials: true
                },
            );
            dispatch(setAlert({status:response.data.status,text:response.data.message}))
        } catch (error) {
            if(error.response.data){
                dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
            }else{
                dispatch(setAlert({status:"error",text:"Sorry, something went wrong!"}));
            };
            return null
        } finally {
            dispatch(setIsProgress(false));
            navigate("/banka--tahsilatlari-odoo");
        }
    };

    return (
        <PanelContent>
            <ListTableServer
            title={`Banka Tahsilatları Odoo'dan Gelen (Toplam: ${itemsTotal})`}
            rows={bankaTahsilatlariOdoo}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={bankaTahsilatlariOdooLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="Import"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchBankaTahsilatlariOdoo({activeCompany,params:bankaTahsilatlariOdooParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={bankaTahsilatlariOdoo.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete All"
                    onClick={handleAllDelete}
                    disabled={bankaTahsilatlariOdoo.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Fix"
                    onClick={handleFix}
                    disabled={bankaTahsilatlariOdoo.length > 0 ? false : true}
                    icon={<AutoFixHighIcon fontSize="small"/>}
                    />

                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={bankaTahsilatlariOdooCount}
            checkboxSelection
            setParams={(value) => dispatch(setBankaTahsilatlariOdooParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/partners/partners_template"
            importURL="/converters/import_banka_tahsilatlari_odoo/"
            startEvent={() => dispatch(setBankaTahsilatlariOdooLoading(true))}
            finalEvent={() => {dispatch(fetchBankaTahsilatlariOdoo({activeCompany}));dispatch(setBankaTahsilatlariOdooLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/converters/delete_banka_tahsilatlari_odoo/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setBankaTahsilatlariOdooLoading(true))}
            finalEvent={() => {dispatch(fetchBankaTahsilatlariOdoo({activeCompany}));dispatch(setBankaTahsilatlariOdooLoading(false));}}
            />
        </PanelContent>
    )
}

export default BankaTahsilatlariOdoo
