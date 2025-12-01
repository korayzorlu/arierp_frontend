import { Grid, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { ReactComponent as ErrorIcon } from "images/icons/global/error-404-2.svg";

function WrongPath() {
    const {theme,dark} = useSelector((store) => store.auth);

    return (
        <Stack sx={{minHeight: "100vh",justifyContent: "center",alignItems: "center",}}>
            <Stack spacing={1} alignItems="center">
                {/* <Typography className="archivo-black-regular" variant="h3" sx={{color: dark ? "#fff" : "#000",textAlign: "center",}}>
                    ARINET
                </Typography> */}
                <Typography
                className="archivo-black-regular"
                variant="h4"
                sx={{
                    color: dark ? "#fff" : "#000",
                    position: "absolute",
                    top: 24,
                    left: 24,
                    textAlign: "left",
                    zIndex: 1,
                }}
                >
                    ARINET
                </Typography>
                <Typography sx={{fontSize: "8rem", color: dark ? "metallicgold.main" : "ari.main",textAlign: "center",fontWeight: "bold",}}>
                    404
                </Typography>
                {/* <ErrorIcon height="400" style={{ display: "block", margin: "0 auto" }}/> */}
                <Typography variant="h6" sx={{color: dark ? "#fff" : "#000",textAlign: "center",fontWeight: "bold",}}>
                    Sayfa bulunamadı!
                </Typography>
                {/* <img src={require("../../../images/icons/global/error-404.png")} height="400" alt="" style={{ display: "block", margin: "0 auto" }}/> */}
            </Stack>
        </Stack>
    );
}

export default WrongPath;