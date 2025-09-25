import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases } from '../../../store/slices/leasing/leaseSlice';
import { fetchContractInSuppliers, setContractInSuppliersLoading, setContractInSuppliersParams, updateContractOperationStatus } from '../../../store/slices/operation/contractInSupplierSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { setDialog, setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import { Button, Grid } from '@mui/material';
import ExportDialog from '../../../component/feedback/ExportDialog';
import DeleteDialog from '../../../component/feedback/DeleteDialog';
import Dialog from '../../../component/feedback/Dialog';

function ContractInSuppliers() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractInSuppliers,contractInSuppliersCount,contractInSuppliersParams,contractInSuppliersLoading} = useSelector((store) => store.contractInSupplier);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [rowSelectionModel, setRowSelectionModel] = useState({
        type: 'include',
        ids: new Set(),
    });

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractInSuppliers({activeCompany,params:contractInSuppliersParams}));
        });
    }, [activeCompany,contractInSuppliersParams,dispatch]);

    const columns = [
        { field: 'contract_id', headerName: 'ID', flex: 1 },
        { field: 'code', headerName: 'Sözleşme No', flex: 1 },
        { field: 'partner', headerName: 'Müşteri', flex: 2 },
        { field: 'partner_tc', headerName: 'Müşteri TC/VKN', flex: 1 },
        { field: 'quotation', headerName: 'Teklif', flex: 1 },
        { field: 'kof_tan_sozlesmeye_aktarim_tarihi', headerName: "Kof'tan Sözleşmeye Aktarım Tarihi", flex: 1 },
        { field: 'vendor', headerName: "Satıcı", flex: 3 },
        { field: 'project', headerName: "Proje", flex: 3 },
        { field: 'customer_representative', headerName: "Müşteri Temsilcisi", flex: 1 },
        { field: 'status', headerName: "Statü", flex: 1 },
    ]

    const handleUpdateContractOperationStatus = async () => {
        dispatch(setDialog(false));
        const response = await dispatch(updateContractOperationStatus({
            data: {
                uuids:Array.from(rowSelectionModel.ids),
                operationStatus:"islemde"
            }
        })).unwrap();
        if (response === "success"){
            dispatch(fetchContractInSuppliers({activeCompany,params:contractInSuppliersParams}));
        };
    };

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Tedarikçideki Sözleşmeler"
                autoHeight
                rows={contractInSuppliers}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={contractInSuppliersLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchContractInSuppliers({activeCompany,params:contractInSuppliersParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                customFiltersLeft={
                    <>
                        {
                            rowSelectionModel.ids.size > 0
                            ?
                                <Button
                                variant='contained'
                                color='primary'
                                size='small'
                                onClick={() => {dispatch(setDialog(true));}}
                                >
                                    İşleme Gönder
                                </Button>
                            :
                            null
                        } 
                    </>
                }
                rowCount={contractInSuppliersCount}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                noAllSelect
                setParams={(value) => dispatch(setContractInSuppliersParams(value))}
                headerFilters={true}
                apiRef={apiRef}
                />
            </Grid>
            <Dialog
            title="Seçili Kayıtları İşleme Gönder"
            text="Devam Etmek İstiyor musun?"
            onClick={handleUpdateContractOperationStatus}
            />
        </PanelContent>
    )
}

export default ContractInSuppliers
