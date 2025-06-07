import { GridActionsCellItem } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PanelContent from '../../../component/panel/PanelContent';
import ListTable from '../../../component/table/ListTable';
import CustomTableButton from '../../../component/table/CustomTableButton';
import { Button, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

function CariHesapHareketleri() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const [database, setDatabase] = useState("MikroDB_V16_ESMS")
    const [open, setOpen] = useState(false)
    const [vpnDisable, setVpnDisable] = useState(false)
    const [vpnTaskId, setVpnTaskId] = useState("")
    const [vpnStatus, setVpnStatus] = useState("")
    
    const fetchData = async () => {
        try {
            const response = await axios.get(`/mikro/api/cari_hesap_hareketleri/?database=${database}`,
                {
                    headers: {"X-Requested-With": "XMLHttpRequest"},
                }
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

    const fetchVpnStatus = async () => {
        setLoading(true);
        setVpnDisable(true);
        try {
            const response = await axios.post(`/mikro/get_vpn_status/`,
                {
                    id : vpnTaskId
                },
                {headers: {"X-Requested-With": "XMLHttpRequest"}}
            );
            setVpnDisable(true);
            setVpnStatus(response.data.status)
        } catch (error) {
            console.error("Veri çekilirken bir hata oluştu:", error);
            setVpnDisable(false);
        } finally {
            setLoading(false);
            setVpnDisable(false);
        }
    };

    const handleSetVpn = async () => {
        setLoading(true);
        setVpnDisable(true);
        try {
            const response = await axios.get(`/mikro/set_vpn/`,
              {headers: {"X-Requested-With": "XMLHttpRequest"}}
            );
            setVpnDisable(true);
            setVpnTaskId(response.data.taskId)
        } catch (error) {
            console.error("Veri çekilirken bir hata oluştu:", error);
            setVpnDisable(false);
        } finally {
            setLoading(false);
            setVpnDisable(false);
        }
    };

    // useEffect(() => {
    //     fetchVpnStatus();
    // }, [vpnTaskId]);

    const columns = [
        { field: 'tarih', headerName: 'Tarih', flex: 1},
        { field: 'cari', headerName: 'Cari', width: 350},
        { field: 'evrakTip', headerName: 'Evrak Tipi', flex: 1},
        { field: 'belgeTarih', headerName: 'Belge Tarihi', flex: 1},
        { field: 'belgeNo', headerName: 'Belge No', flex: 1},
        { field: 'aciklama', headerName: 'Açıklama', width: 300},
        { field: 'doviz', headerName: 'Döviz', flex: 1},
        { field: 'meblag', headerName: 'Meblağ', flex: 1 },
        { field: 'araToplam', headerName: 'Ara Toplam', flex: 1 },
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
                        <MenuItem onClick={() => changeData("MikroDB_V16_ESMS")}>MikroDB_V16_ESMS</MenuItem>
                        <MenuItem onClick={() => changeData("MikroDB_V16_ESMS_MECHANICS")}>MikroDB_V16_ESMS MECHANICS</MenuItem>
                        <MenuItem onClick={() => changeData("MikroDB_V16_NTG")}>MikroDB_V16_NTG</MenuItem>
                    </Menu>
                    <CustomTableButton
                    icon={<WifiOffIcon color="error"/>}
                    onClick={() => handleSetVpn()}
                    disabled={vpnDisable}
                    >
                        VPN {vpnStatus}
                    </CustomTableButton>
                </>
                
            }
            ></ListTable>
        </PanelContent>
    )
}

export default CariHesapHareketleri
