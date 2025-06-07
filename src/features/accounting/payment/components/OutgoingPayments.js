import React, { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchincomingPayments, fetchOutgoingPayments, setOutgoingPaymentsLoading, setOutgoingPaymentsParams } from '../../../../store/slices/accounting/paymentSlice';
import { Link } from 'react-router-dom';
import ListTableServer from '../../../../component/table/ListTableServer';
import CustomTableButton from '../../../../component/table/CustomTableButton';
import { setDeleteDialog, setImportDialog } from '../../../../store/slices/notificationSlice';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteDialog from '../../../../component/feedback/DeleteDialog';
import ImportDialog from '../../../../component/feedback/ImportDialog';

function OutgoingPayments() {
    const {activeCompany} = useSelector((store) => store.organization);
    const {outgoingPayments,outgoingPaymentsCount,outgoingPaymentsParams,outgoingPaymentsLoading} = useSelector((store) => store.payment);

    const dispatch = useDispatch();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchOutgoingPayments({activeCompany,params:outgoingPaymentsParams}))
    }, [activeCompany,outgoingPaymentsParams,dispatch]);

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
            rows={outgoingPayments}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={outgoingPaymentsLoading}
            customButtons={
                <>
                    <CustomTableButton link="/payments/add-payment/outgoing" icon={<AddBoxIcon/>} children="NEW"/>
                    <CustomTableButton
                    onClick={() => dispatch(setDeleteDialog(true))}
                    icon={<DeleteIcon/>}
                    disabled={outgoingPayments.length > 0 ? false : true}
                    children="DELETE"
                    />
                    <CustomTableButton
                    onClick={() => dispatch(fetchOutgoingPayments({activeCompany,params:outgoingPaymentsParams}))}
                    icon={<RefreshIcon/>}
                    children="RELOAD"
                    />
                </>
            }
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setSelectedItems(newRowSelectionModel);
            }}
            rowCount={outgoingPaymentsCount}
            setParams={(value) => {dispatch(setOutgoingPaymentsParams(value));console.log(value)}}
            checkboxSelection
            ></ListTableServer>
            <ImportDialog
            handleClose={() => dispatch(setImportDialog(false))}
            templateURL="/accounting/accounts_template"
            importURL="/accounting/import_payments/"
            startEvent={() => dispatch(setOutgoingPaymentsLoading(true))}
            finalEvent={() => {dispatch(fetchOutgoingPayments({activeCompany}));dispatch(setOutgoingPaymentsLoading(false));}}
            >

            </ImportDialog>
            <DeleteDialog
            handleClose={() => dispatch(setDeleteDialog(false))}
            deleteURL="/accounting/delete_payment/"
            selectedItems={selectedItems}
            startEvent={() => dispatch(setOutgoingPaymentsLoading(true))}
            finalEvent={() => {dispatch(fetchOutgoingPayments({activeCompany}));dispatch(setOutgoingPaymentsLoading(false));}}
            />
        </>
    )
}

export default OutgoingPayments
