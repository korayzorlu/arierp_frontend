import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases, resetLeasesParams, setLeasesLoading, setLeasesParams } from '../../../store/slices/leasing/leaseSlice';
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
import './Installments.css';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import { Chip, Grid, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function Leases() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchLeases({activeCompany,params:leasesParams}));
        });
    }, [activeCompany,leasesParams,dispatch]);

    const columns = [
        { field: 'code', headerName: 'Kira Planı Kodu', width:120, editable: true, renderCell: (params) => (
                <Link
                to={`/leasing/update/${params.row.uuid}/${params.row.contract}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.value}
                </Link>
                
            )
        },
        { field: 'contract', headerName: 'Sözleşme Kodu' },
        { field: 'partner', headerName: 'Müşteri', width:280, renderCell: (params) => (
                params.row.partner_special
                ?
                    <Grid container spacing={2}>
                        <Grid size={8}>
                            {params.value}
                        </Grid>
                        <Grid size={4}>
                            <Chip key={params.row.id} variant='outlined' color="neutral" icon={<StarIcon />} label="Özel" size='small'/>
                        </Grid>
                    </Grid>
                :
                    params.value
            )
        },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', width:160 },
        { field: 'activation_date', headerName: 'Aktifleştirme Tarihi', renderHeaderFilter: () => null },
        //{ field: 'quotation', headerName: 'Teklif No' },
        //{ field: 'kof', headerName: 'KOF No' },
        { field: 'project_name', headerName: 'Proje', width:280 },
        { field: 'block', headerName: 'Blok' },
        { field: 'unit', headerName: 'Bağımsız Bölüm' },
        //{ field: 'vade', headerName: 'Vade', type: 'number' },
        //{ field: 'vat', headerName: 'KDV(%)', type: 'number' },
        //{ field: 'musteri_baz_maliyet', headerName: 'Müşteri Baz Maliyet', type: 'number'},
        { field: 'overdue_amount', headerName: 'Gecikme Tutarı', width:160, type: 'number', renderHeaderFilter: () => null, cellClassName: (params) => {
                return params.value > 0 ? 'bg-red' : '';
            },
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB' },
        { field: 'overdue_days', headerName: 'Gecikme Süresi', width:120, type: 'number', renderHeaderFilter: () => null, renderCell: (params) => (
                params.row.overdue_amount > 0
                ?
                    params.value >= 0
                    ?
                        `${params.value} gün`
                    :
                        null
                :
                    null
                
            )
        },
        { field: 'status', headerName: 'Alt Statü', width:120 },
        { field: 'lease_status', headerName: 'Statü', width:120 },
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

    const handleChangeOverdue = async (value) => {
        dispatch(setLeasesParams({overdue_amount:value}));
        setSwitchPosition(value);
    };

    return (
        <PanelContent>
            <ListTableServer
            title="Kira Planları Listesi"
            autoHeight
            rows={leases}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={leasesLoading}
            customButtons={
                <>  
                    {/* <CustomTableButton
                    title="Yeni"
                    link="/leasing/add-lease"
                    disabled={activeCompany ? false : true}
                    icon={<AddBoxIcon fontSize="small"/>}
                    />

                    <CustomTableButton
                    title="Sil"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    disabled={leases.length > 0 ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    /> */}

                    {/* <CustomTableButton
                    title="Tümünü Sil"
                    onClick={handleAllDelete}
                    disabled={user.email === "korayzorllu@gmail.com" ? false : true}
                    icon={<DeleteIcon fontSize="small"/>}
                    /> */}

                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchLeases({activeCompany,params:leasesParams})).unwrap()}
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
            rowCount={leasesCount}
            checkboxSelection
            setParams={(value) => dispatch(setLeasesParams(value))}
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            headerFilters={true}
            apiRef={apiRef}
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
            selectedItems={apiRef.current ? apiRef.current.getSelectedRows().values() : []}
            startEvent={() => dispatch(setLeasesLoading(true))}
            finalEvent={() => {dispatch(fetchLeases({activeCompany}));dispatch(setLeasesLoading(false));}}
            />
        </PanelContent>
    )
}

export default Leases
