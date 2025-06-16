import React, { useState } from 'react'
import TableContent from './TableContent'
import { ThemeProvider } from '@emotion/react'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { useSelector } from 'react-redux';
import MUIToolbar from './MUIToolbar';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Row from '../grid/Row';
import Col from '../grid/Col';
import { grey } from '@mui/material/colors';
import { Box, Typography } from '@mui/material';
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
    title
  } = props;

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

  return (
    <TableContent>
      <DataGridPremium
      slots={{
        toolbar: MUIToolbar,
        noRowsOverlay: NoRowsOverlay
      }}
      showToolbar
      slotProps={{
          toolbar: {
              showQuickFilter: true,
              children: customButtons,
              title: title,
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
          columns: {
            columnVisibilityModel: hiddenColumns,
          },
        }}
      pageSizeOptions={[25, 50, 100]}
      pagination
      paginationModel={paginationModel}
      onPaginationModelChange={(model) => setPaginationModel(model)}
      loading={loading}
      checkboxSelection={checkboxSelection || true}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      onRowSelectionModelChange={onRowSelectionModelChange}
      autoHeight
      //getRowHeight={() => 'auto'}
      sx={{
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: 'none',
          },
          '--DataGrid-overlayHeight': '50vh'
      }}
      />
    </TableContent>
  )
}

export default ListTable
