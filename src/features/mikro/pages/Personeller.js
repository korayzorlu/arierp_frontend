import React, { useEffect, useState } from 'react'
import PanelContent from '../../../component/panel/PanelContent';
import axios from 'axios';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Personeller() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [database, setDatabase] = useState("MikroDB_V16_ESMS")
    const [open, setOpen] = useState(false)
    
    const fetchData = async () => {
        try {
            const response = await axios.get(`/mikro/api/personeller/?database=${database}`,
              {headers: {"X-Requested-With": "XMLHttpRequest"}}
            );
            setRows(response.data);
        } catch (error) {
            console.error("Veri çekilirken bir hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [database]);

    const changeData = (databaseTerm) => {
        setDatabase(databaseTerm);
        setLoading(true);
        setOpen(false);
    };

    const columns = [
        { field: 'tarih', headerName: 'Tarih', flex: 1},
        { field: 'isim', headerName: 'İsim', width: 150},
        { field: 'soyisim', headerName: 'Soyisim', width: 150},
        { field: 'girisTarihi', headerName: 'Giriş Tarihi', flex: 1},
        { field: 'cikisTarihi', headerName: 'Çıkış Tarihi', flex: 1},
        { field: 'cikisNeden', headerName: 'Çıkış Nedeni', width: 300},
        { field: 'ucret', headerName: 'Ücret', flex: 1 },
        { field: 'ikramiye', headerName: 'İkramiye', flex: 1 },
        { field: 'meslekKodu', headerName: 'Meslek Kodu', flex: 1 },
    ]

    return (
        <PanelContent>
            <ListTable
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            customButtons={
                <>
                    <CustomTableButton
                    icon={<KeyboardArrowDownIcon/>}
                    children={database}
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={() => setOpen(!open)}
                    >
                        {database}
                    </CustomTableButton>
                    <Menu
                        id="basic-menu"
                        open={open}
                        onClose={() => setOpen(false)}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                    >
                        <MenuItem onClick={() => changeData("MikroDB_V16_ESMS")}>ESMS</MenuItem>
                        <MenuItem onClick={() => changeData("MikroDB_V16_ESMS_MECHANICS")}>ESMS MECHANICS</MenuItem>
                        <MenuItem onClick={() => changeData("MikroDB_V16_NTG")}>NTG</MenuItem>
                    </Menu>
                </>
                
            }
            ></ListTable>
        </PanelContent>
    )
       
}

export default Personeller
