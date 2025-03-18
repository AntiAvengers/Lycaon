import PaidIcon from "@mui/icons-material/Paid";

const SuiWallet = () => {
    return (
        <div>
            {/* Display Text on Larger Screens */}
            <h1 style={{width:"100px"}} className="hidden sm:block text-lg border-2 border-solid p-1 text-center rounded">SuiWallet</h1>

            {/* Display PNG on Smaller Screens */}
            <PaidIcon sx={{ display: { xs: "block", sm: "none" } }} />
            {/* <img
                src="assets/star.png"
                alt="Sui Wallet"
                className="sm:hidden w-6 h-6 ml-2"
            /> */}
        </div>
    );
};

export default SuiWallet;

