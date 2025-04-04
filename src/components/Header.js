import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import { useAuth } from 'hocs/auth';
import { FaCircleUser } from 'react-icons/fa6';
import { FaSignOutAlt } from 'react-icons/fa';
import { tabList } from 'Tabs';

const HeaderContainer = styled.div`
    height: 75px;
    width: 100%;
    background-color: #f0f0f0;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    z-index: 100;
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
    background-color: ${(props) => (props.to === props.$currentTab ? '#bfbfbf' : 'transparent')};

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
    position: relative;
    cursor: pointer;

    padding-right: 20px;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 5px;
    background-color: #d3d3d3;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    padding: 5px 0;
    min-width: 120px;
    z-index: 999;
`;

const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    padding: 8px 15px;
    color: #333;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 18px;

    &:hover {
        background-color: #c0c0c0;
    }

    svg {
        margin-right: 8px;
    }
`;

const UserNameTag = styled.p`
    font-size: 18px;
    color: #5f5f5f;
    margin-right: 10px;
    margin-left: 10px;
`;

const Header = () => {
    const { user, handleLogout } = useAuth();
    const [currentTab, setCurrentTab] = useState(tabList[0].href);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // initialize current tab based on current path
        const currentPathSegs = window.location.pathname.split('/'); // '', 'app', '{tab}'
        if (currentPathSegs.length > 2 && currentPathSegs[1] === 'app') {
            setCurrentTab(currentPathSegs[2]);
        } else {
            console.log("current path doesn't contain app segs, skip setting current tab");
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                        $currentTab={currentTab}
                    >
                        {tab.label}
                    </Tab>
                ))}
            </TabContainer>
            <UserProfileContainer ref={dropdownRef} onClick={toggleDropdown}>
                <UserNameTag>Hi, {user?.username}</UserNameTag>
                <FaCircleUser size={40} color='#5F5F5F' />
                {isDropdownOpen && (
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                handleLogout();
                                setIsDropdownOpen(false);
                            }}
                        >
                            <FaSignOutAlt />
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                )}
            </UserProfileContainer>
        </HeaderContainer>
    );
};

export default Header;
