import ParityList from "./parity-list";
import BottomResults from "./bottom-results";
import './index.css'
import MiddleIndex from "./middle";
import RightIndex from "./right";

const Homepage = () => {


    return (
        <>
            <div className="container">
                <div className="row">
                    <ParityList/>
                    <MiddleIndex/>
                    <RightIndex/>
                </div>
            </div>

            <BottomResults/>
        </>

    )

}

export default Homepage
