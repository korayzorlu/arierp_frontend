import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSaleInvoices, setSaleInvoicesLoading, setSaleInvoicesParams } from '../../../../store/slices/accounting/invoiceSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../../store/slices/notificationSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportDialog from '../../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';
import RefreshIcon from '@mui/icons-material/Refresh';

function SaleInvoices() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {saleInvoices,saleInvoicesCount,saleInvoicesParams,saleInvoicesLoading} = useSelector((store) => store.invoice);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchSaleInvoices({activeCompany,params:saleInvoicesParams}))
    }, [activeCompany,saleInvoicesParams,dispatch]);

    const handleAllDelete = async () => {
        dispatch(setAlert({status:"info",text:"Removing items.."}));

        try {

            const response = await axios.post(`/partners/delete_all_partners/`,
                { withCredentials: true},
            );
        } catch (error) {
            dispatch(setAlert({status:error.response.data.status,text:error.response.data.message}));
        };
    };

    const columns = [
        { field: 'date', headerName: 'Date', flex: 2 },
        { field: 'partner', headerName: 'Customer', flex: 15, editable: true, renderCell: (params) => (
                <Link
                to={`/invoices/update/${params.row.type}/${params.row.uuid}/`}
                style={{textDecoration:"underline"}}
                >
                    {params.row.partner.name}
                </Link>
                
            )
        },
        { field: 'amount', headerName: 'Amount', flex: 2, type: 'number' },
        { field: 'currency', headerName: 'Currency', flex: 1 },
    ]

    return (
        <>
            <ListTableServer
            rows={saleInvoices}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={saleInvoicesLoading}
            customButtons={
                <>
                    <CustomTableButton title="New" link="/invoices/add-invoice/sale" icon={<AddBoxIcon fontSize="small"/>}/>
                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon fontSize="small"/>}
                    disabled={saleInvoices.length > 0 ? false : true}
                    />
                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchSaleInvoices({activeCompany,params:saleInvoicesParams}))}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={saleInvoicesCount}
            setParams={(value) => {dispatch(setSaleInvoicesParams(value));console.log(value)}}
            checkboxSelection
            ></ListTableServer>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/accounting/accounts_template"
            importURL="/accounting/import_invoices/"
            startEvent={() => dispatch(setSaleInvoicesLoading(true))}
            finalEvent={() => {dispatch(fetchSaleInvoices({activeCompany}));dispatch(setSaleInvoicesLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/accounting/delete_invoice/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setSaleInvoicesLoading(true))}
            finalEvent={() => {dispatch(fetchSaleInvoices({activeCompany}));dispatch(setSaleInvoicesLoading(false));}}
            />
        </>
    )
}

export default SaleInvoices
