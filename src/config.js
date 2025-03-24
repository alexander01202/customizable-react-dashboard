import App from './App';
import SecondaryPage from './secondaryPage';
import { BiError } from "react-icons/bi";
import { TbWorldPin } from "react-icons/tb";
import Summary from './summary';
import Profile from './profile';
import Admin from './admin';
import RoundupArticles from './roundupArticles';

export const PAGES_NAMES_AND_COMPONENT = [
    { page_name: "SEC Alerts", component: <App />, path: "/", icon:<TbWorldPin />  },
    // { page_name: "SEC Alerts", component: <App />, path: "/" },

    // { page_name: "CSV Articles", component: <App />},
    { page_name: "Error Page", component: <SecondaryPage />, icon: <BiError /> },
    // { page_name: "Roundup Articles", component: <RoundupArticles /> },
    // { page_name: "Profile", component: <Profile /> },
    // { page_name: "Admin", component: <Admin /> }
];
