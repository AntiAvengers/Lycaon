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
        <div className="flex flex-col justify-center items-start mx-8 my-4">
            {/* Audio Element */}
            <audio ref={audioRef} src="your-sound-file.mp3" preload="auto" />

            {/* Volume Control Slider */}
            <div className="flex justify-center items-center gap-2">
                {/* Mute Button */}
                <button onClick={toggleMute} className="text-black">
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
                    sx={{ width: 125 , color:"black"}}
                />
            </div>
        </div>
    );
};

export default SoundConrol;

