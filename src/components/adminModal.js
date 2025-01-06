import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { REACT_APP_BACKEND_URL } from '../dev_variables';
import { Dropdown } from 'react-bootstrap';
import { CustomMenu, CustomToggle } from './customDropdown';

export function AdminModal({ show, handleShow, adminInfo, toast, onSuccess }){
    const [isLoading, setIsLoading] = useState(false)
    const [modalInfo, setModalInfo] = useState({ username:'', email:'', password:'', repeatPassword:'', role:'' })

    useEffect(() => {
        setModalInfo(prev => ({
            ...prev,
            email:adminInfo.email,
            password:'',
            repeatPassword:'',
            username:adminInfo.username,
            role:adminInfo.role
        }))

    }, [adminInfo])
    

    const admin_roles = [
        'owner', 'viewer'
    ]

    const changeRole = (admin_role) => {
        setModalInfo(prev => ({
            ...prev,
            role:admin_role
        }))
    }

    const addAdmin = async() => {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        var url = adminInfo.id && adminInfo.id.length > 0 ? `${REACT_APP_BACKEND_URL}/update/admin` : `${REACT_APP_BACKEND_URL}/add/admin`
        const payload = adminInfo.id && adminInfo.id.length > 0 ? {...modalInfo, id: adminInfo.id} : modalInfo
        const req = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        })
        toast.success(`Admin ${adminInfo.id && adminInfo.id.length > 0 ? 'updated' : 'added'} successfully!`)
        onSuccess()
        setIsLoading(false)
    }

    const verifyModalInputs = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        if (modalInfo.password !== modalInfo.repeatPassword) {
            toast.error('Passwords do not match')
            setIsLoading(false)
            return
        }
        if (modalInfo.role.length < 1) {
            toast.error('Please select a role')
            setIsLoading(false)
            return
        }
        addAdmin()
    }

    return (
        <Modal show={show} onHide={handleShow}>
            <Modal.Header closeButton={handleShow}>
                <Modal.Title>{adminInfo && adminInfo.id ? 'Edit' : 'Add'} Admin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={verifyModalInputs}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="John Doe"
                            value={modalInfo.username}
                            required
                            onChange={(e) => {
                                setModalInfo(prev => ({
                                    ...prev,
                                    username:e.target.value
                                }))
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@gmail.com"
                            value={modalInfo.email}
                            required
                            onChange={(e) => {
                                setModalInfo(prev => ({
                                    ...prev,
                                    email:e.target.value
                                }))
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="enter password"
                            required
                            value={modalInfo.password}
                            onChange={(e) => {
                                setModalInfo(prev => ({
                                    ...prev,
                                    password:e.target.value
                                }))
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="enter password again"
                            required
                            value={modalInfo.repeatPassword}
                            onChange={(e) => {
                                setModalInfo(prev => ({
                                    ...prev,
                                    repeatPassword:e.target.value
                                }))
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
                        <Form.Label>Role</Form.Label>
                        <Dropdown>
                            <Button variant='dark'>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                    { modalInfo.role.length > 0 ? modalInfo.role : 'Choose Admin Role'}
                                </Dropdown.Toggle>
                            </Button>
                            <Dropdown.Menu 
                                style={{ height:'300px',overflowY:'scroll' }} 
                                as={CustomMenu}
                                variant='dark' 
                                id="dropdown-basic-button"
                            >
                            {
                                admin_roles.map(admin_role => (
                                    <Dropdown.Item key={admin_role} onClick={() => changeRole(admin_role)}>{admin_role}</Dropdown.Item>
                                ))
                            }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShow}>
                            Close
                        </Button>
                        <Button type='submit' disabled={isLoading} variant="success">
                            {adminInfo.id ? 'Update' : 'Add'} Admin
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}