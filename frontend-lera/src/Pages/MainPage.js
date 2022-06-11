import React from "react";
import Header from "../Elements/Header";

function MainPage({AuthVisible}) {
    return (
        <div className={'wrraper'}>
            <Header AuthVisible={AuthVisible}/>
            <div className={'mainpage'}>
                <div className={'mainpage__block'}>
                    <h2 className={'mainpage__title'}>Local Transfer</h2>
                    <p className={'mainpage__text'}>
                        Організація переміщення та збуту продукції без торговельних посередників.
                        Керуй своїм підприємством ефективно!
                    </p>
                </div>
                <div className={'mainpage__img'}>
                    <img alt={'trans'} src={'img/trans.png'} width={'100%'}/>
                </div>
            </div>
        </div>
    );
}

export default MainPage
