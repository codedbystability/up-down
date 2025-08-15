import associateServices from "../../../services";
import {useEffect, useState} from "react";
import Loading from "../../../components/loading";
import myBets from "./my-bets";
import Big from "big.js";
import {useTranslation} from "react-i18next";
import {formatHighWinner} from "../../../helpers/encryption";

const HighWinners = () => {
    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {
        associateServices.getHighWinners({}).then(res => {
            setData(res?.data)
            setLoading(false)
        })
    }, [])

    return (
        loading ? <Loading/> :
            <>
                <div className="xtable__title">
                    <span>{t('tabs.parity')}</span>
                    <span>{t('tabs.win')}</span>
                </div>
                <div className="xtable">
                    <div className="xtable__content">
                        <div className="xtable-fadeup">

                            {
                                data?.map(win => {
                                    const digits = ['TRY', 'USD', 'EUR'].includes(win?.currency) ? 2 : 8
                                    return (
                                        <>

                                            <div className={`user fade-in ${win?.way} is-win`}>
                                          <span className="user__meta">
                                            <img src={`img/${win?.way}.svg`} alt=""/>
                                            <span>
                                              <i>{win?.code}</i>
                                              <small>{t(`bet.${win?.way?.toLowerCase()}`)}</small>
                                            </span>
                                          </span>
                                                <span className="user__price">
                                                    {formatHighWinner(win?.win_amount, {
                                                        currency: '',
                                                        decimals: digits
                                                    })}
                                                    {/*{Big(win?.win_amount).toFixed(digits)}*/}
                                                    <span> {win?.currency}</span>
                                              </span>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
            </>
    )
}

export default HighWinners
