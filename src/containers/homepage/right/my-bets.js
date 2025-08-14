import {useEffect, useState} from "react";
import associateServices from "../../../services";
import Loading from "../../../components/loading";
import InstrumentIcon from "../../../components/instrument-icon";
import Big from "big.js";
import {useTranslation} from "react-i18next";
import {formatHighWinner} from "../../../helpers/encryption";

const MyBets = () => {

    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {
        associateServices.getMyBets({}).then(res => {
            setData(res?.data)
            setLoading(false)
        })
    }, [])
    return (
        loading ? <Loading/> :
            <div className="xtable">
                <div className="xtable__title">
                    <span>{t('tabs.parity')}</span>
                    <span>{t('tabs.win')}</span>
                </div>
                <div className="xtable__content">
                    <div className="xtable-fadeup">

                        {
                            data?.map(myBet => {
                                const digits = ['TRY', 'USD', 'EUR'].includes(myBet?.currency) ? 2 : 8
                                return (
                                    <div key={myBet?.unique_id} className={`user ${myBet?.way}`}>
                                  <span className="user__meta">
                                    <InstrumentIcon code={myBet?.code}/>
                                    <span>
                                      <i>{myBet?.code}</i>
                                      <small>{t(`bet.gain-${myBet?.round?.result?.toLowerCase()}`)}</small>
                                    </span>
                                  </span>
                                        <span className="user__price">

                                            {parseFloat(myBet?.win_amount) > 0 ?
                                                formatHighWinner(myBet?.win_amount, {
                                                    currency: '',
                                                    decimals: digits
                                                }) :
                                                `-${
                                                    formatHighWinner(myBet?.amount, {
                                                        currency: '',
                                                        decimals: digits
                                                    })
                                                }`}

                                            <span>{myBet?.currency}</span>

                                  </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
    )
}
export default MyBets
