import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';
import './css/login.css'
import { useState, useEffect } from 'react';
import { redirect } from 'react-router-dom';
import { authAction } from './store/actions/actions';
import { useDispatch, useSelector } from 'react-redux';
import { REACT_APP_BACKEND_URL, OWNER_NAME, DEVELOPMENT_PHASE } from './dev_variables';
import { ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [isLoginValid, setIsLoginValid] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    

    const changeEmail = (event) => {
        setEmail(event.target.value)
    }

    const changePassword = (event) => {
        setPassword(event.target.value)
    }
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    const loginAdmin = async(event) => {
        if (DEVELOPMENT_PHASE) {
            event.preventDefault();
            toast.success("You are being redirected!")
            await sleep(1500);
            dispatch(authAction.login({ id:1, email:"email", username:"result.username" }))
            return
        }
        event.preventDefault();
        if (!email || !password) {
            toast.error("Invalid Password or email")
            return
        }
        setIsLoading(true)
        const req = await fetch(REACT_APP_BACKEND_URL+'/login', {
            method:'POST',
            body:JSON.stringify({'email':email, 'password':password}),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const {status, result, token} = await req.json()
        if (!status){
            setIsLoading(false)
            toast.error(result)
            return
        }
        if (status && result._id) {
            // update redux state
            toast.success("You are being redirected!")
            await sleep(1500);
            var id = result._id
            localStorage.removeItem('token')
            localStorage.removeItem('token_expiration')
            localStorage.setItem('token', token)
            const expiration = new Date()
            expiration.setHours(expiration.getHours() + 1)
            localStorage.setItem('token_expiration', expiration.toISOString())
            dispatch(authAction.login({ id:id, email:email, username:result.username }))
            // return redirect('/dashboard')
        }
    }

  return (
   <>
   
   <Container 
             
            className="d-flex align-items-center justify-content-center"
            style={{ height:"100%" }}
        >
            <Form method="GET" className="login-bg">
                <div style={{ marginTop:"10rem !important"}} className='my-5'>
                    <h4>Welcome back</h4>
                    <h2>{OWNER_NAME}</h2>
                </div>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        name="email"
                        className="main-input"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={changeEmail}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        name="password"
                        className="main-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={changePassword}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <div style={{ marginTop:"8rem!important"}} className="d-grid gap-2 my-5">
                    <Button 
                        disabled={isLoading} 
                        onClick={loginAdmin} 
                        className="btn main-button" 
                        type="submit" 
                        size="lg"
                    >
                        <span>Submit</span>
                    </Button>
                </div>
            </Form>
            <ToastContainer />
        </Container>
   
   </>
   
    // <Container style={{"height":"100%"}} className='d-flex align-items-center justify-content-center'>
    //     <Form method='GET' className='login-bg'>
    //         <div className=''>
    //             <h4>Welcome back</h4>
    //             <h2>{OWNER_NAME}</h2>
    //         </div>
    //         <Form.Group className="mb-4" controlId="formBasicEmail">
    //             <Form.Label>Email address</Form.Label>
    //             <Form.Control 
    //                 name="email" 
    //                 className='main-input'
    //                 type="email"
    //                 placeholder="Enter email" 
    //                 value={email}
    //                 onChange={changeEmail}
    //                 required 
    //             />
    //         </Form.Group>

    //         <Form.Group className="mb-4" controlId="formBasicPassword">
    //             <Form.Label>Password</Form.Label>
    //             <Form.Control 
    //                 name="password" 
    //                 className='main-input'
    //                 type="password" 
    //                 placeholder="Password"
    //                 value={password}
    //                 onChange={changePassword}
    //                 required
    //             />
    //         </Form.Group>
            
    //         <Form.Group className="mb-3" controlId="formBasicCheckbox">
    //             <Form.Check type="checkbox" label="Remember me" />
    //         </Form.Group>
    //         <div className="d-grid gap-2 mt-5">
    //             <Button disabled={isLoading} onClick={loginAdmin} className='btn main-button' type="submit" size="lg">
    //                 <span>Submit</span>
    //             </Button>
    //         </div>
    //     </Form>
    //     <ToastContainer />
    // </Container>
  );
}
