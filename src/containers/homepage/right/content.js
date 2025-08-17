import MyBets from "./my-bets";
import History from "./history";
import HighWinners from "./high-winners";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import PublicWinners from "./public";

const RightContent = () => {
    const {t}=useTranslation()
    const [activeTab, setActiveTab] = useState('my-bets')

    return (
        <>
            <ul
                className="nav nav-tabs sidebar__tabs-nav sidebar__tabs-nav--3"
                id="tabs-nav1"
                role="tablist"
            >
                <li className="nav-item" role="presentation">
                    <button
                        className={activeTab === 'my-bets' ? 'active' : ''}
                        onClick={e => setActiveTab('my-bets')}
                    >
                        <span>{t('tabs.my-bets')}</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={activeTab === 'history' ? 'active' : ''}
                        onClick={e => setActiveTab('history')}
                    >
                        <span>{t('tabs.history')}</span>
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={activeTab === 'high-winners' ? 'active' : ''}
                        onClick={e => setActiveTab('high-winners')}
                    >
                        <span>{t('tabs.high-winners')}</span>
                    </button>
                </li>

                <li className="nav-item" role="presentation">
                    <button
                        className={activeTab === 'public-winners' ? 'active' : ''}
                        onClick={e => setActiveTab('public-winners')}
                    >
                        <span>{t('tabs.public-winners')}</span>
                    </button>
                </li>
            </ul>

            <div className={'xtable-fadeup bottom'}>
                {
                    activeTab === 'my-bets' ? <MyBets/> :
                        activeTab === 'history' ? <History/> :
                        activeTab === 'high-winners' ? <HighWinners/> :
                            <PublicWinners/>

                }
            </div>
        </>
    )

}
export default RightContent
