import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { AuthProvider } from "hocs/auth";
import { NotificationProvider } from "hocs/notification";
import { ChannelProvider } from "hocs/channel";
import { QueueProvider } from "hocs/queue";

import styled from "styled-components";
import Header from "components/Header";

import { tabList } from "Tabs";
import TiktokCallback from "pages/TiktokCallback";
import TermsOfService from "pages/TermsOfService";
import PrivacyPolicy from "pages/PrivacyPolicy";
import Signin from "pages/SignIn";
import Footer from "components/Footer";
import { PageNames } from "constants";

const LayoutContainer = styled.div`
    width: 100vw;
    // Full viewport height minus header height and footer height
    height: calc(100vh - 125px);
    box-sizing: border-box;
    height: 100vh;
    min-width: 400px;

    // for header
    padding-top: 75px;
    padding-bottom: 50px;
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
        <AuthProvider>
            <NotificationProvider>
                <ChannelProvider>
                    <QueueProvider>
                        <LayoutContainer>
                            <Header />
                            <MainContainer>
                                <Outlet />
                            </MainContainer>
                            <Footer />
                        </LayoutContainer>
                    </QueueProvider>
                </ChannelProvider>
            </NotificationProvider>
        </AuthProvider>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                <Route path={PageNames.APP} element={<Layout />}>
                    {tabList.map((tab) => (
                        <Route key={tab.href} path={tab.href} element={<tab.comp />} />
                    ))}
                </Route>
                <Route path={`/${PageNames.SIGNIN}`} element={<Signin />} />
                <Route
                    path={`/${PageNames.LOGIN_CALLBACK}`}
                    element={<TiktokCallback />}
                />
                <Route
                    path={`/${PageNames.TERMS_OF_SERVICE}`}
                    element={<TermsOfService />}
                />
                <Route
                    path={`/${PageNames.PRIVACY_POLICY}`}
                    element={<PrivacyPolicy />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
