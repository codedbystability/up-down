import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Big from "big.js";
import store from "../../../reducers/store";
import INFORMATION_ACTIONS from "../../../actions/information";
import PriceDisplay from "../../../components/price-display";
import InstrumentIcon from "../../../components/instrument-icon";
import {createSfxManager} from "../../../components/sfx";
import {createTradingAudioDirector} from "../../../components/heartbeat";
import {useTranslation} from "react-i18next";

const MiddleLoading = props => {

    const {round} = props

    const {t} = useTranslation()

    return (
        <div className="col-12 col-xl-6 ">
            <div className="game fadeUp">
                {/* .btc .eth .bnb .sol .xrp .ada .doge .ltc */}

                <div className="game__frame">
                    <div className="frame frame--border">
                        <div className="frame__head">
                            {/*<span className="frame__round">Round: {round?.id}</span>*/}
                        </div>
                        <div className="frame__content">
                            <div className="loading">
                                <span className="loading__title">{t('bet.loading-round')}</span>
                                <img className="loading__img" src="img/loading.svg" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )

}

export default MiddleLoading
