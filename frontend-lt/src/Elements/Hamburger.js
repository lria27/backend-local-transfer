import React, {useContext} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {Logout} from "@mui/icons-material";

function Hamburger() {
    const auth = useContext(AuthContext)
    let navigate = useNavigate()
    const logoutHandler = async () => {
        try {
            navigate("/", { replace: true });
            auth.logout()
        } catch (e) {
        }
    }
    return (
        <div className="hamburger-menu">
            <input id="menu__toggle" type="checkbox"/>
            <label className="menu__btn" htmlFor="menu__toggle"><span/></label>
            <ul className="menu__box">
                <li>
                    <NavLink to="/" className="menu__item">
                        <div className={'menu__block'}>
                            <div>Головна</div>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/history" className="menu__item">
                        <div className={'menu__block'}>
                            <div>Історія Перміщень</div>
                        </div>
                    </NavLink>
                </li>
                <li>
                    {auth.role === 'Market' ? <NavLink className="menu__item" to="/move">
                        <div className={'menu__block'}>
                            Товари
                        </div>
                    </NavLink> :
                        <NavLink className="menu__item" to="/admin">
                            <div className={'menu__block'}>
                                Панель
                            </div>
                        </NavLink>
                    }
                </li>
                <li onClick={logoutHandler}>
                    <div className="menu__item">
                        <div className={'menu__block'}>
                            <Logout sx={{marginRight: '10px'}}/>
                            <div>Вийти</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}
export default Hamburger
