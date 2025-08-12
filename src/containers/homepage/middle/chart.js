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
                <button
                    className="game__pair btc open-sheet-btn"
                    data-target="#sheet-1"
                    type="button"
                >
      <span className="game__pair-coin">
          <InstrumentIcon code={activeParity?.code}/>
        <span>
          <i>{activeParity?.code}</i>
          <small>{activeParity?.desc}</small>
        </span>
        <svg
            width={9}
            height={8}
            viewBox="0 0 9 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M0.996185 2.60151L4.49613 6.10146C4.595 6.20043 4.71217 6.24988 4.84767 6.24988C4.98317 6.24988 5.10032 6.20043 5.19929 6.10146L8.69924 2.60151C8.79821 2.50254 8.84766 2.38537 8.84766 2.24997C8.84766 2.11458 8.79821 1.99733 8.69924 1.89844C8.60016 1.79946 8.48301 1.74999 8.34762 1.74999L1.34775 1.74999C1.21233 1.74999 1.0951 1.79946 0.996185 1.89843C0.897321 1.9973 0.847684 2.11455 0.847684 2.24997C0.847684 2.38539 0.897321 2.50254 0.996185 2.60151Z"/>
        </svg>
      </span>
                    <span className="game__pair-parity">
        <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M4.9821 0.826558C4.7656 0.83301 4.56011 0.923521 4.40918 1.07887L1.07585 4.41225C0.920623 4.5684 0.833496 4.77965 0.833496 4.99982C0.833496 5.22 0.920623 5.43124 1.07585 5.5874L4.40918 8.92232C4.56597 9.07854 4.77835 9.16618 4.99968 9.16598C5.22102 9.16577 5.43323 9.07777 5.58974 8.92126C5.74624 8.76475 5.83426 8.55252 5.83446 8.33119C5.83466 8.10985 5.74704 7.89743 5.59081 7.74064L3.6849 5.8348H16.6699V8.38684C16.6596 8.50211 16.6733 8.61831 16.7103 8.72797C16.7474 8.83762 16.8068 8.93831 16.8849 9.02372C16.963 9.10914 17.058 9.17736 17.1639 9.22403C17.2698 9.2707 17.3843 9.29487 17.5 9.29487C17.6157 9.29487 17.7302 9.2707 17.8361 9.22403C17.942 9.17736 18.037 9.10914 18.1151 9.02372C18.1932 8.93831 18.2526 8.83762 18.2896 8.72797C18.3267 8.61831 18.3404 8.50211 18.3301 8.38684V5.8348C18.3301 4.92589 17.5788 4.16648 16.6699 4.16648H3.67676L5.59081 2.25401C5.71029 2.13657 5.79159 1.98591 5.82412 1.82157C5.85666 1.65724 5.83891 1.48691 5.77319 1.33281C5.70747 1.17871 5.59684 1.04795 5.45572 0.957663C5.31461 0.867377 5.14955 0.821638 4.9821 0.826558ZM14.9902 10.8233C14.8244 10.8237 14.6624 10.8735 14.5251 10.9665C14.3877 11.0594 14.2812 11.1912 14.2191 11.345C14.1571 11.4988 14.1423 11.6676 14.1768 11.8298C14.2112 11.992 14.2933 12.1403 14.4124 12.2556L16.3249 14.1697H3.33333V11.6908C3.33463 11.5797 3.31371 11.4696 3.2718 11.3667C3.22989 11.2638 3.16784 11.1704 3.08929 11.0918C3.01074 11.0133 2.91728 10.9512 2.81441 10.9093C2.71153 10.8674 2.60131 10.8465 2.49023 10.8478C2.26922 10.8504 2.05829 10.9406 1.90384 11.0987C1.74939 11.2568 1.66408 11.4698 1.66666 11.6908V14.1697C1.66666 15.0786 2.42441 15.8299 3.33333 15.8299H16.3249L14.4124 17.7439C14.3295 17.8198 14.2628 17.9116 14.2163 18.014C14.1699 18.1163 14.1446 18.227 14.142 18.3394C14.1394 18.4518 14.1595 18.5635 14.2012 18.6679C14.2429 18.7722 14.3053 18.8671 14.3846 18.9468C14.4639 19.0264 14.5585 19.0892 14.6627 19.1313C14.7669 19.1735 14.8786 19.194 14.991 19.1919C15.1033 19.1898 15.2141 19.165 15.3166 19.1189C15.4192 19.0729 15.5113 19.0065 15.5876 18.9239L18.9209 15.5905C18.9987 15.5131 19.0605 15.4211 19.1026 15.3197C19.1448 15.2183 19.1665 15.1096 19.1665 14.9998C19.1665 14.89 19.1448 14.7813 19.1026 14.6799C19.0605 14.5785 18.9987 14.4864 18.9209 14.4089L15.5876 11.0757C15.5099 10.9958 15.417 10.9323 15.3144 10.889C15.2118 10.8457 15.1016 10.8234 14.9902 10.8233Z"/>
        </svg>
        Change parity
      </span>
                </button>
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
