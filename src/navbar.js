import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { Outlet } from 'react-router-dom';
import { TiArrowSyncOutline } from "react-icons/ti";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { REACT_APP_BACKEND_URL, SIDE_NAVBAR_PAGES_NAME, LOGO_PATH } from './dev_variables';
import { PAGES_NAMES_AND_COMPONENT } from './config';
import { TbWorldPin } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Background from './components/background';
import Image from 'react-bootstrap/Image';
import './css/navbar.css';

export default function MainNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation()

  const handleHamburgerClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (paths) => {
    for (const path of paths) {
      if (location.pathname.includes(path)) {
        if (location.pathname !== '/' && path === '/') {
          continue
        }
        return 'active';
      }
    }
    return '';
  };
  

  return (
    <div className={isCollapsed ? 'wrapper collapse' : 'wrapper'}>
      <Background>
        <Outlet />
      </Background>
      <div style={{ display:'flex',position:'relative' }}>
        <div className="outer-sidebar" >
          <div className="top_navbar">
            <div className="hamburger" onClick={handleHamburgerClick}>
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
          </div>
          <div className="sidebar">
            <Container>
              <Stack className='mt-4' gap={3} style={{ padding:'10px' }}>
                <Image src={LOGO_PATH} />
                {
                  PAGES_NAMES_AND_COMPONENT.filter((item, index, self) =>
                    index === self.findIndex(t => t.page_name === item.page_name)
                  ).map(({ page_name, component, path }) => (
                    <Link 
                      to={`/${page_name.toLowerCase().replace(' ', '-')}`} 
                      className={isActive([`/${page_name.toLowerCase().replace(' ', '-')}`, path]) + ' p-2'}
                    >
                      <span className="icon"><TbWorldPin /></span>
                      <span className="title">{page_name}</span>
                    </Link>
                  ))
                }
              </Stack>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
