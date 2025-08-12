import RightContent from "../homepage/right/content";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import './index.css'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import store from "../../reducers/store";

const MobileBetList = () => {
    const containerRef = useRef(null);
    const [open, setOpen] = useState(false);


    const {showTransactionsSheet} = useSelector(state => state.informationReducer)

    const handleClose = () =>
        store.dispatch({type: "SET_TRANSACTIONS_SHEET", data: null})


    useEffect(() => {
        if (showTransactionsSheet)
            setOpen(true)
        else
            setOpen(false)
        // sheetRef.current.snapTo(({maxHeight}) => maxHeight)

    }, [showTransactionsSheet])


    return (
        <div ref={containerRef} className="bottom-sheet" id="mobile-bet-list">

            {/* your container content */}
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                // 👇 Mount the drawer inside this container, not body
                container={containerRef.current}
                // Make it cover only the container area
                ModalProps={{keepMounted: true}}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        backgroundColor: '#0e121d',
                        color: 'inherit',
                        // keep it within the container height
                        maxHeight: '90%',
                        width: '100%',
                        boxShadow: 'none',
                    },
                }}
                // Backdrop inside the container
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.35)',
                    },
                }}
            >
                <div className="bottom-sheet__handle" onClick={handleClose}>
                    <span>
                        Close
                    </span>
                </div>
                <div className="bottom-sheet__content">
                    <RightContent/>
                </div>
            </SwipeableDrawer>
        </div>
    )
}
export default MobileBetList
