import Container from 'react-bootstrap/Container';
import { Outlet, useLoaderData } from 'react-router-dom';
import './css/main.css'
import { useEffect } from 'react';
import { authAction } from './store/actions/actions';
import { useDispatch } from 'react-redux';

export default function Main(){
    
    return (
        <>
            <Container fluid className='main'>
                <Outlet />
            </Container>
        </>
    )
}