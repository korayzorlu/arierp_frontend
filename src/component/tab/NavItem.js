import { useEffect } from "react";
import { Tab } from "mdb-ui-kit";

function NavItem(props) {
    const {children, navItem,addClass,btnClass} = props;

    useEffect(() => {
        //mdb input
        const tabs = document.querySelectorAll('.nav-item button');
        tabs.forEach((tab) => {
            new Tab(tab); // Her dropdown öğesini başlat
        });
            
    }, []);

    return ( 
        <li className={`nav-item ${addClass || ""}`} role="presentation">
            <button
            data-mdb-pill-init
            className={`nav-link m-0 ${navItem.active} ${btnClass || ""}`}
            id={navItem.id}
            data-mdb-target={`#${navItem.target}`}
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
            >
                {children}
            </button>
        </li>
    );
}

export default NavItem;