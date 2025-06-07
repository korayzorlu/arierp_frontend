function TabPane(props) {
    const {children, tabPane} = props;

    return ( 
        <div
        className={`tab-pane fade ${tabPane.active}`}
        id={tabPane.id}
        role="tabpanel"
        aria-labelledby={`#${tabPane.label}`}
        >
            {children}
        </div>
    );
}

export default TabPane;