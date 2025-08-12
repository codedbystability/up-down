import RightIndex from "../homepage/right";
import RightContent from "../homepage/right/content";

const MobileBetList = () => {


    const handleClose = () => {
        const mobileBetList = document.getElementById('mobile-bet-list')
        if (mobileBetList)
            mobileBetList?.classList?.toggle('open')
    }
    return (

        <div className="bottom-sheet" id="mobile-bet-list">
            <div className="bottom-sheet__handle" onClick={handleClose}>
                <span>Close</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18 6l-12 12"/>
                    <path d="M6 6l12 12"/>
                </svg>
            </div>

            <div className="bottom-sheet__content">
                <RightContent/>
            </div>


        </div>

    )
}
export default MobileBetList
