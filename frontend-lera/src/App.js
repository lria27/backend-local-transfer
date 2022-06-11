import {useRoutes} from "./routes";
import  {BrowserRouter as Router} from "react-router-dom";
import {useAuth} from "./hooks/auth.hooks";
import {AuthContext} from "./context/AuthContext";

function App() {
    const {token, login, logout, role, marketId} = useAuth()
    const AuthVisible = !!token
    const routes = useRoutes( role, AuthVisible)
    return (
        <AuthContext.Provider value={{token, login, role, logout, marketId, AuthVisible }}>
              <Router>
                  {routes}
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
