function TabContent(props) {
    const {children, tabContent} = props;

    return ( 
        <div className="tab-content">
            {children}
        </div>
    );
}

export default TabContent;