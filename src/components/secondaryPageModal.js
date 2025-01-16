import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CustomCheckButton from './customCheckButton';
import { REACT_APP_BACKEND_URL, SECONDARY_PAGE_MODAL_TITLE, SECONDARY_PAGE_MODAL_INPUT_OPTIONS, SECONDARY_PAGE_MODAL_DEFAULT_INFO, SECONDARY_PAGE_MODAL_BUTTON_TEXT } from '../dev_variables';

export default function SecondaryPageModal({ onSuccess, show, handleShow, toast, modalInfoParam  }) {
  const [isLoading, setIsLoading] = useState(false)
  const [modalInfo, setModalInfo] = useState(SECONDARY_PAGE_MODAL_DEFAULT_INFO)

  useEffect(() => {
      if (modalInfoParam) {
        Object.keys(SECONDARY_PAGE_MODAL_DEFAULT_INFO).forEach(key => {
          setModalInfo(prev => ({
            ...prev,
            [key]:modalInfoParam?.[key],
          }))
        });
      }
  
    }, [modalInfoParam])

  const addData = async() => {
    console.log("adding data...")
    let headers = new Headers();

    headers.append('Accept', 'application/json');
    var url = REACT_APP_BACKEND_URL + '/imageArticle'

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
        onSuccess()
        if (show) {
          toast.success(`csv articles successfully added`)
        }
        Object.keys(SECONDARY_PAGE_MODAL_DEFAULT_INFO).forEach(key => {
          setModalInfo(prev => ({
            ...prev,
            [key]:SECONDARY_PAGE_MODAL_DEFAULT_INFO[key],
          }))
        });
        setIsLoading(false)
        handleShow()
        return
      }
      throw new Error(data);
    } catch (err) {
      setIsLoading(false)
      toast.error(err)
    }
  }

  const updateInputValue = (e) => {
    let val = e.target.value
    
    //  Check if a file was uploaded for this input
    if (e.target.files && e.target.files.length > 0) {
      val = e.target.files[0]
      console.log("uploaded a file: ", val.name)
    }

    Object.keys(SECONDARY_PAGE_MODAL_DEFAULT_INFO).forEach(key => {
      if (typeof SECONDARY_PAGE_MODAL_DEFAULT_INFO[key] == 'boolean' && e.target.id === key) {
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

  const processForm = async(e) => {
    e.preventDefault()
        
    try {
      setIsLoading(true)
      // Only validate those who are required
      Object.keys(modalInfo).forEach((key) => {
        const option = SECONDARY_PAGE_MODAL_INPUT_OPTIONS.find(
          (item) => item.value_reference === key
        );
        if (option?.required === undefined && (!modalInfo[key] || modalInfo[key].length < 1)) {
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
    <Modal show={show} onHide={handleShow}>
      <Modal.Header closeButton={true}>
        <Modal.Title>{SECONDARY_PAGE_MODAL_TITLE}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={processForm}>
            {
              SECONDARY_PAGE_MODAL_INPUT_OPTIONS.map((options, i) => (
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
                      onChange={updateInputValue}
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
                        onChange={updateInputValue}
                      />
                    </>
                  }
                </Form.Group>
              ))
            }
          <Modal.Footer>
            <Button disabled={isLoading} variant="secondary" onClick={isLoading ? null : handleShow}>
              Close
            </Button>
            <Button type='submit' disabled={isLoading} variant="success">
                {SECONDARY_PAGE_MODAL_BUTTON_TEXT}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
