import { Box, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import BasicTable from '../../../component/table/BasicTable';
import { fetchTradeTransactionsInLease } from '../../../store/slices/trade/tradeTransactionSlice';
import TradeTransactionDialog from '../../../component/dialog/TradeTransactionDialog';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function OverdueDetailDetailPanel(props) {
    const {leaseOverdues} = props;

    const {user} = useSelector((store) => store.auth);
    const {activeCompany} = useSelector((store) => store.organization);
    const {leases,leasesCount,leasesParams,leasesLoading} = useSelector((store) => store.lease);





    const columns = [
        { field: 'overdue_0_30', headerName: '0 - 30', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_31_60', headerName: '31 - 60', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_61_90', headerName: '61 - 90', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_91_120', headerName: '91 - 120', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_121_150', headerName: '121 - 150', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_151_180', headerName: '151 - 180', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'overdue_181_gte', headerName: '181>', flex: 1, type: 'number', valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
    ]

    return (
        <Box sx={{ pt: 2, pb: 2, pl: 8, pr: 8 }}>
            <BasicTable
            //title={`Kira Planı - ${overdueInformation ? overdueInformation.length > 0 ? overdueInformation[0]["lease"] : "" : ""}`}
            title="Vadesi Geçmiş Borçlar"
            rows={leaseOverdues}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick={true}
            noToolbarButtons
            //getRowClassName={(params) => `super-app-theme--${params.row.overdue_amount > 0 ? "overdue" : ""}`}
            />
            
        </Box>
    )
}

export default OverdueDetailDetailPanel
