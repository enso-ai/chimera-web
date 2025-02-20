import { useState } from 'react';
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
    width: 40px;
    height: 40px;
`;

const Tab = styled(Link)`
    height: 75px;
    min-width: 100px;
    font-size: 24px;
    text-decoration: none;
    color: #5f5f5f;
    background-color: ${(props) => (props.to === props.currentTab ? '#bfbfbf' : 'transparent')};

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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

    const handleTabClick = (href) => {
        setCurrentTab(href);
    };

    return (
        <HeaderContainer>
            <TabContainer>
                <IconContainer>
                    <IconImage src='/logo.png' alt='logo' width='40' height='40' />
                </IconContainer>
                {tabList.map((tab, index) => (
                    <Tab
                        key={index}
                        to={tab.href}
                        onClick={() => handleTabClick(tab.href)}
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
