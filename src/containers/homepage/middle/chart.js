import {useSelector} from "react-redux";
import InstrumentIcon from "../../../components/instrument-icon";
import Big from "big.js";
import {useEffect, useRef, useState} from "react";
import CountUp from "react-countup";
import './index.css'
import './frame-border.css'
import CenterOrb from "../../../components/center-orb";
import LoadingComp from "../../../components/loading-comp";
import LoadingCompRed from "../../../components/loading-comp-red";
import {useTranslation} from "react-i18next";


const MiddleChart = props => {

    const {t} = useTranslation()
    const {round} = props
    const {
        lastData,
        activeParity
    } = useSelector(state => state.informationReducer)


    const [status, setStatus] = useState('win');
    const [offset, setOffset] = useState(0); // number

    useEffect(() => {
        const start = Number(round?.start_price);
        const current = Number(lastData?.b);
        if (!Number.isFinite(start) || !Number.isFinite(current) || start === 0) {
            setOffset(0);
            setStatus('win');
            return;
        }

        const diff = current - start;      // +up / -down
        const pxPerUnit = 2;               // tune sensitivity
        const cap = 180;                   // max |px|
        const signed = Math.max(-cap, Math.min(cap, diff * pxPerUnit));

        setOffset(signed);
        setStatus(diff > 0 ? 'win' : 'lose');
    }, [round?.start_price, lastData?.b]);

    const [counter, setCounter] = useState(0);     // shows whole seconds
    const [progress, setProgress] = useState(100); // 100 -> 0
    const rafRef = useRef(null);

    useEffect(() => {
        if (!round?.end_time) return;

        const endMs = Number(round.end_time) * 1000;
        const totalMs = Math.max(1, endMs - Date.now());

        const tick = () => {
            const now = Date.now();
            const remainingMs = Math.max(0, endMs - now);

            // seconds label
            setCounter(Math.floor(remainingMs / 1000));

            // smooth ring (no flooring)
            setProgress((remainingMs / totalMs) * 100);

            if (remainingMs > 0) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        // start loop
        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [round?.end_time]);

    const markerRef = useRef(null);
    const parentRef = useRef(null);
    const [clampedOffset, setClampedOffset] = useState(0);

    useEffect(() => {
        if (!markerRef.current || !parentRef.current) return;

        const parentHeight = parentRef.current.offsetHeight;
        const markerHeight = markerRef.current.offsetHeight;

        // maximum possible movement from center without overflow
        const maxMove = (parentHeight - markerHeight) / 2;

        // clamp the offset between -maxMove and +maxMove
        setClampedOffset(Math.max(-maxMove, Math.min(maxMove, -Math.round(offset))));
    }, [offset]);

    const style = {
        // top: "50%",
        transform: `translateY(${clampedOffset}px)`
    };

    // const style = mag === 0 ? {} : {top: `calc(50% ${dir} ${mag}px)`}; // only one prop

    return (
        <div className="col-12 col-xl-6 ">
            <div className="game fadeUp">
                <div className="game__live">
                    <svg
                        width={33}
                        height={32}
                        viewBox="0 0 33 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M32.0211 19.8706C29.8838 28.442 21.2015 33.6584 12.628 31.521C4.05814 29.384 -1.15893 20.7021 0.979272 12.1312C3.11549 3.55878 11.7979 -1.65818 20.3689 0.478786C28.9417 2.61579 34.1583 11.2987 32.0211 19.8706Z"
                            fill="#424F66"
                        />
                        <path
                            d="M1.94922 12.373C3.92057 4.46223 11.8389 -0.400392 19.75 1.36035L20.127 1.44922C28.0383 3.42132 32.9008 11.3397 31.1396 19.252L31.0508 19.6289C29.0784 27.5385 21.1606 32.4008 13.2471 30.6396L12.8701 30.5508C4.96162 28.5787 0.0984658 20.6611 1.86035 12.75L1.94922 12.373Z"
                            stroke="#CAD1DD"
                            strokeOpacity="0.24"
                            strokeWidth={2}
                        />
                        <path
                            d="M27.1708 18.661C25.7014 24.5539 19.7322 28.1402 13.838 26.6707C7.94622 25.2015 4.35948 19.2327 5.8295 13.3402C7.29815 7.44666 13.2673 3.86 19.1598 5.32917C25.0537 6.79835 28.6401 12.7678 27.1708 18.661Z"
                            fill="#0E121D"
                        />
                        <path
                            d="M20.3803 16.9677C19.846 19.1105 17.6754 20.4146 15.532 19.8802C13.3895 19.346 12.0853 17.1755 12.6198 15.0328C13.1539 12.8897 15.3245 11.5855 17.4672 12.1197C19.6104 12.6539 20.9146 14.8247 20.3803 16.9677Z"
                            fill="#424F66"
                        />
                        <path
                            d="M13.5898 15.2744C13.9778 13.7177 15.5177 12.7515 17.0742 13.0566L17.2256 13.0898C18.7826 13.4781 19.7489 15.0182 19.4434 16.5752L19.4102 16.7256C19.0095 18.3325 17.381 19.311 15.7734 18.9102H15.7744C14.2181 18.5221 13.2513 16.9823 13.5566 15.4258L13.5898 15.2744Z"
                            stroke="#CAD1DD"
                            strokeOpacity="0.24"
                            strokeWidth={2}
                        />
                    </svg>
                    <span>{t('bet.live-round')}</span>
                </div>
                <div className="game__frame">
                    <div className={`frame frame--border ${status}`}>
                        <div className="frame__head">
                            <span className="frame__round">{t('bet.round-id')}: {round?.id}</span>
                        </div>
                        <div className="frame__content">
                            <div className="outcome" ref={parentRef}>
                                <div
                                    className={`outcome__zone outcome__zone--win ${status === 'lose' ? 'passive' : ''}`}
                                    data-text={t('bet.up')}
                                >
                                    <div className="outcome__odds">
                                        <span>{t('bet.odds')}: </span>
                                        <span>{Big(round?.up_odd || 0).toFixed(2)}</span>


                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.7932 12.491L9.30721 5.00495C9.09575 4.79326 8.84514 4.6875 8.55531 4.6875C8.26548 4.6875 8.01493 4.79326 7.80324 5.00495L0.317207 12.491C0.105514 12.7026 -0.000244141 12.9533 -0.000244141 13.2429C-0.000244141 13.5324 0.105514 13.7832 0.317207 13.9948C0.529134 14.2064 0.779689 14.3123 1.06928 14.3123L16.0413 14.3123C16.3309 14.3123 16.5817 14.2064 16.7932 13.9948C17.0047 13.7833 17.1109 13.5325 17.1109 13.2429C17.1109 12.9532 17.0047 12.7026 16.7932 12.491Z"/>
                                        </svg>
                                    </div>

                                    <img src="img/up2.svg" alt=""/>
                                </div>
                                <div
                                    className={`outcome__zone outcome__zone--lose ${status === 'win' ? 'passive' : ''}`}
                                    data-text={t('bet.down')}
                                >
                                    <div className="outcome__odds">
                                        <span>{t('bet.odds')}: </span>
                                        <span>{Big(round?.down_odd || 0).toFixed(2)}</span>

                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M0.317845 6.50905L7.80387 13.995C8.01533 14.2067 8.26595 14.3125 8.55577 14.3125C8.8456 14.3125 9.09615 14.2067 9.30785 13.995L16.7939 6.50905C17.0056 6.29736 17.1113 6.04674 17.1113 5.75715C17.1113 5.46756 17.0056 5.21677 16.7939 5.00525C16.582 4.79355 16.3314 4.68774 16.0418 4.68774L1.0698 4.68774C0.78015 4.68774 0.52942 4.79355 0.317845 5.00525C0.106387 5.21671 0.000218211 5.4675 0.000218186 5.75715C0.00021816 6.0468 0.106387 6.29735 0.317845 6.50905Z"/>
                                        </svg>
                                    </div>


                                    <img src="img/down2.svg" alt=""/>
                                </div>
                                {/* .btc .eth .bnb .sol .xrp .ada .doge .ltc */}
                                <div className="outcome__locked btc">
                                    <small>{t('bet.locked-price')}</small>
                                    <p>
                                        {/*<span>$</span> {round?.start_price}*/}
                                        <CountUp
                                            end={round?.start_price}
                                            duration={2}
                                            decimals={activeParity?.digits}
                                            separator=","
                                            preserveValue
                                            redraw={false}
                                            prefix="$ "
                                        />
                                    </p>
                                </div>
                                {/* .win .lose */}

                                <div
                                    ref={markerRef}
                                    className={`outcome__value ${status}`}
                                    style={style}
                                >
                                  <span className="outcome__price ">
                                    {/*<span>$</span> {lastData?.b}*/}

                                      <CountUp
                                          end={lastData?.b}
                                          duration={1}
                                          decimals={activeParity?.digits}
                                          separator=","
                                          preserveValue
                                          redraw={false}
                                          prefix="$ "
                                      />
                                  </span>
                                    <InstrumentIcon code={activeParity?.code}/>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
                <div className="game__counter" style={{"--progress": progress}}>
                    <span>{counter}</span>
                </div>
            </div>
        </div>

    )

}

export default MiddleChart
