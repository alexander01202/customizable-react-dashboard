import { Container, Row, Col } from 'react-bootstrap'
import Lottie from 'react-lottie';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import not_found from './lottie/2.json'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { REACT_APP_BACKEND_URL, OWNER_NAME } from './dev_variables';
import { authAction } from './store/actions/actions';
import { ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [email, setEmail] = useState(useSelector(state => state.auth.email))
  const dispatch = useDispatch()
  const user_id = useSelector(state => state.auth.id)
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [username, setUsername] = useState(useSelector(state => state.auth.username))
  const [isLoading, setIsLoading] = useState(false)

  const updateProfile = async() => {
    try {
      if(password !== repeatPassword || password.length < 1 || repeatPassword.length < 1){
        toast.error("Invalid Password")
        return
      }
      setIsLoading(true)
      await fetch(`${REACT_APP_BACKEND_URL}/update/user`, {
        method: 'POST',
        body: JSON.stringify({ id:user_id, username, password, email }),
        headers: {
          'Content-Type':'application/json'
        }
      })
      dispatch(authAction.login({ id:user_id, email, username }))
      toast.success("Profile Updated!")
      setIsLoading(false)
    } catch (err) {
      toast.error("An error occured. Try again later")
      setIsLoading(false)
    }
    // const res = await (await req).json()
  }
  

  return (
<>

<Container fluid style={{ color: '#fff' }} className="p-0"> {/* Remove extra padding */}
  <div className="my-4 text-center">
    <b><h2>Hey, {OWNER_NAME}</h2></b> {/* Reduce margin for a better layout */}
  </div>
  <Row className="gx-10"> {/* Remove horizontal gutter */}
    <Col xs={12} sm={6} lg={6}> {/* Use responsive breakpoints */}
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control 
          className='main-input'
          value={email} 
          type="email" 
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col xs={12} sm={6} lg={6}>
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control 
          className='main-input' 
          value={username} 
          type='text' 
          placeholder="Enter username" 
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
    </Col>
  </Row>
  <Row className="gx-10">
    <Col xs={12} sm={6} lg={6}>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control 
          className='main-input' 
          value={password} 
          type="password" 
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col xs={12} sm={6} lg={6}>
      <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
        <Form.Label>Repeat Password</Form.Label>
        <Form.Control 
          className='main-input' 
          value={repeatPassword} 
          type="password" 
          placeholder="Repeat password"
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      </Form.Group>
    </Col>
  </Row>
  <div className="d-flex justify-content-end mt-3">
    <Button 
      disabled={isLoading} 
      onClick={updateProfile} 
      size="md" 
      variant="light"
    >
      Save Changes
    </Button>
  </div>
  <ToastContainer />
</Container>


</>

    // <Container fluid style={{  color:'#fff' }}>
    //   <div className='my-5 '>
    //     <b><h2>Hey, {OWNER_NAME}</h2></b>
    //   </div>
    //   <Row>
    //     <Col>
    //       <Form.Group className="mb-3" controlId="formBasicEmail">
    //         <Form.Label>Email address</Form.Label>
    //         <Form.Control 
    //           className='main-input'
    //           value={email} 
    //           type="email" 
    //           placeholder="Enter email"
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //       </Form.Group>
    //     </Col>
    //     <Col>
    //       <Form.Group className="mb-3" controlId="formBasicUsername">
    //         <Form.Label>Username</Form.Label>
    //         <Form.Control 
    //           className='main-input' 
    //           value={username} 
    //           type='text' 
    //           placeholder="Enter username" 
    //           onChange={(e) => setUsername(e.target.value)}
    //         />
    //       </Form.Group>
    //     </Col>
    //   </Row>
    //   <Row>
    //     <Col>
    //       <Form.Group className="mb-3" controlId="formBasicPassword">
    //         <Form.Label>Password</Form.Label>
    //         <Form.Control 
    //           className='main-input' 
    //           value={password} 
    //           type="password" 
    //           placeholder="Enter password"
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </Form.Group>
    //     </Col>
    //     <Col>
    //       <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
    //         <Form.Label>Repeat Password</Form.Label>
    //         <Form.Control 
    //           className='main-input' 
    //           value={repeatPassword} 
    //           type="password" 
    //           placeholder="Repeat password"
    //           onChange={(e) => setRepeatPassword(e.target.value)}
    //         />
    //       </Form.Group>
    //     </Col>
    //   </Row>
    //   <div className='d-flex justify-content-end'>
    //     <Button 
    //       disabled={isLoading} 
    //       onClick={updateProfile} 
    //       size='md' 
    //       variant="light"
    //     >
    //       Save Changes
    //     </Button>
    //   </div>
    //   <ToastContainer />
    // </Container>
  )
}
