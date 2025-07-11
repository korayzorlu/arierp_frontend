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
    keepNonExistentRowsSelected,
    componentsProps,
    noPagination,
    noDownloadButton
  } = props;

  const {dark} = useSelector((store) => store.auth);




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
        No rows
      </Typography>
    </Box>
  );

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
  }));

  return (
    <TableContent height={height || null}>
      <StyledDataGridPremium
      slots={{
        toolbar: MUIToolbar,
        noRowsOverlay: NoRowsOverlay,
      }}
      showToolbar
      slotProps={{
          toolbar: {
              showQuickFilter: true,
              children: customButtons,
              title: title,
              noToolbarButtons: noToolbarButtons,
              noDownloadButton: noDownloadButton,
          },
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
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
          '--DataGrid-overlayHeight': '50vh',
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
      />
    </TableContent>
  )
}

export default ListTable
