import associateServices from "../../../services";
import {useEffect, useState} from "react";
import Loading from "../../../components/loading";
import Big from "big.js";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const History = () => {
    const {
        activeParity,
    } = useSelector(state => state.informationReducer)

    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    useEffect(() => {
        setLoading(true)
        associateServices.getHistory({
            code: activeParity?.code
        }).then(res => {
            setData(res?.data)
            setLoading(false)
        })
    }, [activeParity?.code])
    return (
        loading ? <Loading/> :
            <div className="xtable">

                {Object.entries(data).map(([windowSize, stats]) => {
                    return (
                        <div className={"xtable-fadeup"}>
                            <div className="xtable__title">
                                <span>{t('tabs.last-games', {
                                    amount: windowSize
                                })}</span>
                            </div>
                            <div className="xtable__content">
                                <div className="result">
                                    <div
                                        className="result__bar result__bar--down"
                                        style={{width: `${Big(stats?.down_pct || 0).toFixed(2)}%`}}
                                    >
                                        <span>{Big(stats?.down).toFixed(0)}</span>
                                        <img src="img/down2.svg" alt=""/>
                                    </div>
                                    <div
                                        className="result__bar result__bar--up"
                                        style={{width: `${Big(stats?.up_pct || 0).toFixed(2)}%`}}
                                    >
                                        <span>{Big(stats?.up).toFixed(0)}</span>
                                        <img src="img/up2.svg" alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}


            </div>
    )

}

export default History


