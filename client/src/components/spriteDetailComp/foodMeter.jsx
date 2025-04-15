import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const FoodMeter = ({ hunger }) => {
    const maxHunger = 8;
    const progress = (hunger / maxHunger) * 100;
    const segmentCount = 8;
    const size = 49;
    const borderWidth = 1.5;
    const lineLength = 49;
    const lineThickness = 1;

    return (
        <div className="absolute top-[25px] left-[25px]">
            <Box
                position="relative"
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                width={size + borderWidth * 2}
                height={size + borderWidth * 2}
                border={`${borderWidth}px solid #782E15`}
                borderRadius="50%"
                boxSizing="border-box"
            >
                {/* Background circle */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={size}
                    thickness={22}
                    sx={{
                        color: "#FFF2D8",
                        position: "absolute",
                    }}
                />

                {/* Foreground progress */}
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={size}
                    thickness={22}
                    sx={{
                        color: "#FFA500",
                        position: "absolute",
                    }}
                />

                {/* Segment Lines */}
                {[...Array(segmentCount)].map((_, i) => {
                    const angle = (360 / segmentCount) * i;
                    return (
                        <Box
                            key={i}
                            position="absolute"
                            left="50%"
                            top="49%"
                            width={`${lineLength}px`}
                            height={`${lineThickness}px`}
                            bgcolor="#782E15"
                            sx={{
                                transform: `rotate(${angle}deg) translateX(-50%)`,
                                transformOrigin: "left center",
                                pointerEvents: "none",
                            }}
                        />
                    );
                })}
            </Box>
        </div>
    );
};

export default FoodMeter;

