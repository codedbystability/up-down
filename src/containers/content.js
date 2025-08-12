import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import INFORMATION_CONSTANTS from "../constants/information";
import store from "../reducers/store";
import {decrypt} from "../helpers/encryption";
import Big from "big.js";
import i18next from "i18next";
import AUTH_CONSTANTS from "../constants/authentication";
import {io} from "socket.io-client";
import AUTH_ACTIONS from "../actions/authentication";
import Containers from "./index";
import {ToastContainer, toast} from 'react-toastify';


// const signalAudio = new Audio('https://vendor-provider.fra1.cdn.digitaloceanspaces.com/binary/sfx/signal-move.mp3')
// signalAudio.volume = 0.2
// const betAcceptedAudio = new Audio('https://vendor-provider.fra1.cdn.digitaloceanspaces.com/binary/sfx/bet-accepted.mp3')
// const winnerAudio = new Audio('https://vendor-provider.fra1.cdn.digitaloceanspaces.com/binary/sfx/win.mp3')
// const loseAudio = new Audio('https://vendor-provider.fra1.cdn.digitaloceanspaces.com/binary/sfx/lose2.mp3')
// const refundAudio = new Audio('https://vendor-provider.fra1.cdn.digitaloceanspaces.com/binary/sfx/refund.mp3')
// const audio = new Audio();


// let checkInterval;
let isFirstConnect = true;
let isFirstConnectData = true;

