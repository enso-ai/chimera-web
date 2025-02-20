import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router';

import styled from 'styled-components';
import Header from './components/Header';

import { tabList } from './Tabs';
import TiktokCallback from './TiktokCallback';
import Footer from 'components/Footer';

const LayoutContainer = styled.div`
    width: 100vw;
    // Full viewport height minus header height and footer height
    // height: calc(100vh - 125px);
    box-sizing: border-box;
    height: 100vh;
    min-width: 400px;

    // for header
    padding-top: 75px;
    background-color: #bfbfbf;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;

const MainContainer = styled.div`
    height: 100%;
    width: 100%;
    max-width: 1200px;

    box-sizing: border-box;
    background-color: #bfbfbf;
    padding: 20px;
`;

const Layout = () => {
    return (
        <LayoutContainer>
            <Header /> {/* Header is always present */}
            <MainContainer>
                <Outlet /> {/* This renders the current route's component */}
            </MainContainer>
            <Footer />
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
