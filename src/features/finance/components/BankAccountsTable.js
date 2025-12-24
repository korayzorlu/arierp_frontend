import { Paper, Stack, Typography } from '@mui/material'
import ListTable from 'component/table/ListTable'
import React from 'react'
import { useSelector } from 'react-redux';

function BankAccountsTable(props) {
    const {bankAccountBalances,bankAccountBalancesCount,bankAccountBalancesLoading} = useSelector((store) => store.bankAccount);

    const bankAccountColumns = [
        { field: 'account_no', headerName: 'Hesap', flex: 2,
            renderCell: (params) => (
                params.value === "TOPLAM" 
                ?
                    (
                        <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                            <Typography variant="body2" color="text.secondary">
                                {params.value}
                            </Typography>
                        </Stack>
                    )
                :   
                    <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                        <Typography variant="body2" color="text.secondary">
                            {params.value}
                        </Typography>
                    </Stack>
            )
        },
        { field: 'balance', headerName: 'Bakiye', flex: 2, type: 'number',
            renderCell: (params) => (
                params.row.account_no === "TOPLAM" 
                ?
                    (
                        <Stack direction="row" spacing={1} sx={{alignItems: "center",height:'100%',}}>
                            <Typography variant="body2" sx={{fontWeight: 'bold', textAlign: 'right', width: '100%'}}>
                                {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)}
                            </Typography>
                        </Stack>
                    )
                :
                    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2,maximumFractionDigits: 2,}).format(params.value)
            ),
        },
    ]

    return (
        <Paper elevation={0} square={true} sx={{p: 1, height: '100%'}}>
            <ListTable
            title={
                <Typography variant="body2">
                    {props.title}
                </Typography>
            }
            autoHeight
            rows={props.rows}
            columns={bankAccountColumns}
            getRowId={(row) => row.id}
            loading={bankAccountBalancesLoading}
            noDownloadButton
            noColumnHeaders
            //noToolbar
            noToolbarButtons
            hideFooter
            />
        </Paper>
        
    )
}

export default BankAccountsTable
