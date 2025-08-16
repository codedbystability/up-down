import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Big from "big.js";
import store from "../../../reducers/store";
import INFORMATION_ACTIONS from "../../../actions/information";
import PriceDisplay from "../../../components/price-display";
import InstrumentIcon from "../../../components/instrument-icon";
import {createSfxManager} from "../../../components/sfx";
import {createTradingAudioDirector} from "../../../components/heartbeat";
import CountUp from "react-countup";
import INFORMATION_CONSTANTS from "../../../constants/information";
import {encrypt} from "../../../helpers/encryption";
import LoadingComp from "../../../components/loading-comp";
import {useTranslation} from "react-i18next";

const MiddleBet = props => {

    const {t} = useTranslation()
    const {round} = props
    const {user} = useSelector(state => state.authenticationReducer)
    const {
        activeParity,
        lastAmount,
        lastData,
    } = useSelector(state => state.informationReducer)

    const [counter, setCounter] = useState(0);     // shows whole seconds
    const [progress, setProgress] = useState(100); // 100 -> 0
    const rafRef = useRef(null);

    useEffect(() => {
        if (!round?.start_time) return;

        const endMs = Number(round.start_time) * 1000;
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
    }, [round?.start_time]);

    const handleMobileParityList = () => {

        store.dispatch({type: 'SET_SHOW_PARITY_LIST', data: true})
        // const bottomSheet = document.getElementById('mobile-parity-list')
        // if (bottomSheet)
        //     bottomSheet?.classList?.toggle('open')
    }

    const [amount, setAmount] = useState(50)


    const onAmountChange = value => {
        const cleanValue = String(value).replace(/[^0-9]/g, '');
        // If nothing left after cleaning → reset
        if (cleanValue.length === 0) {
            return setAmount('');
        }

        value = cleanValue;
        if (!value)
            return setAmount('')

        if (Number(value) >= Number(user?.balance))
            return setAmount(Number(user?.balance).toFixed(0))

        return setAmount(Number(value)?.toFixed(0))
    }


    useEffect(() => {
        if (lastAmount)
            setAmount(lastAmount)
    }, [lastAmount])
    const handleBet = way => {
        if (!window?.tcpSocketServer?.connected)
            return false

        store.dispatch({type: 'SET_LAST_AMOUNT', data: amount})
        const data = {
            code: activeParity.code,
            way,
            amount,
            t: Date.now(),
        }

        console.log('data - ', data)
        window?.tcpSocketServer?.volatile?.emit('ud:create', encrypt(data))
    }
    const handleUp = () => {
        handleBet('up')
    }

    const handleDown = () => {
        handleBet('down')
    }

    return (
        <div className="col-12 col-xl-6 ">
            <div className="game fadeUp">

                <button
                    onClick={handleMobileParityList}
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
                        {t('bet.change-parity')}
                      </span>
                </button>

                <div className="game__head">
                    {/* .btc .eth .bnb .sol .xrp .ada .doge .ltc */}
                    <span className="game__title">
                        {t('bet.desc', {
                            symbol: activeParity?.desc
                        })}

                      </span>
                    <span className="game__coin btc">
                                        <InstrumentIcon code={activeParity?.code}/>
                        {t('bet.live-price', {
                            symbol: activeParity?.desc
                        })}
                      </span>
                    <span className="game__price">
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
                    {/*<span className="game__time btc">Price lock in: {counter} sec</span>*/}
                </div>
                <div className="game__frame">
                    <div className="frame">
                        {/*<div className="frame__head">*/}
                        {/*    <span className="frame__round">Round: {round?.id}</span>*/}
                        {/*</div>*/}
                        <div className="frame__content">
                            <div className="frame__btns">
                                <button className="frame__btn frame__btn--down" type="button" onClick={handleDown}>
                                  <span className="frame__ratio">
                                    <span>{Big(round?.down_odd || 0).toFixed(2)}</span>
                                    <svg
                                        width={18}
                                        height={18}
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                          d="M0.876439 6.12477L8.36247 13.6108C8.57393 13.8225 8.82454 13.9282 9.11437 13.9282C9.40419 13.9282 9.65475 13.8225 9.86644 13.6108L17.3525 6.12477C17.5642 5.91308 17.6699 5.66246 17.6699 5.37287C17.6699 5.08328 17.5642 4.83249 17.3525 4.62097C17.1405 4.40928 16.89 4.30346 16.6004 4.30346L1.62839 4.30346C1.33874 4.30346 1.08801 4.40928 0.876439 4.62097C0.664981 4.83243 0.558812 5.08322 0.558812 5.37287C0.558812 5.66252 0.664981 5.91308 0.876439 6.12477Z"/>
                                    </svg>
                                  </span>
                                    <span className="frame__oval">
                                    <svg
                                        width={113}
                                        height={100}
                                        viewBox="0 0 113 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                          d="M86.5692 76.6677H85.3071V56.3733H79.6301V38.7271H85.3071V18.4316H86.5692V38.7271H92.2462V56.3733H86.5692V76.6677Z"
                                          fill="#E32322"
                                      />
                                      <path
                                          d="M66.705 60.8892H65.4439V45.4423H59.7659V32.0099H65.4439V16.563H66.705V32.0099H72.383V45.4423H66.705V60.8892Z"
                                          fill="#E32322"
                                      />
                                      <path
                                          d="M46.8429 59.5134H45.5808V38.774H39.9038V20.739H45.5808V-0.000427246H46.8429V20.739H52.5199V38.774H46.8429V59.5134Z"
                                          fill="#E32322"
                                      />
                                      <path
                                          d="M26.8347 83.7666H25.864V65.0734H20.0408V25.8111H25.864V7.11992H26.8347V25.8111H32.6579V65.0734H26.8347V83.7666Z"
                                          fill="#E32322"
                                      />
                                      <path
                                          d="M7.11685 83.6064H5.85473V59.6268H0.177734V38.7741H5.85473V14.7945H7.11685V38.7741H12.7938V59.6268H7.11685V83.6064Z"
                                          fill="#E32322"
                                      />
                                      <path
                                          d="M112.11 75.2176H106.432V99.1982H105.171V75.2176H99.4932V54.3659H105.171V30.3852H106.432V54.3659H112.11V75.2176Z"
                                          fill="#E32322"
                                      />
                                    </svg>
                                    <span>{t('bet.down')}</span>
                                  </span>
                                </button>
                                <button onClick={handleUp} className="frame__btn frame__btn--up" type="button">
                                      <span className="frame__ratio">
                                        <span>{Big(round?.up_odd || 0).toFixed(2)}</span>
                                        <svg
                                            width={18}
                                            height={18}
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                              d="M16.7945 12.1069L9.30843 4.62092C9.09697 4.40923 8.84636 4.30347 8.55653 4.30347C8.26671 4.30347 8.01615 4.40923 7.80446 4.62092L0.318428 12.1069C0.106735 12.3186 0.000976563 12.5692 0.000976563 12.8588C0.000976563 13.1484 0.106735 13.3992 0.318428 13.6107C0.530354 13.8224 0.780909 13.9282 1.0705 13.9282L16.0425 13.9282C16.3322 13.9282 16.5829 13.8224 16.7945 13.6107C17.0059 13.3993 17.1121 13.1485 17.1121 12.8588C17.1121 12.5692 17.0059 12.3186 16.7945 12.1069Z"/>
                                        </svg>
                                      </span>
                                    <span className="frame__oval">
                                    <svg
                                        width={113}
                                        height={100}
                                        viewBox="0 0 113 100"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                          d="M87.0158 22.5303H85.7537V42.8247H80.0767V60.4709H85.7537V80.7664H87.0158V60.4709H92.6928V42.8247H87.0158V22.5303Z"
                                          fill="#66D535"
                                      />
                                      <path
                                          d="M67.1527 38.3086H65.8916V53.7555H60.2136V67.1878H65.8916V82.6347H67.1527V67.1878H72.8307V53.7555H67.1527V38.3086Z"
                                          fill="#66D535"
                                      />
                                      <path
                                          d="M47.2885 39.6843H46.0264V60.4238H40.3494V78.4587H46.0264V99.1982H47.2885V78.4587H52.9655V60.4238H47.2885V39.6843Z"
                                          fill="#66D535"
                                      />
                                      <path
                                          d="M27.2812 15.4312H26.3105V34.1244H20.4873V73.3866H26.3105V92.0778H27.2812V73.3866H33.1044V34.1244H27.2812V15.4312Z"
                                          fill="#66D535"
                                      />
                                      <path
                                          d="M7.56338 15.5916H6.30126V39.5712H0.624268V60.4239H6.30126V84.4035H7.56338V60.4239H13.2404V39.5712H7.56338V15.5916Z"
                                          fill="#66D535"
                                      />
                                      <path
                                          d="M112.556 23.9802H106.878V-0.000488281H105.617V23.9802H99.9387V44.8319H105.617V68.8125H106.878V44.8319H112.556V23.9802Z"
                                          fill="#66D535"
                                      />
                                    </svg>
                                    <span>{t('bet.up')}</span>
                                  </span>
                                </button>


                                {/*<div style={{*/}
                                {/*    position: 'absolute',*/}
                                {/*    width: 100,*/}
                                {/*    height: 100,*/}
                                {/*    left: 'calc(50% - 50px)',*/}
                                {/*    top: 'calc(50% - 50px)',*/}
                                {/*    backgroundColor: '#f7931a',*/}
                                {/*    borderRadius: '50%',*/}
                                {/*    zIndex: 999999,*/}
                                {/*    display: "flex",*/}
                                {/*    alignItems: "center",*/}
                                {/*    justifyContent: "center",*/}

                                {/*}} className={'frame__oval'}>*/}

                                {/*    DRAW*/}
                                {/*    <br/>*/}
                                {/*    <span className={'8x'}>8X</span>*/}
                                {/*</div>*/}
                            </div>
                        </div>

                        <div className="apigame__group">
                            {/*<span className="apigame__label">Miktar giriniz.</span>*/}
                            <div className="apigame__wager">
                                <div className="apigame__wager-inpit">
                                    <button type="button"
                                            onClick={e => onAmountChange(parseInt(amount) - 10)}
                                    >
                                        <svg
                                            width={25}
                                            height={26}
                                            viewBox="0 0 20 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.314 11.4484H4.253C3.72915 11.4484 3.30469 11.0239 3.30469 10.5001C3.30469 9.97622 3.72915 9.55176 4.253 9.55176H16.314C16.8379 9.55176 17.2623 9.97622 17.2623 10.5001C17.2623 11.0239 16.8379 11.4484 16.314 11.4484Z"/>
                                        </svg>
                                    </button>
                                    <input type="text"
                                           inputMode="numeric"     // mobile numeric keypad
                                           pattern="[0-9]*"        // hints some keyboards
                                        // value={amount} onChange={e => onAmountChange(e.target.value)}/>
                                    <button type="button"
                                            onClick={e => onAmountChange(parseInt(amount) + 10)}
                                    >
                                        <svg
                                            width={25}
                                            height={26}
                                            viewBox="0 0 20 21"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.8614 17.4789C9.33755 17.4789 8.91309 17.0544 8.91309 16.5306V4.46955C8.91309 3.9457 9.33755 3.52124 9.8614 3.52124C10.3852 3.52124 10.8097 3.9457 10.8097 4.46955V16.5306C10.8097 17.0544 10.3852 17.4789 9.8614 17.4789Z"/>
                                            <path
                                                d="M15.8921 11.4484H3.83112C3.30728 11.4484 2.88281 11.0239 2.88281 10.5001C2.88281 9.97622 3.30728 9.55176 3.83112 9.55176H15.8921C16.416 9.55176 16.8404 9.97622 16.8404 10.5001C16.8404 11.0239 16.416 11.4484 15.8921 11.4484Z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>


                        {/*<p className="frame__text">*/}
                        {/*    Place your bet, the next round will start soon*/}
                        {/*</p>*/}
                    </div>
                </div>

                <div className="game__counter" style={{"--progress": progress}}>
                    <span>{counter}</span>

                </div>
            </div>
        </div>


    )

}

export default MiddleBet
