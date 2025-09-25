import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeases } from '../../../store/slices/leasing/leaseSlice';
import { fetchContractInArchives, setContractInArchivesLoading, setContractInArchivesParams } from '../../../store/slices/operation/contractInArchiveSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import { Grid } from '@mui/material';
import ExportDialog from '../../../component/feedback/ExportDialog';

function ContractInArchives() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {contractInArchives,contractInArchivesCount,contractInArchivesParams,contractInArchivesLoading} = useSelector((store) => store.contractInArchive);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchContractInArchives({activeCompany,params:contractInArchivesParams}));
        });
    }, [activeCompany,contractInArchivesParams,dispatch]);

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

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Arşivdeki Sözleşmeler"
                autoHeight
                rows={contractInArchives}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={contractInArchivesLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchContractInArchives({activeCompany,params:contractInArchivesParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                rowCount={contractInArchivesCount}
                setParams={(value) => dispatch(setContractInArchivesParams(value))}
                headerFilters={true}
                apiRef={apiRef}
                />
            </Grid>
        </PanelContent>
    )
}

export default ContractInArchives
