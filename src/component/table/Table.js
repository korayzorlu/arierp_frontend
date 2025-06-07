import { DataGrid } from '@mui/x-data-grid';
import { useMockServer } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';

function Table(props) {
    const {id,columns,rows} = props;

    function customCheckbox(theme) {
        return {
          '& .MuiCheckbox-root svg': {
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            border: '1px solid #d9d9d9',
            borderRadius: 2,
            ...theme.applyStyles('dark', {
              borderColor: 'rgb(67, 67, 67)',
            }),
          },
          '& .MuiCheckbox-root svg path': {
            display: 'none',
          },
          '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
          },
          '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
            position: 'absolute',
            display: 'table',
            border: '2px solid #fff',
            borderTop: 0,
            borderLeft: 0,
            transform: 'rotate(45deg) translate(-50%,-50%)',
            opacity: 1,
            transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
            content: '""',
            top: '50%',
            left: '39%',
            width: 5.71428571,
            height: 9.14285714,
          },
          '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
            width: 8,
            height: 8,
            backgroundColor: '#1890ff',
            transform: 'none',
            top: '39%',
            border: 0,
          },
        };
    }

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        border: 0,
        borderRadius:0,
        color: 'rgba(255,255,255,0.85)',
        backgroundColor: "#fff",
        WebkitFontSmoothing: 'auto',
        letterSpacing: 'normal',
        '& .MuiDataGrid-columnsContainer': {
          backgroundColor: '#1d1d1d',
          ...theme.applyStyles('light', {
            backgroundColor: '#fafafa',
          }),
        },
        '& .MuiDataGrid-iconSeparator': {
          display: 'none',
        },
        '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
          borderRight: '1px solid #303030',
          ...theme.applyStyles('light', {
            borderRightColor: '#f0f0f0',
          }),
        },
        '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
          borderBottom: '1px solid #303030',
          ...theme.applyStyles('light', {
            borderBottomColor: '#f0f0f0',
          }),
        },
        '& .MuiDataGrid-cell': {
          color: 'rgba(255,255,255,0.65)',
          ...theme.applyStyles('light', {
            color: 'rgba(0,0,0,.85)',
          }),
        },
        '& .MuiPaginationItem-root': {
          borderRadius: 0,
        },
        ...customCheckbox(theme),
        ...theme.applyStyles('light', {
          color: 'rgba(0,0,0,.85)',
        }),
    }));

    return ( 
        <table id={id} className="table">
            <thead>
                <tr>
                    {
                        columns.map((column,index) => {
                            return <th className="p-2" key={index}>{column.title}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody id="tbody">
                    {
                        rows.map((row,index) => {
                            return (
                                <tr>
                                    <td className="p-2" key={index}>{row.cell}</td>
                                    <td className="p-2" key={index}>{row.cell}</td>
                                    <td className="p-2" key={index}>{row.cell}</td>

                                </tr>
                                
                            )
                        })
                    }
            </tbody>
        </table>
    );
}

export default Table;