import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { REACT_APP_BACKEND_URL, MAIN_PAGE_MODAL_DEFAULT_INFO, MAIN_PAGE_MODAL_INPUT_OPTIONS, MAIN_PAGE_MODAL_TITLE, MAIN_PAGE_MODAL_BUTTON_TEXT } from '../dev_variables';
import { countries } from './countries';
import { CustomMenu, CustomToggle } from './customDropdown';

export default function MainPageModal({ handleShow, show, toast, onSuccess, modalInfoParam }) {
  const [modalInfo, setModalInfo] = useState(MAIN_PAGE_MODAL_DEFAULT_INFO)
  const [isAddingSubdomain, setIsAddingSubdomain] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (modalInfoParam) {
      Object.keys(MAIN_PAGE_MODAL_DEFAULT_INFO).forEach(key => {
        setModalInfo(prev => ({
          ...prev,
          [key]:modalInfoParam?.[key],
        }))
      });
    }
  }, [modalInfoParam])
    
  const changeSubdomain = (e) => {
    Object.keys(MAIN_PAGE_MODAL_DEFAULT_INFO).forEach(key => {
      setModalInfo(prev => ({
        ...prev,
        [e.target.id]:e.target.value
      }))
    });
  }
  
  const changeSubdomainType = (subdomain_type) => {
    setModalInfo((prev) => ({
        ...prev,
        subdomain_type
    }))
  }

  const changeModalLocation = (location) => {
    setModalInfo((prev) => ({
        ...prev,
        location
    }))
  };

  const addSubdomain = async() => {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    var req = {
      domain_type:modalInfo.subdomain_type, 
      subdomain:modalInfo.subdomain, 
      location:modalInfo.location, 
      status:true
    }
    var url = REACT_APP_BACKEND_URL + '/subdomains'
    if (modalInfo.subdomain_id.length > 0) {
      url = REACT_APP_BACKEND_URL + '/update/subdomain'
      req = {...req, subdomain_id: modalInfo.subdomain_id}
    }

    fetch(url, {
      method:'POST',
      body: JSON.stringify(req),
      headers,
    })
    .then(response => {
      if(response.status < 200 || response.status > 300){
        toast.error(response.statusText)
        return
      }
      toast.success(`Subdomain ${modalInfo.subdomain_id.length > 0 ? 'updated' : 'added'} successfully`)
      onSuccess()
      setModalInfo(prev => ({
        ...prev,
        location:'',
        subdomain: '',
        subdomain_id:''
      }))
      handleShow()
    })
    .catch(err => {
      toast.error(err.message)
    })
    setIsLoading(false)
  }

  const verifyModalInputs = async(e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log("modalInfo: ", modalInfo)
      Object.keys(modalInfo).map(key => {
        if (modalInfo[key]?.length < 1) {
          throw new Error(`Invalid ${key}`);
        }
      })
      
      // const req = await fetch(REACT_APP_BACKEND_URL + '/verifyurl?url=' + modalInfo.subdomain)
      // if (req.status !== 200) {
      //     toast.error(req.statusText)
      //     return
      // }
      // const res = await req.json()
      // if(res['valid']){
      //     return addSubdomain()
      // }
      // toast.error(res['err'])
      toast.success('Added successfully')
    } catch (err) {
      toast.error(err.message)
    } finally{
      setIsLoading(false)
    }
  }

 
  return (
    <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <Modal.Title>{MAIN_PAGE_MODAL_TITLE}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {
              MAIN_PAGE_MODAL_INPUT_OPTIONS.map(options => (
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  
                  {
                    ['switch', 'checkbox'].includes(options.type)
                    ?
                    <Form.Check
                      type={options.type}
                      value={modalInfo[`${options.value_reference}`]}
                      label={options.label}
                    />
                    :
                    <>
                      <Form.Label>{options.label}</Form.Label>
                      <Form.Control
                        id={`${options.value_reference}`}
                        as={options.type == "textarea" ? options.type : 'input'}
                        type={options.type}
                        placeholder={options?.placeholder}
                        required={options.required ? options.required : true}
                        value={modalInfo[`${options.value_reference}`]}
                        onChange={changeSubdomain}
                      />
                    </>
                  }
                </Form.Group>
              ))
            }
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Subdomain</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://www.ar.example.com"
                required
                value={modalInfo.subdomain}
                onChange={changeSubdomain}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>TYPE</Form.Label>
              <DropdownButton defaultValue={modalInfo.subdomain_type} variant='dark' id="dropdown-basic-button" title={modalInfo.subdomain_type.toUpperCase()}>
                <Dropdown.Item onClick={() => changeSubdomainType('job')}>Job</Dropdown.Item>
                <Dropdown.Item onClick={() => changeSubdomainType('real estate')}>Real Estate</Dropdown.Item>
              </DropdownButton>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Location</Form.Label>
              <Dropdown>
                <Button variant='dark'>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                  { modalInfo.location.length > 0 ? modalInfo.location :'Choose Country'}
                </Dropdown.Toggle>
                </Button>
                <Dropdown.Menu 
                  style={{ height:'300px',overflowY:'scroll' }} 
                  as={CustomMenu}
                  variant='dark' 
                  id="dropdown-basic-button"
                >
                  {
                    countries.map(country => (
                      <Dropdown.Item key={country} onClick={() => changeModalLocation(country)}>{country}</Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group> */}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleShow}>
                Close
              </Button>
              <Button disabled={isLoading} variant="success" onClick={verifyModalInputs}>
                {MAIN_PAGE_MODAL_BUTTON_TEXT}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
    </Modal>
  )
}
