import CountUp from "react-countup";
import {useSelector} from "react-redux";
import InstrumentIcon from "../../../components/instrument-icon";
import Big from "big.js";
import {useEffect, useState} from "react";
import {decrypt, encrypt} from "../../../helpers/encryption";
import LoadingComp from "../../../components/loading-comp";
import LoadingCompRed from "../../../components/loading-comp-red";
import {useTranslation} from "react-i18next";

const Result = props => {

    const {t} = useTranslation()
    const {round} = props
    const {activeParity} = useSelector(state => state.informationReducer)

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true)
    const [myBet, setMyBet] = useState({})

    useEffect(() => {
        const id = requestAnimationFrame(() => setShow(true)); // next frame -> animate
        return () => cancelAnimationFrame(id);
    }, []);


    const handleUdResponse = e => {
        console.log('handleUdResponse = e ', e)

        if (!e) {
            return setLoading(null)
        }

        const bet = decrypt(e)

        const odd = round?.result === 'up' ? round?.up_odd : round?.down_odd
        console.log('myBet = ', bet)
        setMyBet({
            ...bet,
            odd,
            isWin: bet?.way === round?.result,
            winAmount: Big(bet?.amount || 0).times(odd || 0)?.toFixed(['TRY', 'USD', 'USDT']?.includes(bet?.currency) ? 2 : 8)
        })
    }
    useEffect(() => {

        window?.tcpSocketServer?.emit('ud:result', encrypt({
            code: round?.code,
            id: round?.id,
        }))

        window?.tcpSocketServer?.on('ud:result:response', handleUdResponse)

        return () => {
            window?.tcpSocketServer?.off('ud:result:response', handleUdResponse)
        }

    }, [round?.code, window?.tcpSocketServer?.connected])

    const isWin = true
    return (
        <div className="col-12 col-xl-6 ">
            <div className="game fadeUp">

                {/* .btc .eth .bnb .sol .xrp .ada .doge .ltc */}
                <div className="game__frame">
                    <div className={`finished__grid ${show ? 'reveal' : ''}`}>

                        <div className="locked btc">
                            <InstrumentIcon code={activeParity?.code}/>

                            <span className="locked__text">{t('bet.locked-price')}</span>
                            <div className="locked__value">
                                <CountUp
                                    end={round?.start_price}
                                    duration={.8}
                                    decimals={activeParity?.digits}
                                    separator=","
                                    preserveValue
                                    redraw={false}
                                    prefix="$ "
                                />
                            </div>
                        </div>
                        <div
                            className={`final ${Big(round?.end_price || 0).gte(round?.start_price || 0) ? 'green' : 'red'}`}>
                            <span className="final__text">{t('bet.final-price')}</span>
                            <div className="final__value">

                                <span>
                                    <CountUp
                                        end={round?.end_price}
                                        duration={.8}
                                        decimals={activeParity?.digits}
                                        separator=","
                                        preserveValue
                                        redraw={false}
                                        prefix="$ "
                                    />
                                </span>
                            </div>
                            <div className="final__result">
                                <small>{Big(round?.end_price || 0).gte(round?.start_price || 0) ? t('bet.up') : t('bet.down')}</small>
                                <p>

                                    <CountUp
                                        end={Big(round?.end_price || 0).minus(round?.start_price || 0).toNumber()}
                                        duration={.8}
                                        decimals={activeParity?.digits}
                                        separator=","
                                        preserveValue
                                        redraw={false}
                                        prefix="$ "
                                    />
                                </p>
                            </div>
                        </div>

                        {
                            loading === 'null' ?
                                <div className="nobets">
                                    <p>{t('bet.no-bets-placed')}</p>
                                </div> :
                                myBet?.isWin && false ?
                                    <div className="victory">
                                        <div className="victory__text">
                                            <img src="img/trophy.svg" alt=""/>
                                            <span>{t('bet.you-won')}</span>
                                        </div>
                                        <div className="victory__value">
                                            <span>{myBet?.currency}</span> {myBet?.winAmount}
                                        </div>
                                        {/* .up .down */}
                                        <div className="victory__odds up">
                                            <span>{t('bet.odds')} {myBet?.odd}</span>
                                            <svg
                                                width={14}
                                                height={14}
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M13.329 9.05567L7.63536 3.36205C7.47453 3.20104 7.28393 3.12061 7.06349 3.12061C6.84306 3.12061 6.65249 3.20104 6.49149 3.36205L0.79784 9.05567C0.636833 9.21668 0.556396 9.40729 0.556396 9.62755C0.556396 9.8478 0.636833 10.0385 0.79784 10.1994C0.959025 10.3604 1.14959 10.4409 1.36984 10.4409L12.7571 10.4409C12.9774 10.4409 13.1681 10.3604 13.329 10.1994C13.4898 10.0386 13.5706 9.84785 13.5706 9.62755C13.5706 9.40725 13.4898 9.21668 13.329 9.05567Z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    :
                                    <div className="lost">
                                        <div className="lost__text">{t('bet.you-lost')}</div>
                                        <img className="lost__img" src="img/lost.svg" alt=""/>
                                    </div>
                        }


                    </div>
                </div>

            </div>
        </div>

    )


}

export default Result
