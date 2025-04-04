import Dashboard from './Dashboard';
import Channels from './Channels';
import Schedules from './Schedules';
import Assets from './Assets';
import Developer from './Developer';

export const tabList = [
    { label: 'Dashboard', href: 'dashboard', comp: Dashboard },
    { label: 'Channels', href: 'channels', comp: Channels },
    { label: 'Schedules', href: 'schedules', comp: Schedules },
    { label: 'Assets', href: 'assets', comp: Assets },
    { label: 'Developer', href: 'developer', comp: Developer },
];
