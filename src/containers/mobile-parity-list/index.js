import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import store from "../../reducers/store";
import INFORMATION_CONSTANTS from "../../constants/information";
import Big from "big.js";
import INFORMATION_ACTIONS from "../../actions/information";
import InstrumentIcon from "../../components/instrument-icon";
import PriceDisplay from "../../components/price-display";
import {createSfxManager} from "../../components/sfx";

const sfx = createSfxManager();
const MobileBottomSheet = () => {

    const {t} = useTranslation()
    const {instruments} = useSelector(state => state.dataReducer);
    const {activeParity} = useSelector(state => state.informationReducer)

    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])
    const [filteredParitiesUpdates, setFilteredParitiesUpdates] = useState([])
    useEffect(() => {
        // // console.log('search = ', search)
        search ? setFiltered(instruments?.filter(i =>
            i?.code?.toUpperCase().includes(search?.toUpperCase()) ||
            i?.desc?.toUpperCase().includes(search?.toUpperCase())
        )) : setFiltered(instruments)
    }, [instruments, search])
    const handleParityChange = parity => {
        // if (!parity?.enabled || parity?.closed)
        //     return toast.error(t('notifications.market-closed'))

        // console.log(parity)
        if (activeParity?.code === parity?.code) return;

        store.dispatch({type: INFORMATION_CONSTANTS.SET_PARITY, data: parity})
        store.dispatch({type: INFORMATION_CONSTANTS.SHOW_SYMBOL_LIST, data: false})
    };

    const handleUpdateL = (e) => {
        const data = JSON.parse(e)
        try {
            setFilteredParitiesUpdates(prev =>
                prev.map(item => {

                        const parity = instruments?.find(i => i.code === data?.c)
                        // dones[data?.c] = parity

                        // data.bb = data.b
                        const dgt = parseInt(data?.digit || 0)
                        // const AS = parseFloat(parity?.as || 0) / Math.pow(10, dgt)
                        const BS = parseFloat(parity?.bs || 0) / Math.pow(10, dgt);

                        // const ask = Big(data.a || 0).plus(AS).toFixed(dgt)
                        // const askP = Big(data.pa || 0).plus(AS).toFixed(dgt)

                        const bid = Big(data.b || 0).plus(BS).toFixed(dgt)
                        const bidP = Big(data.pb || 0).plus(BS).toFixed(dgt)


                        return item.code === data.c ? {
                            ...item,
                            // a: ask,
                            // pa: askP,
                            bb: data.bb,
                            b: bid,
                            pb: bidP,
                            // closed: data.closed,
                            digit: dgt,
                            t: data.t,
                            disabled: false
                        } : item
                    }
                ))
        } catch (err) {
            return console.log('EEE - ', err, '=', e)
        }
        // const data = decrypt(e)
        // // console.log('data-', data)
        // // console.log('groupSettings-', groupSettings)

    }

    useEffect(() => {

        // if (filteredParitiesUpdates?.length <= 0)
        setFilteredParitiesUpdates(filtered)
        window?.globalDataSocket?.on('p-update', handleUpdateL);

        filtered?.map(parity => window?.globalDataSocket?.emit('join', `P~${parity?.code || ''}`))

        return () => {
            filtered?.map(parity => window?.globalDataSocket?.emit('leave', `P~${parity?.code || ''}`))
            // window?.globalDataSocket?.off('pm-update', handleSetSession)
            window?.globalDataSocket?.off('p-update', handleUpdateL);
        }
    }, [filtered, window?.globalDataSocket?.connected])

    const handleClose = () => {
        const bottomSheet = document.getElementById('mobile-parity-list')
        if (bottomSheet)
            bottomSheet?.classList?.remove('open')
    }

    useEffect(() => {
        handleClose()

        sfx?.success()
    }, [activeParity?.code])
    return (
        <div className="bottom-sheet" id="mobile-parity-list">
            <div className="bottom-sheet__handle" onClick={handleClose}>
                <span>Close</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18 6l-12 12"/>
                    <path d="M6 6l12 12"/>
                </svg>
            </div>
            <div className="bottom-sheet__content">
                <div className="tab-content">

                    <div className="sidebar__content">
                        {/*<input*/}
                        {/*    value={search}*/}
                        {/*    onChange={e => setSearch(e.target.value)}*/}
                        {/*    type="text"*/}
                        {/*    className="form__search"*/}
                        {/*    placeholder="Search Symbol"*/}
                        {/*/>*/}
                        <div className="xtable">
                            <div className="xtable__title">
                                <span>Symbol</span>
                                <span>Bid</span>
                            </div>
                            <div className="xtable__content xtable__content--track">
                                {/* .btc .eth .bnb .sol .xrp .ada .doge .ltc */}
                                {
                                    filteredParitiesUpdates?.map(instrument => (
                                        <button
                                            key={instrument.code}
                                            onClick={e => store.dispatch(INFORMATION_ACTIONS.setParity(instrument))}
                                            className={`pair ${instrument.code?.substring(0, 3)?.toLowerCase()} ${activeParity?.code === instrument?.code ? 'active' : ''}`}
                                            type="button">
                                                      <span className="pair__coin">
                                                          <InstrumentIcon small={true} code={instrument.code}/>
                                                        <span>
                                                          <i>{instrument.code?.substring(0, 3)}</i>
                                                          <small>{instrument.desc}</small>
                                                        </span>
                                                      </span>
                                            <span className="pair__price">
                                                        <PriceDisplay
                                                            amount={instrument.b}
                                                            digits={instrument?.digits}/>
                                                {/*<span>$</span>86,526<span>.838</span>*/}
                                                      </span>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
export default MobileBottomSheet
