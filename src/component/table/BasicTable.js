import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import TableContent from './TableContent';
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import MUIToolbar from './MUIToolbar';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { darken, lighten } from '@mui/material';
import { styled } from '@mui/system';

function BasicTable(props) {

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
      '& .super-app-theme--matched': {
        ...getBackgroundColor(theme.palette.success.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.success.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.success.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.success.main, theme, 0.4),
          },
        },
      },
      '& .super-app-theme--processed': {
        ...getBackgroundColor(theme.palette.bluelemonade.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.bluelemonade.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.bluelemonade.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.bluelemonade.main, theme, 0.4),
          },
        },
      },
      '& .super-app-theme--tomorrow': {
        ...getBackgroundColor(theme.palette.info.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.info.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.info.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.info.main, theme, 0.4),
          },
        },
      },
      '& .super-app-theme--today': {
        ...getBackgroundColor(theme.palette.primary.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.primary.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.primary.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.primary.main, theme, 0.4),
          },
        },
      },
      '& .table-row-cream': {
        ...getBackgroundColor(theme.palette.cream.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.cream.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.cream.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.cream.main, theme, 0.4),
          },
        },
      },
      '& .table-row-celticglow': {
        ...getBackgroundColor(theme.palette.celticglow.main, theme, 0.7),
        '&:hover': {
          ...getBackgroundColor(theme.palette.celticglow.main, theme, 0.6),
        },
        '&.Mui-selected': {
          ...getBackgroundColor(theme.palette.celticglow.main, theme, 0.5),
          '&:hover': {
            ...getBackgroundColor(theme.palette.celticglow.main, theme, 0.4),
          },
        },
      },
      '& .super-app-theme--pinned-total .MuiDataGrid-cell': {
        color: theme.palette.primary.main,
        fontWeight: 600,
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
                    children: props.customButtons,
                    title:props.title,
                    noToolbarButtons: props.noToolbarButtons,
                    apiRef: props.apiRef,
                },
                loadingOverlay: {
                  variant: 'linear-progress',
                  noRowsVariant: 'linear-progress',
                },
              }}
            columns={props.columns}
            rows={props.rows}
            initialState={{
              ...props.initialState,
              columns: {
                columnVisibilityModel: props.hiddenColumns,
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            loading={props.loading}
            checkboxSelection={props.checkboxSelection}
            disableRowSelectionOnClick={props.disableRowSelectionOnClick}
            rowSelectionModel={props.rowSelectionModel}
            onRowSelectionModelChange={props.onRowSelectionModelChange}
            autoHeight
            sx={{
                ...props.sx,
                [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
                  outline: 'none',
                },
                [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
                  {
                    outline: 'none',
                  },
            }}
            getRowClassName = {props.getRowClassName}
            getDetailPanelContent={props.getDetailPanelContent}
            getDetailPanelHeight={props.getDetailPanelHeight}
            detailPanelExpandedRowIds={props.detailPanelExpandedRowIds}
            onDetailPanelExpandedRowIdsChange={props.onDetailPanelExpandedRowIdsChange}
            apiRef={props.apiRef}
            noToolbarButtons={props.noToolbarButtons}
            getRowId={props.getRowId || ((row) => row.uuid)}
            density={props.density}
            getRowHeight={() => props.autoRowHeight ? 'auto' : 'false'}
            />
        </TableContent>
    )
}

export default BasicTable
