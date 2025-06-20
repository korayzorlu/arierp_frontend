import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuickQuotations } from '../../../store/slices/quotations/quickQuotationSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import { setQuickQuotationsLoading, setQuickQuotationsParams } from '../../../store/slices/quotations/quickQuotationSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

function QuickQuotations() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {quickQuotations,quickQuotationsCount,quickQuotationsParams,quickQuotationsLoading} = useSelector((store) => store.quickQuotation);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchQuickQuotations({activeCompany,params:quickQuotationsParams}));
        });
    }, [activeCompany,quickQuotationsParams,dispatch]);
      
    const columns = [
        { field: 'code', headerName: 'Hızlı Teklif Kodu', flex:1, editable: true, renderCell: (params) => (
                <Link
                to={`/quotations/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'partner', headerName: 'Müşteri', flex: 3 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', flex: 1 },
        { field: 'project', headerName: 'Proje', flex: 3 },
        { field: 'block', headerName: 'Blok', flex: 1 },
        { field: 'unit', headerName: 'Bağımsız Bölüm', flex: 1 },
        { field: 'vat', headerName: 'KDV(%)', flex: 1, type: 'number' },
        { field: 'price', headerName: 'KDV Hariç tutar', flex: 1, type: 'number' },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'status', headerName: 'Statü', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {
            const response = await axios.post(`/quotations/delete_all_quick_quotations/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Hızlı Teklif Listesi"
            rows={quickQuotations}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={quickQuotationsLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/quotations/add-quickQuotation"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={quickQuotations.length > 0 ? false : true}
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
                    onClick={() => dispatch(fetchQuickQuotations({activeCompany,params:quickQuotationsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={quickQuotationsCount}
            checkboxSelection
            setParams={(value) => dispatch(setQuickQuotationsParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/quotations/quick_quotations_template"
            importURL="/quotations/import_quick_quotations/"
            startEvent={() => dispatch(setQuickQuotationsLoading(true))}
            finalEvent={() => {dispatch(fetchQuickQuotations({activeCompany}));dispatch(setQuickQuotationsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/quotations/delete_quick_quotations/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setQuickQuotationsLoading(true))}
            finalEvent={() => {dispatch(fetchQuickQuotations({activeCompany}));dispatch(setQuickQuotationsLoading(false));}}
            />
        </PanelContent>
    )
}

export default QuickQuotations