const Content = () => {

    const {visibilityStatus, activeParity} = useSelector(state => state.informationReducer)
    const {user} = useSelector(state => state.authenticationReducer)
    const {t} = useTranslation()

    // todo pure js


    useEffect(() => {
        if (user?.accessToken) {
            connectToSocket()
            connectToMainSocket()
        }
    }, [user?.accessToken])

    useEffect(() => {

        const onVisibilityChange = () => {
            // console.log(document?.visibilityState)
            store.dispatch({type: INFORMATION_CONSTANTS.SET_VISIBILITY_STATUS, data: document?.visibilityState})
            if (document?.visibilityState === 'hidden') {

                // store.dispatch(setVisibilityAction('hidden'))
                setTimeout(() => {
                    if (document.visibilityState !== 'visible') {
                        store.dispatch({
                            type: INFORMATION_CONSTANTS.SET_VISIBILITY_STATUS,
                            data: document?.visibilityState
                        })

                        console.log('DISCONNECT ALL SERVERS => ', new Date())
                        window?.tcpSocketServer?.disconnect()
                        window?.globalDataSocket?.disconnect()
                    }
                }, 5000)
            }

        };

        if (window?.tcpSocketServer) {
            document.addEventListener('visibilitychange', onVisibilityChange);
            return () => {
                document.removeEventListener('visibilitychange', onVisibilityChange);
            }
        }
    }, [window?.tcpSocketServer?.connected]);

    const checkDataSocketConnection = () => {
        if (!window.globalDataSocket)
            connectToSocket()
        else if (!window?.globalDataSocket?.connected) {
            const interval4 = setInterval(() => {
                if (!window?.globalDataSocket?.connected)
                    window?.globalDataSocket?.connect()
                else clearInterval(interval4);
            }, 2000);
        }
    }
    const checkSocketConnection = () => {
        console.log('checkSocketConnection')
        if (!window.tcpSocketServer)
            connectToMainSocket()
        else if (!window?.tcpSocketServer?.connected) {
            const interval4 = setInterval(() => {
                if (!window?.tcpSocketServer?.connected)
                    window?.tcpSocketServer?.connect()
                else clearInterval(interval4);
            }, 2000);
        }
    }

    useEffect(() => {
        if (!isFirstConnect && !window?.tcpSocketServer?.connected && visibilityStatus === 'visible')
            checkSocketConnection()
    }, [window?.tcpSocketServer?.connected, visibilityStatus])

    useEffect(() => {
        if (!isFirstConnectData && !window?.globalDataSocket?.connected && visibilityStatus === 'visible')
            checkDataSocketConnection()

    }, [window?.globalDataSocket?.connected, visibilityStatus])

    const connectToSocket = () => {

        console.log("connectToSocket = ", new Date())
        if (window?.globalDataSocket && !window?.globalDataSocket?.connected)
            window?.globalDataSocket?.connect()
        else
            window.globalDataSocket = window.globalDataSocket || io('https://wss.sepew.com', {
                'transports': ['websocket', 'polling'],
                upgrade: false,
                withCredentials: true,
            });


        window?.globalDataSocket?.on('connect', () => {

            console.log('DATA SOCKET CONNECTED  = ', new Date())


            isFirstConnectData = false

            return () => {
                window?.globalDataSocket?.emit('leave', `P~${activeParity?.code}`)
                window?.globalDataSocket?.off('p-update');
                window?.globalDataSocket?.off('pm-update');
            }
        });
        window?.globalDataSocket?.on('connect_error', e => {
            connectToSocket()
        });


    };

    const handleOpenPositions = e => {
        // console.log('handleOpenPositions', decrypt(e))
        store.dispatch({type: INFORMATION_CONSTANTS.SET_MY_BETS, data: decrypt(e)})
    }

    const checkSocketUser = e => store.dispatch({type: AUTH_CONSTANTS.CHECK_USER_ACTION, data: decrypt(e)})


    const handleSetUser = e => {

        const dt = decrypt(e)
        const ss = Date.now()
        const diff = parseInt((dt.seconds - ss) / 1000)

        store.dispatch(AUTH_ACTIONS.setUser({...dt, seconds: diff}))

    }

    const handlePositionAccepted = e => {
        const data = decrypt(e)
        console.log('position = ', data)


        toast(t('notifications.position-accepted', {
            code: data.code
        }))


    }
    const handlePositionNotAccepted = e => {
        const data = JSON.parse(e)
        if (data?.msg)
            toast.error(t(`notifications.${data?.msg}`, data?.msg))
    }


    const handleBalanceUpdate = data => store.dispatch({type: AUTH_CONSTANTS.SET_BALANCE, data})

    // const handleJackpotUpdate = e => store.dispatch({type: AUTH_CONSTANTS.UPDATE_JACKPOT, data: decrypt(e)})


    const connectToMainSocket = () => {
        console.log('connectToMainSocket = ', new Date())
        if (window?.tcpSocketServer)
            window?.tcpSocketServer?.connect()
        else
            window.tcpSocketServer = window.tcpSocketServer || io('https://binaryws.septrader.com', {
                'transports': ['websocket', 'polling'],
                upgrade: false,
                auth: {
                    token: user?.accessToken,
                    deviceID: 'future-web'
                },
                withCredentials: true,
            });


        window?.tcpSocketServer?.off('connect')

        window?.tcpSocketServer?.on('connect', () => {
            console.log('TCP SOCKET CONNECTED  = ', new Date())
            isFirstConnect = false


            window?.tcpSocketServer?.off('account:setuser', handleSetUser)?.on('account:setuser', handleSetUser)


            window?.tcpSocketServer?.emit('leave', `UD~ACCOUNT~${user?.login}`)
            window?.tcpSocketServer?.emit('leave', 'ud-public')

            window?.tcpSocketServer?.emit('join', `UD~ACCOUNT~${user?.login}`)
            window?.tcpSocketServer?.emit('join', 'ud-public')


            window?.tcpSocketServer?.off('balance:updated', handleBalanceUpdate)?.on('balance:updated', handleBalanceUpdate)
            window?.tcpSocketServer?.off('user:check')?.on('user:check', checkSocketUser)

            window?.tcpSocketServer?.off('up:down:position:accepted', handlePositionAccepted)?.on('up:down:position:accepted', handlePositionAccepted)
            window?.tcpSocketServer?.off('up:down:position:not:accepted', handlePositionNotAccepted)?.on('up:down:position:not:accepted', handlePositionNotAccepted)
            // window?.tcpSocketServer?.off('future:account:publicpositions', handlePublicPositions)?.on('future:account:publicpositions', handlePublicPositions)
            // window?.tcpSocketServer?.off('future:position:not:updated', handlePositionNotUpdated)?.on('future:position:not:updated', handlePositionNotUpdated)
            // window?.tcpSocketServer?.off('future:position:updated', handlePositionUpdated)?.on('future:position:updated', handlePositionUpdated)
            // window?.tcpSocketServer?.off('future:position:revised', handlePositionRevised)?.on('future:position:revised', handlePositionRevised)
            // window?.tcpSocketServer?.off('future:position:not:accepted', handlePositionNotAccepted)?.on('future:position:not:accepted', handlePositionNotAccepted)
            // window?.tcpSocketServer?.off('future:position:resulted', handlePositionResulted)?.on('future:position:resulted', handlePositionResulted)


        });

        window?.tcpSocketServer?.on("connect_error", (err) => {
            if (err.message === 'Authentication error')
                store.dispatch({type: AUTH_CONSTANTS.USER_LOGOUT, data: null})
            else {
                console.log('ELSE CONNECT')
                window?.tcpSocketServer?.connect()
            }
        });
    };


    useEffect(() => {

        if (user?.login && window?.globalDataSocket?.connected) {
            // console.log('CLOSE CONNECTIONS !!!!')
            window.globalDataSocket?.emit('leave', `P~${activeParity?.code}`)

            window?.globalDataSocket?.disconnect()

            window?.tcpSocketServer?.removeAllListeners()
            window?.tcpSocketServer?.disconnect()

            window.tcpSocketServer = null
            window.globalDataSocket = null
        }
    }, [user?.login])


    return <Containers/>

}
export default Content
