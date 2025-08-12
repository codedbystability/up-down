import {useState} from "react";

const HowToPlay = () => {

    const [active, setActive] = useState('1')

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="htp">
                        <span className="htp__tag">Crypto Futures, Binary, Forex Futures</span>
                        <h1 className="htp__title">NASIL OYNANIR?</h1>
                    </div>
                </div>
                <div className="col-12">
                    <div className="sidebar sidebar--htp">
                        <div className="sidebar__tabs sidebar__tabs--htp">
                            <div className="tab-content">
                                <div className="htp__content">
                                    <div className="htp__img">
                                        {
                                            active === '1' ?
                                                <img src="img/htp/1.png" alt=""/>
                                                :
                                                active === '2' ?
                                                    <img src="img/htp/2.png" alt=""/>
                                                    :
                                                    <img src="img/htp/3.png" alt=""/>
                                        }
                                    </div>
                                    <div className="htp__tabs">
                                        {/* .green. .blue .orange */}
                                        <div className={`htp__tab blue ${active === '1' ? 'active' : ''}`}
                                             onClick={e => setActive('1')}
                                        >
                                            <span>1</span>
                                            <p>
                                                Sol üst tarafta bulunan sembol listesinden{" "}
                                                <b>işlem yapacağınız sembolü seçiniz.</b>
                                            </p>
                                        </div>

                                        {/* .green. .blue .orange */}
                                        <div className={`htp__tab blue ${active === '2' ? 'active' : ''}`}
                                             onClick={e => setActive('2')}
                                        >
                                            <span>2</span>
                                            <p>
                                                İşleme girmek istediğiniz sembolün <b>çarpan değeri</b> ve{" "}
                                                <b>işlem miktarını seçiniz.</b>
                                            </p>
                                        </div>

                                        {/* .green. .blue .orange */}
                                        <div className={`htp__tab blue ${active === '3' ? 'active' : ''}`}
                                             onClick={e => setActive('3')}
                                        >
                                            <span>3</span>
                                            <p>
                                                Seçtiğiniz sürede ürün fiyatının düşeceğini düşünüyorsanız{" "}
                                                <strong>Düşer</strong>'e yükseleceğini düşünüyorsanız{" "}
                                                <b>Yükselir</b>'e tıklayınız.Tahmininiz doğru sonuçlanırsa
                                                kazanç elde edersiniz.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}

export default HowToPlay
