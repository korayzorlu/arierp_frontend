function PanelContent(props) {
    const {children} = props;

    return ( 
        <div className="row g-0">
            <div className="col-md-12">
                {children}
            </div>
        </div>
    );
}

export default PanelContent;