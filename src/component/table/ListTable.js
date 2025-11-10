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
  const {
    rows,
    columns,
    getRowId,
    loading,
    customButtons,
    hiddenColumns,
    checkboxSelection,
    disableRowSelectionOnClick,
    pageModel,
    onRowSelectionModelChange,
    title,
    headerFilters,
    rowCount,
    onCellClick,
    initialState,
    groupingColDef,
    autoHeight,
    rowSpanning,
    showCellVerticalBorder,
    showColumnVerticalBorder,
    getDetailPanelContent,
    getDetailPanelHeight,
    detailPanelExpandedRowIds,
    onDetailPanelExpandedRowIdsChange,
    height,
    outline,
    noToolbarButtons,
    getRowClassName,
    hideFooter,
    apiRef,
    rowSelectionModel,
    disableMultipleRowSelection,
    noAllSelect,
    isRowSelected,
    isRowSelectable,
    keepNonExistentRowsSelected,
    componentsProps,
    noPagination,
    noDownloadButton,
    processRowUpdate,
    onProcessRowUpdateError,
    specialButtons,
    noOverlay,
    sortModel,
    cellFontSize,
    pinnedRows,
    isCellEditable,
    disableLoadingOverlay,
    rowBuffer,
    columnBuffer,
    rowHeight,
    disableVirtualization,
    customFiltersLeft,
    density,
    columnGroupingModel,
    slotProps,
  } = props;

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
    <TableContent height={autoHeight ? 'auto' : (height || null)}>
      <StyledDataGridPremium
      slots={{
        toolbar: MUIToolbar,
        noRowsOverlay: noOverlay ? EmptyOverlay : NoRowsOverlay,
        ...(disableLoadingOverlay ? { loadingOverlay: EmptyOverlay } : {}),
      }}
      showToolbar
      slotProps={{
          ...slotProps,
          toolbar: {
              showQuickFilter: true,
              children: customButtons,
              title: title,
              noToolbarButtons: noToolbarButtons,
              noDownloadButton: noDownloadButton,
              specialButtons: specialButtons,
              customFiltersLeft: customFiltersLeft,
          },
          ...(disableLoadingOverlay
            ? {}
            : {
                loadingOverlay: {
                  variant: 'linear-progress',
                  noRowsVariant: 'linear-progress',
                },
              }
          ),
      }}
      columns={columns}
      rows={rows}
      getRowId={getRowId || ((row) => row.uuid)}
      initialState={{
          ...initialState,
          columns: {
            columnVisibilityModel: hiddenColumns,
          },
        }}
      pinnedRows={pinnedRows}
      rowBuffer={rowBuffer}
      columnBuffer={columnBuffer}
      rowHeight={rowHeight}
      disableVirtualization={disableVirtualization}
      pageSizeOptions={[25, 50, 100]}
      pagination={noPagination ? false : true}
      paginationModel={paginationModel}
      headerFilters={headerFilters}
      onPaginationModelChange={(model) => setPaginationModel(model)}
      loading={loading}
      disableMultipleRowSelection={disableMultipleRowSelection}
      checkboxSelection={checkboxSelection}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={onRowSelectionModelChange}
      isRowSelected={isRowSelected}
      isRowSelectable={isRowSelectable}
      isCellEditable={isCellEditable}
      keepNonExistentRowsSelected={keepNonExistentRowsSelected}
      rowCount={rowCount}
      autoHeight={autoHeight}
      //getRowHeight={() => 'auto'}
      sx={{
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
          '--DataGrid-overlayHeight': `${noOverlay ? "unset" : "50vh"}`,
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
          ...(noAllSelect
            ? {
                '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                  display: 'none'
                }
            }
            : {}
          ),
          ...(cellFontSize
            ?
              {
                '& .MuiDataGrid-cell': {
                  fontSize: cellFontSize,
                }
              }
            :
              {}

          )
          
      }}
      onCellClick={onCellClick}
      groupingColDef={groupingColDef}
      rowSpanning={rowSpanning}
      showCellVerticalBorder={showCellVerticalBorder}
      showColumnVerticalBorder={showColumnVerticalBorder}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      detailPanelExpandedRowIds={detailPanelExpandedRowIds}
      onDetailPanelExpandedRowIdsChange={onDetailPanelExpandedRowIdsChange}
      getRowClassName={getRowClassName}
      hideFooter={hideFooter}
      apiRef={apiRef}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
      sortModel={sortModel}
      density={density}
      columnGroupingModel={columnGroupingModel}
      />
    </TableContent>
  )
}

export default ListTable
