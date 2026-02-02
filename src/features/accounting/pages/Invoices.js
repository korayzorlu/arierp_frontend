import { useGridApiRef } from '@mui/x-data-grid-premium';
import React, { useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainAccountCodes, fetchInvoices, resetInvoicesParams, setInvoicesParams, setInvoicesLoading } from '../../../store/slices/accounting/invoiceSlice';
import PanelContent from '../../../component/panel/PanelContent';
import { Grid } from '@mui/material';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { setExportDialog } from '../../../store/slices/notificationSlice';
import { fetchExportProcess } from '../../../store/slices/processSlice';
import ListTableServer from '../../../component/table/ListTableServer';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RefreshIcon from '@mui/icons-material/Refresh';
import SelectHeaderFilter from 'component/table/SelectHeaderFilter';
import DownloadIcon from '@mui/icons-material/Download';
import ExportDialog from 'component/feedback/ExportDialog';

function Invoices() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {invoices,invoicesCount,invoicesParams,invoicesLoading,mainAccountCodes,mainAccountCodesParams} = useSelector((store) => store.invoice);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const [isPending, startTransition] = useTransition();
    
    const [data, setData] = useState({})
    const [selectedItems, setSelectedItems] = useState({type: 'include',ids: new Set()});
    const [exportURL, setExportURL] = useState("")

    useEffect(() => {
        dispatch(resetInvoicesParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchInvoices({activeCompany,params:invoicesParams}));
        });
    }, [activeCompany,invoicesParams,dispatch]);

    const columns = [
        { field: 'lease', headerName: 'Kira Planı', width: 200 },
        { field: 'partner', headerName: 'Müşteri', width: 400 },
        { field: 'invoice_no', headerName: 'Fatura No',width: 200 },
        { field: 'amount', headerName: 'Tutar', width: 140 , type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', width: 100 },
        { field: 'date', headerName: 'Tarih', width: 150 },
    ]

    return (
        <PanelContent>
            <Grid container spacing={1}>
                <ListTableServer
                title="Fatura Listesi"
                rows={invoices}
                columns={columns}
                getRowId={(row) => row.uuid}
                loading={invoicesLoading}
                customButtons={
                    <>  
                        <CustomTableButton
                        title="Excel'e Aktar"
                        onClick={() => {dispatch(setExportDialog(true));dispatch(fetchExportProcess());setExportURL(`/leasing/export_active_leases/`)}}
                        icon={<DownloadIcon fontSize="small"/>}
                        />
                        <CustomTableButton
                        title="Yenile"
                        onClick={() => dispatch(fetchInvoices({activeCompany,params:invoicesParams})).unwrap()}
                        icon={<RefreshIcon fontSize="small"/>}
                        />
                    </>
                }
                noDownloadButton
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setSelectedItems(newRowSelectionModel);
                }}
                rowCount={invoicesCount}
                setParams={(value) => dispatch(setInvoicesParams(value))}
                headerFilters={true}
                />
            </Grid>
            <ExportDialog
            handleClose={() => dispatch(setExportDialog(false))}
            exportURL={exportURL}
            startEvent={() => dispatch(setInvoicesLoading(true))}
            finalEvent={() => {dispatch(fetchInvoices({activeCompany,params:invoicesParams}));dispatch(setInvoicesLoading(false));}}
            />
        </PanelContent>
    )
}

export default Invoices
