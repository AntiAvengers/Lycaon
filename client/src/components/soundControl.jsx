import { useState, useRef, useEffect, useCallback } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Slider from "@mui/material/Slider";

const SoundControl = () => {
    const audioRef = useRef(null); // Reference to the audio element
    const [isMuted, setIsMuted] = useState(false); // State for mute status
    const [volume, setVolume] = useState(1); // State for volume level
    const [prevVolume, setPrevVolume] = useState(1); // Store previous volume before muting
    const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction
    const [hovering, setHovering] = useState(false); //Hover for acces to volume slider

    // Memoize the enableAudio function to prevent unnecessary re-creations
    const enableAudio = useCallback(() => {
        if (audioRef.current && !hasInteracted) {
            audioRef.current.muted = false;
            audioRef.current.volume = volume;
            audioRef.current
                .play()
                .catch((err) => console.log("Play failed:", err));
            setHasInteracted(true);
            setIsMuted(false);
        }
    }, [hasInteracted, volume]);

    // Effect for setting up the interaction listeners
    useEffect(() => {
        // Event listeners to trigger audio play after user interaction
        const events = ["click", "keydown", "touchstart"];
        events.forEach((event) => {
            document.addEventListener(event, enableAudio, { once: true });
        });

        // Cleanup event listeners on unmount or dependency change
        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, enableAudio);
            });
        };
    }, [enableAudio]); // Dependency on enableAudio to keep it updated

    // Toggle mute/unmute
    const toggleMute = () => {
        if (isMuted) {
            // Restore previous volume when unmuting
            setVolume(prevVolume || 1); // Use stored volume or default to 1
        } else {
            // Store current volume before muting
            setPrevVolume(volume);
            setVolume(0);
        }

        setIsMuted(!isMuted);

        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;

            if (!audioRef.current.muted) {
                // Restore volume and resume playing if needed
                audioRef.current.volume = prevVolume || 1;
                if (audioRef.current.paused) {
                    audioRef.current.play();
                }
            }
        }
    };

    // Adjust volume
    const handleVolumeChange = (_, newValue) => {
        setVolume(newValue);
        setIsMuted(newValue === 0);

        if (audioRef.current) {
            audioRef.current.volume = newValue;
            audioRef.current.muted = newValue === 0;
            if (newValue > 0 && audioRef.current.paused) {
                audioRef.current.play();
            }
        }
    };

    return (
        <div className="h-[45px] flex justify-start items-center mx-8">
            {/* Audio File */}
            <audio
                ref={audioRef}
                src="assets/sounds/ambient-fantasy-314682.mp3"
                preload="auto"
                loop
                muted={isMuted}
                autoPlay
            />

            {/* Volume Control Slider */}
            <div
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={`bg-[#242C53] h-[26px] flex items-center rounded-[30px] px-[10px] py-[4px] gap-[10px] transition-all duration-300 overflow-hidden ${
                    hovering ? "w-[173.3px]" : "w-[42px] justify-center"
                }`}
            >
                {/* Mute Button */}
                <button
                    onClick={toggleMute}
                    className="text-[#FCF4E7] flex justify-center items-center"
                >
                    {isMuted ? (
                        <VolumeOffIcon sx={{ width: 26, height: 18 }} />
                    ) : (
                        <VolumeUpIcon sx={{ width: 26, height: 18 }} />
                    )}
                </button>

                {/* Slider */}
                {hovering && (
                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        value={volume}
                        onChange={handleVolumeChange}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) =>
                            `${Math.round(value * 100)}%`
                        }
                        step={0.01}
                        aria-label="Volume Control"
                        sx={{ width: 122.3, color: "#FCF4E7" }}
                    />
                )}
            </div>
        </div>
    );
};

export default SoundControl;

