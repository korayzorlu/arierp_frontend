import React, { useRef, useState } from 'react'
import TableContent from './TableContent'
import { ThemeProvider } from '@emotion/react'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useSelector } from 'react-redux';
import MUIToolbar from './MUIToolbar';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Row from '../grid/Row';
import Col from '../grid/Col';
import { grey } from '@mui/material/colors';
import { Box, Checkbox, darken, lighten, styled, Typography } from '@mui/material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import AriCheckBox from 'component/checkbox/AriCheckBox';

// Hoisted helpers to avoid recreating styled component each render (prevents jank flicker)
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
  '& .super-app-theme--pinned-total .MuiDataGrid-cell': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

function ListTable(props) {
  const {dark,lang} = useSelector((store) => store.auth);

  const [paginationModel, setPaginationModel] = useState(
    {
      pageSize: 50,
      page: 0,
    }
  );

  const NoRowsOverlay = () => (
    <Box sx={{mt: 2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
      <FolderOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></FolderOffIcon>
      <Typography variant='body2' sx={{color:'text.secondary'}}>
        {lang === "tr" ? "Gösterilecek kayıt yok." : "No records to display."}
      </Typography>
    </Box>
  );

  const EmptyOverlay = () => null;

  

  return (
    <TableContent height={props.height}>
      <StyledDataGridPremium
      slots={{
        toolbar: props.noToolbar ? () => null : MUIToolbar,
        noRowsOverlay: props.noOverlay ? EmptyOverlay : NoRowsOverlay,
        baseCheckbox: AriCheckBox,
        ...(props.disableLoadingOverlay ? { loadingOverlay: EmptyOverlay } : {}),
        columnHeaders: props.noColumnHeaders ? () => null : undefined,
      }}
      showToolbar
      slotProps={{
          ...props.slotProps,
          toolbar: {
              showQuickFilter: true,
              children: props.customButtons,
              title: props.title,
              noToolbarButtons: props.noToolbarButtons,
              noDownloadButton: props.noDownloadButton,
              specialButtons: props.specialButtons,
              customFiltersLeft: props.customFiltersLeft,
          },
          ...(props.disableLoadingOverlay
            ? {}
            : {
                loadingOverlay: {
                  variant: 'linear-progress',
                  noRowsVariant: 'linear-progress',
                },
              }
          ),
      }}
      columns={props.columns}
      rows={props.rows}
      getRowId={props.getRowId || ((row) => row.uuid)}
      initialState={{
          ...props.initialState,
          columns: {
            columnVisibilityModel: props.hiddenColumns,
          },
        }}
      pinnedRows={props.pinnedRows}
      rowBuffer={props.rowBuffer}
      columnBuffer={props.columnBuffer}
      rowHeight={props.rowHeight}
      disableVirtualization={props.disableVirtualization}
      pageSizeOptions={props.pageSizeOptions || [25, 50, 100]}
      pagination={props.noPagination ? false : true}
      paginationModel={paginationModel}
      autoPageSize={props.autoPageSize}
      headerFilters={props.headerFilters}
      onPaginationModelChange={(model) => setPaginationModel(model)}
      loading={props.loading}
      disableMultipleRowSelection={props.disableMultipleRowSelection}
      checkboxSelection={props.checkboxSelection}
      disableRowSelectionOnClick={props.disableRowSelectionOnClick}
      rowSelectionModel={props.rowSelectionModel}
      onRowSelectionModelChange={props.onRowSelectionModelChange}
      isRowSelected={props.isRowSelected}
      isRowSelectable={props.isRowSelectable}
      isCellEditable={props.isCellEditable}
      keepNonExistentRowsSelected={props.keepNonExistentRowsSelected}
      rowCount={props.rowCount}
      autoHeight={props.autoHeight}
      getRowHeight={props.getRowHeight}
      //getRowHeight={() => 'auto'}
      sx={{...props.sx,
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: 'none',
            },
            // Pinned toplam satırını veri satırlarının hemen altında göstermek için
            // virtual scroller içerik alt boşluğunu kapat ve pinned rows'u akışa al
            '& .MuiDataGrid-virtualScrollerContent': {
              marginBottom: '0px !important',
              paddingBottom: '0px !important',
            },
            '& .MuiDataGrid-pinnedRows, & .MuiDataGrid-pinnedRowsBottom': {
              position: 'static !important',
              bottom: 'auto !important',
              transform: 'none !important',
              boxShadow: 'none !important',
              zIndex: 'auto !important',
            },
            '& .MuiDataGrid-footerContainer': {
              paddingTop: 0,
              marginTop: 0,
            },
            '--DataGrid-overlayHeight': `${props.noOverlay ? "unset" : "50vh"}`,
            '& .MuiDataGrid-columnHeader': {
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                overflow: 'visible',
              },
              '& .MuiDataGrid-columnHeaderTitleContainerContent': {
                position: 'sticky',
                left: 8,
              },
            },
            '& .MuiDataGrid-root': {
              border: 1,
              borderColor: dark ? 'rgba(81,81,81,1)' : 'rgba(224,224,224,1)'
            },
            '& .ColumnGroupingModel .MuiDataGrid-columnHeaderTitleContainer': {
              justifyContent: 'center',
            },
          ...(!dark
            ? {
                '& .MuiDataGrid-detailPanel': {
                  backgroundColor: '#ECEAE6',
                },
              }
            : {}
          ),
          ...(props.noAllSelect
            ? {
                '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                  display: 'none'
                }
            }
            : {}
          ),
          ...(props.cellFontSize
            ?
              {
                '& .MuiDataGrid-cell': {
                  fontSize: props.cellFontSize,
                }
              }
            :
              {}

          )
          
      }}
      onCellClick={props.onCellClick}
      groupingColDef={props.groupingColDef}
      rowSpanning={props.rowSpanning}
      showCellVerticalBorder={props.showCellVerticalBorder}
      showColumnVerticalBorder={props.showColumnVerticalBorder}
      getDetailPanelContent={props.getDetailPanelContent}
      getDetailPanelHeight={props.getDetailPanelHeight}
      detailPanelExpandedRowIds={props.detailPanelExpandedRowIds}
      onDetailPanelExpandedRowIdsChange={props.onDetailPanelExpandedRowIdsChange}
      getRowClassName={props.getRowClassName}
      hideFooter={props.hideFooter}
      apiRef={props.apiRef}
      processRowUpdate={props.processRowUpdate}
      onProcessRowUpdateError={props.onProcessRowUpdateError}
      sortModel={props.sortModel}
      density={props.density}
      columnGroupingModel={props.columnGroupingModel}
      lazyLoading={props.lazyLoading}
      disableColumnFilter={props.disableColumnFilter}
      />
    </TableContent>
  )
}

export default ListTable
