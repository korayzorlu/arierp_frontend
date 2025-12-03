import React, { useCallback, useState, useTransition, useMemo } from 'react'
import TableContent from './TableContent'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import { DataGridPremium,  unstable_gridDefaultPromptResolver as promptResolver } from '@mui/x-data-grid-premium';
import MUIToolbar from './MUIToolbar';
import { Box, darken, lighten, styled, Typography } from '@mui/material';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import { useDispatch, useSelector } from 'react-redux';
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
    customFiltersLeft,
    headerFilters,
    onCellClick,
    autoHeight,
    initialState,
    rowSpanning,
    showCellVerticalBorder,
    showColumnVerticalBorder,
    rowSelectionModel,
    onProcessRowUpdateError,
    isRowSelected,
    keepNonExistentRowsSelected,
    noAllSelect,
    groupingColDef,
    getDetailPanelContent,
    getDetailPanelHeight,
    detailPanelExpandedRowIds,
    onDetailPanelExpandedRowIdsChange,
    processRowUpdate,
    disableMultipleRowSelection,
    noDownloadButton,
    disableVirtualization
  } = props;

  const {dark,lang} = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const [isPending, startTransition] = useTransition();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 })

  const [filterParams, setFilterParams] = useState({});
  const [filterModel, setFilterModel] = useState({ items: [], quickFilterValues: [] });

  const [sortModel, setSortModel] = useState([]);

  const debouncedSetParams = useCallback(debounce(setParams, 700), []);
  const debouncedSetFilterParams = useCallback(debounce(setFilterParams, 600), []);

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
    //dispatch(setPartnersParams({start:model.page * model.pageSize,end:(model.page+1) * model.pageSize}));
    setParams({start:model.page * model.pageSize,end:(model.page+1) * model.pageSize})
  };

  const handleSortModelChange = (model) => {
    setSortModel(model);

    if(model.length > 0){
      setParams({"ordering":model.sort === "asc" ? model[0].field : `-${model[0].field}`});
    }
    

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
    //console.log("filter model", model);
    //console.log("--------Start--------");
    setFilterModel(model);
    if(model.quickFilterValues && model.quickFilterValues.length > 0){
      //console.log("1");
      const value = model.quickFilterValues[model.quickFilterValues.length - 1];
      setFilterParams({ ...filterParams, "search[value]": value });
      debouncedSetParams({ "search[value]": value });
    } else if(model.quickFilterValues && model.quickFilterValues.length === 0 && model.items.length > 0){
      //console.log("2");
      const items = model?.items ?? [];
      items.forEach((item) => {
        //console.log("2-1");
        const isCodeLike = ['code','contract','lease'].includes(item.field);
        if (item.value) {
          //console.log("2-1-1");
          setFilterParams({
            ...filterParams,
            ...(isCodeLike ? { "search[value]": item.value } : { [item.field]: item.value })
          });
          if (isCodeLike) {
            //console.log("2-1-1-1");
            setParams({ "search[value]": item.value });
          } else {
            //console.log("2-1-1-2");
            debouncedSetParams({ [item.field]: item.value });
          }
        } else {
          //console.log("2-1-2");
          if (isCodeLike) {
            //console.log("2-1-2-1");
            setParams({ "search[value]": "" });
          } else {
            //console.log("2-1-2-2");
            setParams({ [item.field]: "" });
            setFilterParams(() => {Object.keys(filterParams).forEach(key => {filterParams[key] = ""})})
            const emptyParams = Object.keys(filterParams).reduce((acc, key) => {
              acc[key] = "";
              return acc;
            }, {});
            debouncedSetParams(emptyParams);
          }
        };
      });
    } else if(model.items && model.items.length === 0 && model.quickFilterValues.length === 0){
      //console.log("3");
      setFilterParams(() => {Object.keys(filterParams).forEach(key => {filterParams[key] = ""})})
      const emptyParams = Object.keys(filterParams).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});
      debouncedSetParams(emptyParams);
    } else {
      //console.log("4");
      const cleared = {};
      Object.keys(filterParams).forEach(key => { cleared[key] = "" });
      debouncedSetParams(cleared);
    }
    //console.log("--------Finish--------");
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      
    }
  };

  

  const NoRowsOverlay = () => (
    <Box sx={{mt: 2,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%'}}>
      <FolderOffIcon sx={{fontSize:'64px',color:'text.secondary'}}></FolderOffIcon>
      <Typography variant='body2' sx={{color:'text.secondary'}}>
        {lang === "tr" ? "Gösterilecek kayıt yok." : "No records to display."}
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

  const StyledDataGridPremium = useMemo(() => styled(DataGridPremium)(({ theme }) => ({
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
  })), []);

  return (
    <TableContent height={height} onKeyDown={handleKeyDown}>
      <StyledDataGridPremium
      slots={{
        toolbar: MUIToolbar,
        ...(noOverlay ? {} : { noRowsOverlay: NoRowsOverlay }),
        //aiAssistantPanel: GridAiAssistantPanel,
        headerFilterMenu: null,
        headerFilterCell: DataGrid.HeaderFilterCell,
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
              customFiltersLeft: customFiltersLeft,
              apiRef: apiRef,
              quickFilterProps: {
                quickFilterParser: (searchInput) => searchInput.split(',').map((value) => value.trim()),
                quickFilterFormatter: (quickFilterValues) => quickFilterValues.join(', '),
                debounceMs: 200,
              },
              noDownloadButton: noDownloadButton,
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
        ...initialState,
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
      sortModel={sortModel}
      onSortModelChange={(model) => handleSortModelChange(model)}
      onFilterModelChange={(model) => handleFilterModelChange(model)}
      rowCount={rowCount}
      loading={loading}
      checkboxSelection={checkboxSelection}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={onRowSelectionModelChange}
      isRowSelected={isRowSelected}
      keepNonExistentRowsSelected={keepNonExistentRowsSelected}
      disableMultipleRowSelection={disableMultipleRowSelection}
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
      //aiAssistant
      //onPrompt={processPrompt}
      excelExportOptions={excelExportOptions}
      cellSelection
      ignoreDiacritics
      localeText={{
        ...trTR.components.MuiDataGrid.defaultProps.localeText,
        filterOperatorContains: 'Ara', // "Şunu içerir" yazısını kaldır
        filterPanelInputLabel: "Filtrele", // Global label değişimi
        filterPanelInputPlaceholder: "Aramak için yazın...",
      }}
      onCellClick={onCellClick}
      rowSpanning={rowSpanning}
      showCellVerticalBorder={showCellVerticalBorder}
      showColumnVerticalBorder={showColumnVerticalBorder}
      onProcessRowUpdateError={onProcessRowUpdateError}
      groupingColDef={groupingColDef}
      getDetailPanelContent={getDetailPanelContent}
      getDetailPanelHeight={getDetailPanelHeight}
      detailPanelExpandedRowIds={detailPanelExpandedRowIds}
      onDetailPanelExpandedRowIdsChange={onDetailPanelExpandedRowIdsChange}
      processRowUpdate={processRowUpdate}
      density={density}
      disableVirtualization={disableVirtualization}
      />
    </TableContent>
  )
}

export default ListTableServer
