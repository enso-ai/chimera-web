import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import { FaCircleUser } from 'react-icons/fa6';
import { tabList } from 'Tabs';

const HeaderContainer = styled.div`
    height: 75px;
    width: 100%;
    background-color: #f0f0f0;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    zindex: 100;
    position: fixed;
    top: 0;
    left: 0;
`;

const TabContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-grow: 1;
    gap: 10px;
`;

const IconContainer = styled.div`
    border-radius: 50%;
    overflow: hidden;

    margin-left: 20px;
    margin-right: 20px;
`;

const IconImage = styled.img`
    width: 50px;
    height: 50px;
`;

const Tab = styled(Link)`
    height: 75px;
    min-width: 100px;
    box-sizing: border-box;
    font-size: 24px;
    text-decoration: none;
    color: #5f5f5f;
    background-color: ${(props) => (props.to === props.currentTab ? '#bfbfbf' : 'transparent')};

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    padding-right: 20px;
`;

const UserProfileContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-grow: 0;

    padding-right: 20px;
`;

const Header = () => {
    const [currentTab, setCurrentTab] = useState(tabList[0].href);

    useEffect(() => {
        // initialize current tab based on current path
        const currentPathSegs = window.location.pathname.split('/');
        if (currentPathSegs.length > 2 && currentPathSegs[0] === 'app') {
            setCurrentTab(currentPathSegs[1]);
        } else {
            console.log("current path doesn't contain app segs, skip setting current tab");
        }
    }, []);

    const handleTabClick = (event, href) => {
        if (event.ctrlKey || event.metaKey) return;

        setCurrentTab(href);
    };

    return (
        <HeaderContainer>
            <TabContainer>
                <IconContainer>
                    <IconImage src='/logo.png' alt='logo' width='50' height='50' />
                </IconContainer>
                {tabList.map((tab, index) => (
                    <Tab
                        key={index}
                        to={tab.href}
                        onClick={(event) => handleTabClick(event, tab.href)}
                        currentTab={currentTab}
                    >
                        {tab.label}
                    </Tab>
                ))}
            </TabContainer>
            <UserProfileContainer>
                <FaCircleUser size={40} color='#5F5F5F' />
            </UserProfileContainer>
        </HeaderContainer>
    );
};

export default Header;
