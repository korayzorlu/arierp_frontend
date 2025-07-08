import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstallments, setInstallmentsLoading, setInstallmentsParams } from '../../../store/slices/leasing/installmentSlice';
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
import AndroidSwitch from '../../../component/switch/AndroidSwitch';
import { darken, Grid, lighten, styled, Typography } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import './Installments.css';

function Installment() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {installments,installmentsCount,installmentsParams,installmentsLoading} = useSelector((store) => store.installment);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

    useEffect(() => {
        console.log(installmentsParams)
        startTransition(() => {
            dispatch(fetchInstallments({activeCompany,params:installmentsParams}));
        });
    }, [activeCompany,installmentsParams,dispatch]);

    


    const columns = [
        { field: 'lease', headerName: 'Kira Planı Kodu', flex:1, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'contract', headerName: 'Sözleşme No', flex: 1 },
        { field: 'partner', headerName: 'Müşteri', flex: 1 },
        { field: 'partner_tc', headerName: 'TC/VKN', flex: 1 },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', flex: 1 },
        { field: 'project', headerName: 'Proje', flex: 1 },
        { field: 'block', headerName: 'Blok', flex: 1 },
        { field: 'unit', headerName: 'Bağ. Bölüm', flex: 1 },
        { field: 'payment_date', headerName: 'Ödeme Tarihi', flex: 1 },
        { field: 'vat', headerName: 'Vergi Oranı', flex: 1, type: 'number' },
        { field: 'amount', headerName: 'Taksit', flex: 1, type: 'number' },
        { field: 'paid', headerName: 'Toplam Ödeme', flex: 1, type: 'number' },
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', flex: 1, type: 'number'},
        { field: 'principal', headerName: 'Ana Para', flex: 1, type: 'number' },
        { field: 'interest', headerName: 'Faiz', flex: 1, type: 'number' },
        { field: 'sequency', headerName: 'Sıra No', flex: 1, type: 'number' },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/leasing/delete_all_installments/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const handleChangeOverdue = async (value) => {
        dispatch(setInstallmentsParams({overdue_amount:value}))
        setSwitchPosition(value);
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Kira Planları Taksit Listesi"
            autoHeight
            rows={installments}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={installmentsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/leasing/add-installment"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={installments.length > 0 ? false : true}
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
                    onClick={() => dispatch(fetchInstallments({activeCompany,params:installmentsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            customFilters={
                <>
                    <AndroidSwitch
                    label="Tahsilatı Beklenenler"
                    checked={switchPosition}
                    onChange={(value) => handleChangeOverdue(value)}
                    disabled={switchDisabled}
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={installmentsCount}
            checkboxSelection
            setParams={(value) => dispatch(setInstallmentsParams(value))}
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/leasing/installments_template"
            importURL="/leasing/import_installments/"
            startEvent={() => dispatch(setInstallmentsLoading(true))}
            finalEvent={() => {dispatch(fetchInstallments({activeCompany}));dispatch(setInstallmentsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/leasing/delete_installments/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setInstallmentsLoading(true))}
            finalEvent={() => {dispatch(fetchInstallments({activeCompany}));dispatch(setInstallmentsLoading(false));}}
            />
        </PanelContent>
    )
}

export default Installment
