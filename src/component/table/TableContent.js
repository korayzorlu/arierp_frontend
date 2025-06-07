import { useState } from "react";

function TableContent(props) {
    const {children,width,height} = props;

    return ( 
        <div className="" style={{width:width ? width : "100%",height:height ? height : "88vh"}}>
            {children}
        </div>
    );
}

export default TableContent;