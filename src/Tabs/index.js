import Home from './Home';
import Accounts from './Accounts';
import Schedules from './Schedules';
import Assets from './Assets';

export const tabList = [
    { label: 'Home', href: '/', comp: Home },
    { label: 'Accounts', href: '/account_info', comp: Accounts },
    { label: 'Schedules', href: '/schedules', comp: Schedules },
    { label: 'Assets', href: '/assets', comp: Assets },
];
