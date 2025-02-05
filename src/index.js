import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import Login from './login';
import Main from './main';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainNavbar from './navbar';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider
} from "react-router-dom";
import { verifyAuthToken, log_in_admin } from './utils/auth';
import { PAGES_NAMES_AND_COMPONENT } from './config';
import { authAction } from './store/actions/actions';
import LoaderPage from './loader';

function AppRouter() {
  const authId = useSelector(state => state.auth.id);
  const [childrenPages, SetChildrenPages] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [routerKey, setRouterKey] = useState(0); // 🔹 Key to force re-render
  // const dispatch = useDispatch()
  // const loggedInToken = verifyAuthToken()

  useEffect(() => {
    const newPages = PAGES_NAMES_AND_COMPONENT.map(({ page_name, component, path }) => ({
      path: `${path ? path : "/"+page_name.toLowerCase().replace(' ', '-')}`,
      element: component,
    }));
    SetChildrenPages(newPages);
  }, [authId])

  useEffect(() => {
    console.log("isLoading: ", isLoading)
  }, [isLoading])
  
  const setIsLoaded = () => {
    setIsLoading(false)
    setRouterKey(prevKey => prevKey + 1);
  }

  const router = useMemo(() => {
    return createBrowserRouter([
      isLoading
        ? {
            path: "*",
            element: <LoaderPage setIsLoaded={setIsLoaded} />,
            loader: log_in_admin,
          }
        : authId
        ? {
            path: "/",
            element: <MainNavbar />,
            children: childrenPages,
          }
        : {
            path: "/",
            element: <Main />,
            children: [{ path: "/", element: <Login /> }],
          },
    ]);
  }, [isLoading, authId, childrenPages]); // Update router when these change

  return <RouterProvider router={router} key={routerKey}/>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
