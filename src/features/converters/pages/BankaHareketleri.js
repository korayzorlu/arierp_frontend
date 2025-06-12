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
import { fetchBankaHareketleri, setBankaHareketleriLoading, setBankaHareketleriParams } from '../../../store/slices/converters/bankaHareketleriSlice';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';

function BankaHareketleri() {
    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {bankaHareketleri,bankaHareketleriCount,bankaHareketleriParams,bankaHareketleriLoading} = useSelector((store) => store.bankaHareketi);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    const fetchData = async () => {
        await dispatch(fetchBankaHareketleri({activeCompany,params:bankaHareketleriParams})).unwrap();
        const response = await dispatch(fetchBankaHareketleri({activeCompany})).unwrap();
        //setItemsTotal(response.reduce((sum, item) => sum + Number(item.tutar), 0));
    };
    

     useEffect(() => {
        fetchData();
    }, [activeCompany,bankaHareketleriParams,dispatch]);

    const columns = [
        { field: 'gonderen_unvani', headerName: 'Gönderen Ünvanı', width: 400, editable: true, renderCell: (params) => (
                <Link
                to={`/banka-hareketleri/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'musteri_unvani', headerName: 'Müşteri Ünvanı', flex: 1 },
        { field: 'aciklama', headerName: 'Açıklama', flex: 4 },
        { field: 'ucuncu_sahis_mi', headerName: 'Üçüncü Şahıs mı?', flex: 1, renderCell: (params) => (
                params.value === true
                ?
                <Typography>Evet</Typography>
                :
                <></>
            )
        },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/converters/delete_all_banka_hareketleri/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    return (
        <PanelContent>
            <ListTableServer
            title={`Banka Hareketleri`}
            rows={bankaHareketleri}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={bankaHareketleriLoading}
            customButtons={
                <>  

                    <CustomTableButton
                    title="Import"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchBankaHareketleri({activeCompany,params:bankaHareketleriParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={bankaHareketleri.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Delete All"
                    onClick={handleAllDelete}
                    disabled={bankaHareketleri.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={bankaHareketleriCount}
            checkboxSelection
            setParams={(value) => dispatch(setBankaHareketleriParams(value))}
            getRowClassName={(params) => (params.row.ucuncu_sahis_mi ? 'true-row' : '')}
            sx={{
                '& .true-row': {
                backgroundColor: 'error.main',
                color: dark ? 'blackhole.main' : 'whitehole.main',
                '&:hover': {
                    backgroundColor: 'warning.main', // hover efekti
                },
                },
            }}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/partners/partners_template"
            importURL="/converters/import_banka_hareketleri/"
            startEvent={() => dispatch(setBankaHareketleriLoading(true))}
            finalEvent={() => {dispatch(fetchBankaHareketleri({activeCompany}));dispatch(setBankaHareketleriLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/converters/delete_banka_hareketleri/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setBankaHareketleriLoading(true))}
            finalEvent={() => {dispatch(fetchBankaHareketleri({activeCompany}));dispatch(setBankaHareketleriLoading(false));}}
            />
        </PanelContent>
    )
}

export default BankaHareketleri
