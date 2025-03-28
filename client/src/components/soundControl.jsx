import { useState, useRef } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Slider from "@mui/material/Slider";

const SoundConrol = () => {
    const audioRef = useRef(null); // Reference to the audio element
    const [isMuted, setIsMuted] = useState(false); // State for mute status
    const [volume, setVolume] = useState(1); // State for volume level

    // Toggle mute/unmute
    const toggleMute = () => {
        setIsMuted((prev) => !prev);
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
        }
    };

    // Adjust volume
    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="flex justify-start items-center mx-8 my-4">
            {/* Audio Element */}
            <audio ref={audioRef} src="your-sound-file.mp3" preload="auto" />

            {/* Volume Control Slider */}
            <div className="bg-[#242C53] w-[173.3px] h-[26px] flex justify-center items-center gap-[5px] rounded-[30px] px-[10px] py-[4px]">
                {/* Mute Button */}
                <button onClick={toggleMute} className="text-[#FCF4E7]">
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </button>
                <Slider
                    size="small"
                    min={0}
                    max={1}
                    value={volume}
                    onChange={handleVolumeChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                    step={0.01}
                    aria-label="Volume Control"
                    sx={{ width: 122.3, color: "#FCF4E7" }}
                />
            </div>
        </div>
    );
};

export default SoundConrol;

