import PaidIcon from "@mui/icons-material/Paid";

const SuiWallet = () => {
    return (
        <div>
            {/* Display Text on Larger Screens */}
            <h1 className="hidden w-[100px] sm:block text-lg border-2 border-solid p-1 text-center rounded">
                SuiWallet
            </h1>

            {/* Display PNG on Smaller Screens */}
            <PaidIcon sx={{ display: { xs: "block", sm: "none" } }} />
        </div>
    );
};

export default SuiWallet;

