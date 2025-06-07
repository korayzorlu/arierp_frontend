function Column(props) {
    const {children} = props;

    return ( 
        <th>{children}</th>
    );
}

export default Column;