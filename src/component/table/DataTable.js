function DataTable(props) {
    const {id,columns,rows} = props;
    return ( 
        <table id={id} className="table">
            <thead>
                <tr>
                    {
                        columns.map((column) => {
                            return <th>{column.title}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody id="tbody">

            </tbody>
        </table>
    );
}

export default DataTable;