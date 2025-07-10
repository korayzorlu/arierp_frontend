import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import TableContent from './TableContent';
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import MUIToolbar from './MUIToolbar';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { darken, lighten } from '@mui/material';
import { styled } from '@mui/system';

function BasicTable(props) {
    const {rows,columns,loading,customButtons,hiddenColumns,checkboxSelection,disableRowSelectionOnClick,title,getRowClassName,
      getDetailPanelContent,
    getDetailPanelHeight,
    detailPanelExpandedRowIds,
    onDetailPanelExpandedRowIdsChange,
    rowSelectionModel,
    onRowSelectionModelChange
    } = props;

    const [paginationModel, setPaginationModel] = useState({
        pageSize: 50,
        page: 0,
    });

    const getBackgroundColor = (color, theme, coefficient) => ({
      backgroundColor: darken(color, coefficient),
      ...theme.applyStyles('light', {
        backgroundColor: lighten(color, coefficient),
      }),
    });
  
    const StyledDataGridPremium = styled(DataGridPremium)(({ theme }) => ({
      '& .super-app-theme--overdue': {
        ...getBackgroundColor(theme.palette.error.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.error.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.error.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.error.main, theme, 0.4),
          },
        },
      },
    }));

    return (
        <TableContent height="auto">
            <StyledDataGridPremium
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
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={onRowSelectionModelChange}
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
            getRowClassName = {getRowClassName}
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={getDetailPanelHeight}
            detailPanelExpandedRowIds={detailPanelExpandedRowIds}
            onDetailPanelExpandedRowIdsChange={onDetailPanelExpandedRowIdsChange}
            />
        </TableContent>
    )
}

export default BasicTable
