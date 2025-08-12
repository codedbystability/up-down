import React from "react"
import './index.css'
import LoadingComp from "../loading-comp";

const Loading = ({small = false, button = false}) => {


    return (
        <div className="loading-container">
            <LoadingComp/>
            {/*<img className="loading__img" src="img/loading.svg" alt=""/>*/}
        </div>
    )

}

export default Loading
