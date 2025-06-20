import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuotations } from '../../../store/slices/quotations/quotationSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { fetchImportProcess } from '../../../store/slices/processSlice';
import ImportDialog from '../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import { setQuotationsLoading, setQuotationsParams } from '../../../store/slices/quotations/quotationSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

function Quotations() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {quotations,quotationsCount,quotationsParams,quotationsLoading} = useSelector((store) => store.quotation);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchQuotations({activeCompany,params:quotationsParams}));
        });
    }, [activeCompany,quotationsParams,dispatch]);
      
    const columns = [
        { field: 'code', headerName: 'Teklif Kodu', flex:1, editable: true, renderCell: (params) => (
                <Link
                to={`/quotations/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'quick_quotation', headerName: 'Hızlı Teklif No', flex: 1 },
        { field: 'partner', headerName: 'Müşteri', flex: 3 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', flex: 1 },
        { field: 'kbm', headerName: 'KBM', flex: 1, type: 'number' },
        { field: 'currency', headerName: 'PB', flex: 1 },
        { field: 'status', headerName: 'Statü', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {
            const response = await axios.post(`/quotations/delete_all_quotations/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Teklif Listesi"
            rows={quotations}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={quotationsLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/quotations/add-quotation"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={quotations.length > 0 ? false : true}
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
                    onClick={() => dispatch(fetchQuotations({activeCompany,params:quotationsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={quotationsCount}
            checkboxSelection
            setParams={(value) => dispatch(setQuotationsParams(value))}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/quotations/quotations_template"
            importURL="/quotations/import_quotations/"
            startEvent={() => dispatch(setQuotationsLoading(true))}
            finalEvent={() => {dispatch(fetchQuotations({activeCompany}));dispatch(setQuotationsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/quotations/delete_quotations/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setQuotationsLoading(true))}
            finalEvent={() => {dispatch(fetchQuotations({activeCompany}));dispatch(setQuotationsLoading(false));}}
            />
        </PanelContent>
    )
}

export default Quotations
