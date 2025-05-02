import { useEffect, useState } from 'react';
import { database } from '../../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const LeaderboardBox = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const leaderboard_ref = ref(database, 'leaderboard/word_puzzle');
        const unsubscribe = onValue(leaderboard_ref, (snapshot) => {
            const board = snapshot.val();
            const output = [];
            for(const key in board) {
                if(key !== "_init") {
                    output.push(board[key]);
                }
            }
            setLeaderboard(output);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="w-full h-[280px] p-1 bg-[url('/assets/bg/leaderboard-border.svg')] bg-cover bg-center flex justify-center items-center ">
            <div className="w-[337.02px] h-[234px] flex flex-col items-center px-[22px] gap-[13px]">
                <h1 className="leading-none m-0 p-0 text-[40px]">
                    Leaderboard
                </h1>
                <ul className="w-[250px] leading-none m-0 p-0 flex flex-col text-[35px]">
                    {leaderboard.map((obj, index) => (
                        <li
                            key={`${obj.profile_name}-${index}`}
                            className="flex flex-row justify-between"
                        >
                            <section className="flex flex-row gap-[10px]">
                                <p className="w-[20px]">{index + 1}</p>
                                <p className="w-[100px] truncate">
                                    {obj.profile_name}
                                </p>
                            </section>
                            <p>{obj.score} Words</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LeaderboardBox;

