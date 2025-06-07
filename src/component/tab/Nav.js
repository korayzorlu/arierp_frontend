function Nav(props) {
    const {children, addClass} = props;

    return ( 
        <ul className={`nav nav-pills m-0 mb-2 ${addClass || ""}`} role="tablist">
            {children}
        </ul>
    );
}

export default Nav;