import {useEffect, useRef, useState} from "react";
import associateServices from "../../../services";
import Loading from "../../../components/loading";
import InstrumentIcon from "../../../components/instrument-icon";
import {useTranslation} from "react-i18next";
import {formatHighWinner} from "../../../helpers/encryption";
import './index.css'

const POLL_MS = 30000;

const MyBets = () => {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const fetchData = async () => {
        const res = await associateServices.getMyBets({});
        setData(res?.data ?? []);
        setLoading(false)
    };

    useEffect(() => {

        fetchData();
        const id = setInterval(fetchData, POLL_MS);

        return () => {
            clearInterval(id);
        };
    }, []);

    return loading ? (
        <Loading/>
    ) : (
        <div className="xtable">
            <div className="xtable__title">
                <span>{t('tabs.parity')}</span>
                <span>{t('tabs.win')}</span>
            </div>
            <div className="xtable__content">
                <div className="xtable-fadeup">
                    {data?.map((myBet, idx) => {
                        const digits = ['TRY', 'USD', 'EUR'].includes(myBet?.currency) ? 2 : 8;
                        const isWin = parseFloat(myBet?.win_amount) > 0;
                        return (
                            <div
                                key={myBet?.unique_id}
                                className={`user ${myBet?.way} fade-in ${isWin ? 'is-win' : 'is-lose'}`}
                                style={{animationDelay: `${idx * 80}ms`}} // stagger
                            >
                <span className="user__meta">
                  <InstrumentIcon code={myBet?.code}/>
                  <span>
                    <i>{myBet?.code}</i>
                      {
                          myBet?.round?.result === null ?
                              null
                              :
                              <small>{t(`bet.gain-${myBet?.round?.result?.toLowerCase()}`)}</small>
                      }
                  </span>
                </span>

                                <span className="user__price">
                  {isWin
                      ? formatHighWinner(myBet?.win_amount, {currency: '', decimals: digits})
                      : `-${
                          formatHighWinner(myBet?.amount, {currency: '', decimals: digits})
                      }`
                  }
                                    <span>{myBet?.currency}</span>
                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
export default MyBets
