import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const FoodMeter = ({ hunger, max, egg }) => {
    const maxHunger = max;
    const progress = (hunger / maxHunger) * 100;
    const segmentCount = 8;
    const size = 80;
    const borderWidth = 2;
    const lineLength = 80;
    const lineThickness = 1.5;

    // Use gray colors if egg is true
    const bgColor = egg ? "#CCCCCC" : "#FFF2D8";
    const progressColor = egg ? "#999999" : "#FFA500";
    const segmentColor = egg ? "#AAAAAA" : "#782E15";
    const borderColor = egg ? "#AAAAAA" : "#782E15";

    return (
        <div className="absolute top-[25px] left-[25px]">
            <Box
                position="relative"
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                width={size + borderWidth * 2}
                height={size + borderWidth * 2}
                border={`${borderWidth}px solid ${borderColor}`}
                borderRadius="50%"
                boxSizing="border-box"
                style={{ opacity: egg ? 0.6 : 1 }}
            >
                {/* Background circle */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={size}
                    thickness={22}
                    sx={{
                        color: bgColor,
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
                        color: progressColor,
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
                            bgcolor={segmentColor}
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

FoodMeter.propTypes = {
    hunger: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    egg: PropTypes.bool.isRequired,
};

export default FoodMeter;

