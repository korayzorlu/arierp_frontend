import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../../store/slices/notificationSlice';
import { fetchincomingPayments, setIncomingPaymentsLoading, setIncomingPaymentsParams } from '../../../../store/slices/accounting/paymentSlice';
import { Link } from 'react-router-dom';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImportDialog from '../../../../component/feedback/ImportDialog';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';

function IncomingPayments() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {incomingPayments,incomingPaymentsCount,incomingPaymentsParams,incomingPaymentsLoading} = useSelector((store) => store.payment);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchincomingPayments({activeCompany,params:incomingPaymentsParams}))
    }, [activeCompany,incomingPaymentsParams,dispatch]);

    const columns = [
        { field: 'date', headerName: 'Date', flex: 2 },
        { field: 'partner', headerName: 'Customer', flex: 15, editable: true, renderCell: (params) => (
                <Link
                to={`/payments/update/${params.row.type}/${params.row.uuid}/`}
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
            rows={incomingPayments}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={incomingPaymentsLoading}
            customButtons={
                <>
                    <CustomTableButton title="New" link="/payments/add-payment/incoming" icon={<AddBoxIcon fontSize="small"/>}/>
                    <CustomTableButton
                    title="Delete"
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon fontSize="small"/>}
                    disabled={incomingPayments.length > 0 ? false : true}
                    />
                    <CustomTableButton
                    title="Reload"
                    onClick={() => dispatch(fetchincomingPayments({activeCompany,params:incomingPaymentsParams}))}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={incomingPaymentsCount}
            setParams={(value) => {dispatch(setIncomingPaymentsParams(value));console.log(value)}}
            checkboxSelection
            ></ListTableServer>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/accounting/accounts_template"
            importURL="/accounting/import_payments/"
            startEvent={() => dispatch(setIncomingPaymentsLoading(true))}
            finalEvent={() => {dispatch(fetchincomingPayments({activeCompany}));dispatch(setIncomingPaymentsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/accounting/delete_payment/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setIncomingPaymentsLoading(true))}
            finalEvent={() => {dispatch(fetchincomingPayments({activeCompany}));dispatch(setIncomingPaymentsLoading(false));}}
            />
        </>
    )
}

export default IncomingPayments
