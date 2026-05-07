import axios from 'axios';
import React, { useEffect, useState, useTransition } from 'react'
import PanelContent from 'component/panel/PanelContent';
import CustomTableButton from 'component/table/CustomTableButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKepMonitorings, setKepMonitoringsLoading, setKepMonitoringsParams } from '../../../store/slices/operation/kepMonitoringSlice';
import { Link } from 'react-router-dom';
import { setAlert, setDeleteDialog, setDialog, setExportDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import ImportDialog from 'component/feedback/ImportDialog';
import DeleteDialog from 'component/feedback/DeleteDialog';
import { fetchExportProcess, fetchImportProcess } from '../../../store/slices/processSlice';
import { Chip, Stack } from '@mui/material';
import { capitalize } from 'lodash';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ListTableServer from 'component/table/ListTableServer';
import RefreshIcon from '@mui/icons-material/Refresh';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import StarIcon from '@mui/icons-material/Star';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import ExportDialog from 'component/feedback/ExportDialog';
import DownloadIcon from '@mui/icons-material/Download';
import { gridClasses } from '@mui/x-data-grid-premium';

function KepMonitorings() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {kepMonitorings,kepMonitoringsCount,kepMonitoringsParams,kepMonitoringsLoading} = useSelector((store) => store.kepMonitoring);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchKepMonitorings({activeCompany,params:kepMonitoringsParams}));
        });
    }, [activeCompany,kepMonitoringsParams,dispatch]);
      
    const columns = [
        { field: 'name', headerName: 'İsim', width: 400, editable: true, renderCell: (params) => (
                <Link
                to={`/partners/update/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'customerCode', headerName: 'Müşteri Kodu', width: 100, align: 'right', headerAlign: 'right' },
        { field: 'crmCode', headerName: 'CRM Kodu', width: 90, align: 'right', headerAlign: 'right' },
        { field: 'tcVknNo', headerName: 'TC/VKN No', width: 140, align: 'right', headerAlign: 'right' },
        { field: 'has_kep', headerName: 'Kep Var mı?', width: 100,
            renderCell: (params) => (
                <>
                    {params.value ? "Var" : ""}
                </>
            ),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'true', label: 'Var' },
                    { value: 'false', label: 'Yok' },
                ].sort((a, b) => a.label.localeCompare(b.label, 'tr'))}
                />
            )
        },
        { field: 'kep', headerName: 'Kep Adresi', width: 240 },
        { field: 'kep_expiry_date', headerName: 'Kep Bitiş Tarihi', width: 140},
        { field: 'last_contract_code', headerName: 'Son Sözleşme', width: 120, align: 'right', renderCell: (params) => (params.row.last_contract.contract_code)},
        { field: 'last_contract_date', headerName: 'Son Sözleşme Tarihi', width: 160, type: 'date', renderCell: (params) => (params.row.last_contract.activation_date),
            valueGetter: (value) => {
                if (!value) return null;
                const [day, month, year] = value.split('.');
                return new Date(year, month - 1, day);
            }
        },
        { field: 'last_lease_status', headerName: 'Son Sözleşme Statüsü', width: 160, renderCell: (params) => (params.row.last_contract.lease_status),
            renderHeaderFilter: (params) => (
                <SelectHeaderFilter
                {...params}
                label="Seç"
                externalValue="all"
                isServer
                options={[
                    { value: 'all', label: 'Tümü' },
                    { value: 'aktiflestirildi', label: 'Aktifleştirildi' },
                    { value: 'durduruldu', label: 'Durduruldu' },
                    { value: 'planlandi', label: 'Planlandı' },
                ].sort((a, b) => a.label.localeCompare(b.label, 'tr'))}
                />
            )
        },
        // { field: 'address', headerName: 'Adres', flex: 4, renderCell: (params) => (
        //     <>
        //         {params.value} {params.row.address2}
        //     </>
            
        // )
        // },
        // { field: 'email', headerName: 'Email', flex: 1 },
        // { field: 'phoneNumber', headerName: 'Tel', flex: 1 },
    ]

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/kepMonitorings/delete_all_kepMonitorings/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const handleTest = async () => {
        try {
            const response = await axios.post(`/kepMonitorings/test/`,
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
            title="Kep Takip Listesi"
            rows={kepMonitorings}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={kepMonitoringsLoading}
            customButtons={
                <>  

                    {/* <CustomTableButton
                    title="İçe Aktar"
                    onClick={() => {dispatch(setImportDialog(true));dispatch(fetchImportProcess());}}
                    icon={<UploadFileIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yeni"
                    link="/kepMonitorings/add-kepMonitoring"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    /> */}

                    {/* <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={kepMonitorings.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Tümünü Sil"
                    onClick={handleAllDelete}
                    disabled={user.email === "koray.zorlu@arileasing.com.tr" ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    /> */}

                    {/* <CustomTableButton
                    title="Permissions"
                    onClick={handleTest}
                    icon={<KeyIcon fontSize="small"/>}
                    /> */}
                    <CustomTableButton
                    title="Excel Hazırla ve İndir"
                    onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());}}
                    icon={<DownloadIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchKepMonitorings({activeCompany,params:kepMonitoringsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />

                    
                </>
            }
            noDownloadButton
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={kepMonitoringsCount}
            //checkboxSelection
            setParams={(value) => dispatch(setKepMonitoringsParams(value))}
            headerFilters={true}
            autoRowHeight
            sx={{
                [`& .${gridClasses.cell}`]: {
                    py: 1,
                },
            }}
            />
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/kepMonitorings/kepMonitorings_template"
            importURL="/kepMonitorings/import_kepMonitorings/"
            startEvent={() => dispatch(setKepMonitoringsLoading(true))}
            finalEvent={() => {dispatch(fetchKepMonitorings({activeCompany}));dispatch(setKepMonitoringsLoading(false));}}
            >

            </ImportDialog>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL="/kepMonitorings/export_kepMonitorings/"
            startEvent={() => dispatch(setKepMonitoringsLoading(true))}
            finalEvent={() => {dispatch(fetchKepMonitorings({activeCompany,params:kepMonitoringsParams}));dispatch(setKepMonitoringsLoading(false));}}
            />
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/kepMonitorings/delete_kepMonitorings/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setKepMonitoringsLoading(true))}
            finalEvent={() => {dispatch(fetchKepMonitorings({activeCompany}));dispatch(setKepMonitoringsLoading(false));}}
            />
        </PanelContent>
    )
}

export default KepMonitorings
