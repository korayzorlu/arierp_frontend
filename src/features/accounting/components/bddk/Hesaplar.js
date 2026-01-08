import ListTable from 'component/table/ListTable';
import React, { startTransition, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBddkHesaplar, resetBddkHesaplarParams, setBddkHesaplarParams } from 'store/slices/accounting/bddkSlice';
import { fetchMainAccountCodes, fetchTrialBalances, resetTrialBalancesParams } from 'store/slices/accounting/trialBalanceSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import CustomTableButton from 'component/table/CustomTableButton';

function Hesaplar() {
     const {user} = useSelector((store) => store.auth);
     const {activeCompany} = useSelector((store) => store.organization);
     const {bddkHesaplar,bddkHesaplarCount,bddkHesaplarParams,bddkHesaplarLoading} = useSelector((store) => store.bddk);

     const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetBddkHesaplarParams());
    }, [activeCompany,dispatch]);

    useEffect(() => {
        startTransition(() => {
            dispatch(fetchBddkHesaplar({activeCompany}));
        });
    }, [activeCompany,bddkHesaplarParams,dispatch]);

    const columns = [
        { field: 'account_code', headerName: 'Skont', width: 200 },
        { field: 'total', headerName: 'Tutar', width: 200, type: 'number', renderHeaderFilter: () => null, valueFormatter: (value) =>
            new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(value)
        },
        { field: 'currency', headerName: 'PB', width: 200, renderHeaderFilter: () => null },
    ]

    return (
        <ListTable
        title=""
        height="calc(100vh - 150px)"
        rows={bddkHesaplar}
        columns={columns}
        getRowId={(row) => row.id}
        loading={bddkHesaplarLoading}
        customButtons={
            <>
                <CustomTableButton
                title="Yenile"
                onClick={() => dispatch(fetchBddkHesaplar({activeCompany})).unwrap()}
                icon={<RefreshIcon fontSize="small"/>}
                />
            </>
        }
        setParams={(value) => dispatch(setBddkHesaplarParams(value))}
        headerFilters={true}
        //noDownloadButton
        />
    )
}

export default Hesaplar
