import {useState} from "react";
import MyBets from "./my-bets";
import HighWinners from "./high-winners";
import History from "./history";
import RightContent from "./content";

const RightIndex = () => {

    return (
        <div className="col-12 col-xl-3">
            <div className="sidebar">
                <div className="sidebar__tabs">
                    <RightContent/>
                </div>
            </div>
        </div>

    )

}
export default RightIndex
