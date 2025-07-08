import React, { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import TableContent from './TableContent'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { DataGridPremium, GridRowsProp, GridColDef, unstable_gridDefaultPromptResolver as promptResolver, GridAiAssistantPanel, GridColumnMenuFilterItem, GridToolbarContainer } from '@mui/x-data-grid-premium';
import MUIToolbar from './MUIToolbar';
import { Box, darken, InputBase, lighten, styled, TextField, Typography } from '@mui/material';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { useDispatch } from 'react-redux';
import { setPartnersParams } from '../../store/slices/partners/partnerSlice';
import { debounce } from 'lodash';
import { trTR } from '@mui/x-data-grid/locales';

function ListTableServer(props) {
  const {
    height,
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
    rowCount,
    setParams,
    resetParams,
    apiRef,
    hideFooter,
    noOverlay,
    density,
    autoRowHeight,
    title,
    backButton,
    getRowClassName,
    sx,
    excelExportOptions,
    excelOptions,
    customFilters,
    headerFilters,
    onCellClick,
    autoHeight
  } = props;

  const dispatch = useDispatch();

  const [isPending, startTransition] = useTransition();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const [filterParams, setFilterParams] = useState({});
  const [filterModel, setFilterModel] = useState({ items: [], quickFilterValues: [] });

  const debouncedSetParams = useCallback(debounce(setParams, 700), []);
  const debouncedSetFilterParams = useCallback(debounce(setFilterParams, 600), []);

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
    //dispatch(setPartnersParams({start:model.page * model.pageSize,end:(model.page+1) * model.pageSize}));
    setParams({start:model.page * model.pageSize,end:(model.page+1) * model.pageSize})
  };

  const handleSortModelChange = (model) => {
    // dispatch(setPartnersParams(
    //   {
    //       ordering:model.length
    //       ?
    //           (
    //               model[0].sort === 'desc'
    //               ?
    //                   `-${model[0].field}`
    //               :
    //                   model[0].field
    //           )
    //       :
    //       ''
    //   }
    // ));
    setParams(
      {
        ordering:model.length
        ?
            (
                model[0].sort === 'desc'
                ?
                    `-${model[0].field}`
                :
                    model[0].field
            )
        :
        ''
      }
    );
  };

  const handleFilterModelChange = (model) => {
    setFilterModel(model);
    if(model.quickFilterValues && model.quickFilterValues.length > 0){
      model.quickFilterValues.forEach((item) => {
          //dispatch(setPartnersParams({"search[value]":item}));
          setFilterParams({...filterParams,"search[value]":item})
          setParams({"search[value]":item});

      });                                                                                                                                                 
    }else if(model.quickFilterValues && model.quickFilterValues.length === 0 && model.items.length > 0){
      model.items.forEach((item) => {
          if (item.value) {
            console.log("filtre değişti")
            //dispatch(setPartnersParams({[item.columnField]:item.value}));
            //setParams({[item.columnField]:item.value});
            setFilterParams({...filterParams,[item.field]:item.value})
            setParams({[item.field]:item.value});
          } else {
           // setFilterParams({...filterParams,[item.field]:""})
            setParams({[item.field]:""});
          };
      });
    } else if(model.items && model.items.length === 0 && model.quickFilterValues.length === 0){
      //dispatch(setPartnersParams({"search[value]":""}));
      setFilterParams(() => {Object.keys(filterParams).forEach(key => {filterParams[key] = ""})})
      const emptyParams = Object.keys(filterParams).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
      setParams(emptyParams);
    } else {
      setParams(() => {Object.keys(filterParams).forEach(key => {filterParams[key] = ""})});
    }
  };

  const debouncedHandleFilterModelChange =debounce(handleFilterModelChange, 800);

  const NoRowsOverlay = () => (
    <Box sx={{mt: 2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
      <FolderOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></FolderOffIcon>
      <Typography variant='body2' sx={{color:'text.secondary'}}>
        No rows
      </Typography>
    </Box>
  );

  function processPrompt(prompt, context, conversationId) {
    return promptResolver(
      'https://backend.mui.com/api/datagrid/prompt',
      prompt,
      context,
      conversationId,
    );
  }

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
    <TableContent height={height}>
      <StyledDataGridPremium
      slots={{
        toolbar: MUIToolbar,
        ...(noOverlay ? {} : { noRowsOverlay: NoRowsOverlay }),
        //aiAssistantPanel: GridAiAssistantPanel,
        headerFilterMenu: null,
      }}
      showToolbar
      slotProps={{
          toolbar: {
              showQuickFilter: true,
              children: customButtons,
              title: title,
              backButton: backButton,
              excelOptions: excelOptions,
              customFilters: customFilters,
              apiRef: apiRef,
              quickFilterProps: {
                quickFilterParser: (searchInput) => searchInput.split(',').map((value) => value.trim()),
                quickFilterFormatter: (quickFilterValues) => quickFilterValues.join(', '),
                debounceMs: 200,
              },
          },
          // loadingOverlay: {
          //   variant: 'linear-progress',
          //   noRowsVariant: 'linear-progress',
          // },
          headerFilterCell: {
            showClearIcon: true,
            InputComponentProps: { label: "Filter" }
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
      //onPaginationModelChange={(model) => setPaginationModel(model)}
      paginationMode="server"
      sortingMode="server"
      filterMode="server"
      filterModel={filterModel}   
      headerFilters={headerFilters}
      disableColumnFilter
      onPaginationModelChange={(model) => handlePaginationModelChange(model)}
      onSortModelChange={(model) => handleSortModelChange(model)}
      onFilterModelChange={(model) => debouncedHandleFilterModelChange(model)}
      rowCount={rowCount}
      loading={loading}
      checkboxSelection={checkboxSelection}
      disableRowSelectionOnClick={true}
      onRowSelectionModelChange={onRowSelectionModelChange}
      apiRef={apiRef}
      hideFooter={hideFooter}
      autoHeight={autoHeight}
      getRowHeight={() => autoRowHeight ? 'auto' : 'false'}
      getRowClassName = {getRowClassName}
      sx={{
          ...sx,
          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none',
          },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: 'none',
          },
          '--DataGrid-overlayHeight': `${noOverlay ? "unset" : "50vh"}`,
          [`.${gridClasses['columnHeader--filter']}`]: { px: 1 },
      }}
      //aiAssistant
      //onPrompt={processPrompt}
      excelExportOptions={excelExportOptions}
      cellSelection
      ignoreDiacritics
      localeText={{
        ...trTR.components.MuiDataGrid.defaultProps.localeText,
        filterOperatorContains: 'Ara', // "Şunu içerir" yazısını kaldır
      }}
      onCellClick={onCellClick}
      />
    </TableContent>
  )
}

export default ListTableServer
