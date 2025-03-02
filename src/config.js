import App from './App';
import SecondaryPage from './secondaryPage';
import Summary from './summary';
import Profile from './profile';
import Admin from './admin';
import RoundupArticles from './roundupArticles';

export const PAGES_NAMES_AND_COMPONENT = [
    { page_name: "CSV Articles", component: <App />, path: "/" },
    // { page_name: "CSV Articles", component: <App />},
    { page_name: "Image Articles", component: <SecondaryPage /> },
    { page_name: "Roundup Articles", component: <RoundupArticles /> },
    { page_name: "Profile", component: <Profile /> },
    { page_name: "Admin", component: <Admin /> }
];
