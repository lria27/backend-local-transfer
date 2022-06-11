import React from 'react'
import { Routes ,Route } from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import MarketMove from "./Pages/MarketMove";
import AdminPanel from "./Pages/AdminPanel";
import Page404 from "./Pages/404Page";
import HistoryPage from "./Pages/HistoryPage";

export const useRoutes = (role, AuthVisible) =>{
    if(AuthVisible){
        if(role === 'Market'){
             return(
                <Routes>
                    <Route path="*" element={<Page404 AuthVisible={AuthVisible}/>} />
                    <Route path="/move" element={<MarketMove AuthVisible={AuthVisible}/>} />
                    <Route path="/" element={<MainPage AuthVisible={AuthVisible}/>} />
                    <Route path="/history" element={<HistoryPage AuthVisible={AuthVisible} role={'market'}/>} />
                </Routes>
             )
        }
        else {
            return (
                <Routes>
                    <Route path="*" element={<Page404 AuthVisible={AuthVisible}/>} />
                    <Route path="/admin" element={<AdminPanel AuthVisible={AuthVisible}/>} />
                    <Route path="/" element={<MainPage AuthVisible={AuthVisible}/>} />
                    <Route path="/history" element={<HistoryPage AuthVisible={AuthVisible} role={'admin'}/>} />
                </Routes>
            )
        }
    }else {
        return (
            <Routes>
                <Route path="*" element={<Page404 AuthVisible={AuthVisible}/>} />
                <Route path="/" element={<MainPage AuthVisible={AuthVisible}/>} />
            </Routes>
        )
    }
}
