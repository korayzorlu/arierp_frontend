import PanelContent from "../../../../component/panel/PanelContent";
import Table from "../../../../component/table/Table";

function Data() {
    const columns = [
        {title:"Select"},
        {title:"Line"},
        {title:"Company Name"}
    ];

    const rows = [
        {cell:"sdgjdfst"}
    ]

    return ( 
            <PanelContent>
                        <Table columns={columns} rows={rows}></Table>
            </PanelContent>
        
    );
}

export default Data;