import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import TableContent from './TableContent';
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import MUIToolbar from './MUIToolbar';

function BasicTable(props) {
    const {rows,columns,loading,customButtons,hiddenColumns,checkboxSelection,disableRowSelectionOnClick,title} = props;

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 50,
        page: 0,
    });

    return (
        <TableContent height="auto">
            <DataGrid
            slots={{ toolbar: MUIToolbar}}
            showToolbar
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    children: customButtons,
                    title:title,
                },
                loadingOverlay: {
                  variant: 'linear-progress',
                  noRowsVariant: 'linear-progress',
                },
              }}
            columns={columns}
            rows={rows}
            initialState={{
                columns: {
                  columnVisibilityModel: hiddenColumns,
                },
              }}
            pageSizeOptions={[25, 50, 100]}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            loading={loading}
            checkboxSelection={checkboxSelection}
            disableRowSelectionOnClick={disableRowSelectionOnClick}
            autoHeight
            sx={{
                [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                  outline: 'none',
                },
                [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                  {
                    outline: 'none',
                  },
            }}
            />
        </TableContent>
    )
}

export default BasicTable
