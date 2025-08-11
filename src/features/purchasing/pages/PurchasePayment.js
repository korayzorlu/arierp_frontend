import React, { createRef, useEffect, useRef, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchasePayments, resetPurchasePaymentsParams, setPurchasePaymentsLoading, setPurchasePaymentsParams } from '../../../store/slices/purchasing/purchasePaymentSlice';
import { setAlert, setDeleteDialog, setImportDialog } from '../../../store/slices/notificationSlice';
import PanelContent from '../../../component/panel/PanelContent';
import ListTableServer from '../../../component/table/ListTableServer';
import CustomTableButton from '../../../component/table/CustomTableButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import ListTable from '../../../component/table/ListTable';

function PurchasePayments() {
    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {purchasePayments,purchasePaymentsCount,purchasePaymentsParams,purchasePaymentsLoading} = useSelector((store) => store.purchasePayment);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();

    const [isPending, startTransition] = useTransition();

    const [selectedItems, setSelectedItems] = useState([]);
    const [switchDisabled, setSwitchDisabled] = useState(false);
    const [switchPosition, setSwitchPosition] = useState(false);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchPurchasePayments({activeCompany,params:purchasePaymentsParams}));
        });
    }, [activeCompany,purchasePaymentsParams,dispatch]);

    const columns = [
        { field: 'contract', headerName: 'Sözleşme No', flex: 1 },
        { field: 'lease', headerName: 'Kira Planı', flex: 1 },
        { field: 'partner', headerName: 'Müşteri', flex: 1 },
        { field: 'vendor', headerName: 'Satıcı', flex: 1 },
        { field: 'total_contract_amount', headerName: 'Toplam Sözleşme Bedeli', flex: 1 },
        { field: 'total_vendor_payment', headerName: 'Satıcı Ödemeleri Toplam', flex: 1 },
        { field: 'before_total_payment', headerName: 'Ödeme Toplam Öncesi', flex: 1 },
        { field: 'purchasing', headerName: 'Satın Alma', flex: 1 },
    ]

    return (
        <PanelContent>
            <ListTableServer
            title="Satıcı Ödemeleri"
            rows={purchasePayments}
            columns={columns}
            getRowId={(row) => row.uuid}
            loading={purchasePaymentsLoading}
            customButtons={
                <>  
                    <CustomTableButton
                    title="Yenile"
                    onClick={() => dispatch(fetchPurchasePayments({activeCompany,params:purchasePaymentsParams})).unwrap()}
                    icon={<RefreshIcon fontSize="small"/>}
                    />
                </>
            }
            rowCount={purchasePaymentsCount}
            setParams={(value) => dispatch(setPurchasePaymentsParams(value))}
            headerFilters={true}
            />
        </PanelContent>
    )
}

export default PurchasePayments
