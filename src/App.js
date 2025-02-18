import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router';

import styled from 'styled-components';
import Header from './components/Header';

import { tabList } from './Tabs';
import TiktokCallback from './TiktokCallback';

const LayoutContainer = styled.div`
    width: 100vw;
    // Full viewport height minus header height
    height: calc(100vh - 75px);
    min-width: 400px;

    // for header
    padding-top: 75px;
`;

const MainContainer = styled.div`
    height: 100%;
    width: 100%;
`;

const Layout = () => {
    return (
        <LayoutContainer>
            <Header /> {/* Header is always present */}
            <MainContainer>
                <Outlet /> {/* This renders the current route's component */}
            </MainContainer>
        </LayoutContainer>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    {tabList.map((tab) => (
                        <Route key={tab.href} path={tab.href} element={<tab.comp />} />
                    ))}
                </Route>
                <Route path='/login_callback' element={<TiktokCallback />} />
            </Routes>
        </Router>
    );
}

export default App;
