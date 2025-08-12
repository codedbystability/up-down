import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Big from "big.js";
import store from "../../../reducers/store";
import INFORMATION_ACTIONS from "../../../actions/information";
import PriceDisplay from "../../../components/price-display";
import InstrumentIcon from "../../../components/instrument-icon";
import {createSfxManager} from "../../../components/sfx";
import {createTradingAudioDirector} from "../../../components/heartbeat";
import MiddleLoading from "./loading";
import MiddleBet from "./bet";
import MiddleChart from "./chart";
import {decrypt} from "../../../helpers/encryption";
import CountUp from "react-countup";
import Result from "./result";

const MiddleIndex = () => {

    const {
        activeParity,
        soundSettings,
    } = useSelector(state => state.informationReducer)

    const {user} = useSelector(state => state.authenticationReducer)

    const [state, setSate] = useState('loading')
    const [round, setRound] = useState({})

    useEffect(() => {
        if (state === 'settle') {
            setTimeout(() => setSate('loading'), 4000)
        }
    }, [state])

    const handleUpdateData = (e) => {
        try {
            const data = JSON.parse(e);
            if (data?.c === activeParity?.code) {
                // handleUpdate(e)

                const dgt = parseInt(data?.digit || 0)
                // const AS = parseFloat(activeParity?.as || 0) / Math.pow(10, dgt)
                // const BS = parseFloat(activeParity?.bs || 0) / Math.pow(10, dgt)


                // if (data.c === 'AVAXUSDT')
                //     // console.log('data = ', data, '=', BS)
                // // console.log({
                //     b: Big(data.b).toFixed(dgt),
                //     new: Big(data.b).plus(BS || 0).toFixed(dgt)
                // })

                // data.b = Big(data.b).plus(BS || 0).toFixed(dgt)
                data.b = Big(data.b).toFixed(dgt)
                // data.a = Big(data.a).plus(AS || 0).toFixed(dgt)
                data.a = Big(data.a).toFixed(dgt)
                data.digits = data.digit

                store.dispatch(INFORMATION_ACTIONS.setLastData(data))


            }
        } catch (e) {
            console.error(e)
        }
    }

    const handleInitial = e => {
        const data = decrypt(e)
        console.log('handleInitial =', data)
        setRound(data)
        // setSate('bet')

        if (data?.status === 'locked') {
            setSate('locked')
        } else if (data?.status === 'waiting') {
            setSate('bet')
        }
    }
    const handleNewRound = e => {
        const data = decrypt(e)
        console.log('handleNewRound =', data)
        setRound(data)
        setSate('bet')
    }

    const handleSettle = e => {
        const data = decrypt(e)
        setRound(data)
        setSate('settle')
        console.log('handleSettle =', data)
    }

    const handleLock = e => {
        const data = decrypt(e)
        setRound(data)
        console.log('handleLock =', data)

        setSate('locked')
    }

    useEffect(() => {
        window.globalDataSocket?.emit('join', 'P~' + activeParity.code)
        window.globalDataSocket?.on('p-update', handleUpdateData);
        // window?.globalDataSocket?.on('pre', handlePre);

        return () => {
            // if (!openOrders.find(ii => ii.symbol === selectedOpenOrder?.symbol) && !waitingOrders.find(ii => ii.symbol === selectedOpenOrder?.symbol)) {
            // // console.log('!!! LEAVE P CONNECTION !!!')
            window.globalDataSocket?.emit('leave', 'P~' + activeParity.code)
            window.globalDataSocket?.off('p-update', handleUpdateData);
            // window.globalDataSocket?.off('pre', handlePre);
            // }
        }
        // }
    }, [activeParity, window.globalDataSocket?.connected, soundSettings?.signalSounds])

    useEffect(() => {

        window?.tcpSocketServer?.emit('join', `ud-public-${activeParity?.code}`)

        window?.tcpSocketServer?.on('up:down:new:round', handleNewRound)
        window?.tcpSocketServer?.on('up:down:lock', handleLock)
        window?.tcpSocketServer?.on('up:down:settle', handleSettle)
        window?.tcpSocketServer?.on('ud:initial', handleInitial)

        return () => {

            window?.tcpSocketServer?.off('up:down:new:round', handleNewRound)
            window?.tcpSocketServer?.off('up:down:lock', handleLock)
            window?.tcpSocketServer?.off('up:down:settle', handleSettle)
            window?.tcpSocketServer?.off('ud:initial', handleInitial)

            window?.tcpSocketServer?.emit('leave', `ud-public-${activeParity?.code}`)

        }

    }, [window?.tcpSocketServer?.connected, activeParity?.code])


    // return <MiddleBet round={round}/>

    if (state === 'loading')
        return <MiddleLoading round={round}/>
    if (state === 'bet')
        return <MiddleBet round={round}/>
    if (state === 'locked')
        return <MiddleChart round={round}/>
    if (state === 'settle')
        return <Result round={round}/>

}

export default MiddleIndex
