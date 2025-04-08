import Dashboard from './Dashboard';
import Channels from './Channels';
import Queue from './Queue';
import Developer from './Developer';

export const tabList = [
    { label: 'Dashboard', href: 'dashboard', comp: Dashboard },
    { label: 'Channels', href: 'channels', comp: Channels },
    { label: 'Post-Queue', href: 'post_queue', comp: Queue },
    process.env.REACT_APP_STAGE === 'dev' && {
        label: 'Developer',
        href: 'developer',
        comp: Developer,
    },
];
