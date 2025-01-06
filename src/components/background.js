import React, { useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import '../css/components/background.css'
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar from '../assets/avatar.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { authAction } from '../store/actions/actions';

export default function Background({ children }) {
  const authId = useSelector(state => state.auth.id)
  const dispatch = useDispatch()

  const logout = () => {
    if (authId){
      toast.info('Logging you out.')

      try {
          localStorage.removeItem('token')
          localStorage.removeItem('token_expiration')
      } catch (error) {
          console.log(error)
      }finally{
          dispatch(authAction.logout())
      }
    }
  }

  return (
    <Container fluid className='subdomain-list'>
      <Row className='justify-content-end'>
        <div className="paste-button">
          <Image className='avatar' src={avatar} roundedCircle />
          <div className="dropdown-content">
            <Link id="top" to="/">Dashboard</Link>
            <Link onClick={logout} id="bottom">Logout</Link>
          </div>
        </div>
      </Row>
        {children}
      <ToastContainer />
    </Container>
  )
}

