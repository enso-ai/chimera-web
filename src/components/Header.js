import styled from 'styled-components';
import { Link } from 'react-router';

import { FaCircleUser, FaTiktok } from 'react-icons/fa6';
import { tabList } from '../Tabs';

const HeaderContainer = styled.div`
    height: 75px;
    width: calc(100% - 20px);
    padding-left: 10px;
    padding-right: 10px;
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
`;

const IconContainer = styled.div`
    margin-right: 10px;
`;

const Tab = styled(Link)`
    margin: 0 10px;
    font-size: 24px;
    text-decoration: none;
    color: #5f5f5f;
`;

const UserProfileContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-grow: 0;
`;

const Header = () => {
    return (
        <HeaderContainer>
            <TabContainer>
                <IconContainer>
                    <FaTiktok size={40} />
                </IconContainer>
                {tabList.map((tab, index) => (
                    <Tab key={index} to={tab.href}>
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
