function ProgressBar(props) {
    const {value,display} = props;

    return ( 
        <progress value={value} className={`w-100 ${display ? "d-block" : "d-none"}`}
            style={{
                "position":"absolute",
                "top":"0",
                "borderRadius":"0",
                "height":"4px",
                "color":"red"
            }}
        />
    );
}

export default ProgressBar;