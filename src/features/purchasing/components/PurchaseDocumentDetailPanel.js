import { Box } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid-premium';
import ListTable from 'component/table/ListTable';
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPurchaseDocumentsParams } from 'store/slices/purchasing/purchaseDocumentSlice';

function PurchaseDocumentDetailPanel(props) {
    const {uuid, rows} = props;

    const {dark} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {purchaseDocumentItemLoading} = useSelector((store) => store.purchaseDocumentItem);

    const dispatch = useDispatch();
    const apiRef = useGridApiRef();
    const detailApiRefs = useRef({});

    const columns = [
        { field: 'description', headerName: 'Açıklama', flex:2 },
        { field: 'quantity', headerName: 'Miktar', width:80 },
        { field: 'unit_amount', headerName: 'Birim Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'amount', headerName: 'Toplam Tutar', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'vat_amount', headerName: 'KDV', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'total_amount', headerName: 'Genel Toplam', width:160, type: 'number', renderHeaderFilter: () => null,
            valueFormatter: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
    ]



    return (
        <Box sx={{ pt: 2, pb: 2, pl: 8, pr: 8, width:"70%" }}>
            <ListTable
            title={rows.length > 1 ? `${rows[0].purchase_document} Kira Planları` : ""}
            height="auto"
            autoHeight
            //density="compact"
            rows={rows}
            columns={columns}
            getRowId={(row) => row ? row.id : 0}
            loading={purchaseDocumentItemLoading}
            setParams={(value) => dispatch(setPurchaseDocumentsParams(value))}
            showCellVerticalBorder
            showColumnVerticalBorder
            outline
            noToolbarButtons
            getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            noPagination
            apiRef={apiRef}
            initialState={{
                aggregation: {
                    model: {
                        overdue_amount: 'sum',
                    },
                },
            }}
            />
        </Box>
    )
}

export default PurchaseDocumentDetailPanel
