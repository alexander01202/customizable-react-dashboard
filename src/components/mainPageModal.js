import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { REACT_APP_BACKEND_URL, MAIN_PAGE_MODAL_DEFAULT_INFO, MAIN_PAGE_MODAL_INPUT_OPTIONS, MAIN_PAGE_MODAL_TITLE, MAIN_PAGE_MODAL_BUTTON_TEXT } from '../dev_variables';


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
    let val = e.target.value

    //  Check if a file was uploaded for this input
    if (e.target.files && e.target.files.length > 0) {
      val = e.target.files[0]
      console.log("uploaded a file: ", val.name)
    }

    Object.keys(MAIN_PAGE_MODAL_DEFAULT_INFO).forEach(key => {
      if (typeof MAIN_PAGE_MODAL_DEFAULT_INFO[key] == 'boolean' && e.target.id === key) {
        val = Boolean(e.target.value !== "true")
      }

      if (e.target.id === key) {
        setModalInfo(prev => ({
          ...prev,
          [e.target.id]:val
        }))
      }
    });
  }

  const addData = async() => {
    console.log("adding data...")
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    var url = REACT_APP_BACKEND_URL + '/csvarticle'

    try {
      const formData = new FormData();
      Object.keys(modalInfo).forEach(key => {
        formData.append(`${key}`, modalInfo[key]);
      })

      const req = await fetch(url, {
        method:'POST',
        body: formData,
        headers
      })
      const {status, data} = await req.json()
      if (status) {
        if (show) {
          toast.success(`csv articles successfully added`)
        }
        handleModalClose()
        return
      }
      throw new Error(data);
    } catch (err) {
      setIsLoading(false)
      toast.error(err)
    }
  }

  const handleModalClose = () => {
      setModalInfo(MAIN_PAGE_MODAL_DEFAULT_INFO);
      setIsLoading(false)
      handleShow();
      onSuccess()
  };

  const processForm = async(e) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      // Only validate those who are required
      Object.keys(modalInfo).forEach((key) => {
        const option = MAIN_PAGE_MODAL_INPUT_OPTIONS.find(
          (item) => item.value_reference === key
        );
        if (option?.required === undefined && (modalInfo[key]?.length < 1)) {
          throw new Error(`Invalid ${key}`);
        }
      });
      await addData()
    } catch (err) {
      setIsLoading(false)
      toast.error(err.message)
    }
  }

 
  return (
    <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>{MAIN_PAGE_MODAL_TITLE}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={processForm}>
            {
              MAIN_PAGE_MODAL_INPUT_OPTIONS.map((options, i) => (
                <Form.Group className="mb-3" key={i}>
                  {
                    ['switch', 'checkbox'].includes(options.type)
                    ?
                    <Form.Check
                      defaultChecked={modalInfo[`${options.value_reference}`]}
                      id={`${options.value_reference}`}
                      type={options.type}
                      value={modalInfo[`${options.value_reference}`]}
                      label={options.label}
                      onChange={changeSubdomain}
                    />
                    :
                    <>
                      <Form.Label>{options.label}</Form.Label>
                      <Form.Control
                        id={`${options.value_reference}`}
                        as={options.type == "textarea" ? options.type : 'input'}
                        type={options.type}
                        placeholder={options?.placeholder}
                        {...(options.required === undefined && { required: true })} // Add `required` only if true
                        {...(options.accept && { accept: options.accept })} // Add `required` only if true
                        value={options.type === "file" ? undefined : modalInfo[`${options.value_reference}`] }
                        onChange={changeSubdomain}
                      />
                    </>
                  }
                </Form.Group>
              ))
            }
            <Modal.Footer>
              <Button variant="secondary" onClick={handleShow}>
                Close
              </Button>
              <Button type='submit' disabled={isLoading} variant="success" >
                {MAIN_PAGE_MODAL_BUTTON_TEXT}
              </Button>
              
            </Modal.Footer>
          </Form>
        </Modal.Body>
    </Modal>
  )
}
