import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PanelContent from '../../../../component/panel/PanelContent';
import ListTable from '../../../../component/table/ListTable';

function Partners() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchData = async () => {
        try {
            const response = await axios.get("/users/api/users/");
            setRows(response.data);
        } catch (error) {
            console.error("Veri çekilirken bir hata oluştu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 50},
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'username', headerName: 'Username', width: 180 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'theme', headerName: 'Theme', flex: 1 },
    ]


  return (
    <PanelContent>
        <ListTable rows={rows} columns={columns} loading={loading}></ListTable>
    </PanelContent>
  )
}

export default Partners
