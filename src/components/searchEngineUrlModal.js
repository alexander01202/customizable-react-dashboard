import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CustomCheckButton from './customCheckButton';
import { REACT_APP_BACKEND_URL, SECONDARY_PAGE_MODAL_TITLE, SECONDARY_PAGE_MODAL_INPUT_OPTIONS, SECONDARY_PAGE_MODAL_DEFAULT_INFO, SECONDARY_PAGE_MODAL_BUTTON_TEXT } from '../dev_variables';

export default function SearchEngineUrlModal({ onSuccess, urlDetails, subdomain_type, show, handleShow, subdomain_id, toast  }) {
  const [searchEngineUrl, setSearchEngineUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [urlInfo, setUrlInfo] = useState()
  const [scrapeImmediately, setScrapeImmediately] = useState(true)
  const [modalInfo, setModalInfo] = useState(SECONDARY_PAGE_MODAL_DEFAULT_INFO)

  useEffect(() => {
    // setUrlInfo({})
    // setSearchEngineUrl('')
    // if (urlDetails && urlDetails._id) {
    //   setUrlInfo(urlDetails)
    //   setSearchEngineUrl(urlDetails.search_engine_url)
    // }

    // const get_subdomain = async() => {
    //     const req = await fetch(`${REACT_APP_BACKEND_URL}/subdomains/${subdomain_id}`)
    //     const res = await req.json()
  
    //     if (res){
    //       setSubdomainInfo((prev) => ({
    //         ...prev,
    //         subdomain:res.subDomainURL,
    //       }))
    //     }
    //   }
    //   get_subdomain()

  }, [urlDetails, show])

  const addUrl = async() => {
    return
  }

  const validateUrl = async(e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!searchEngineUrl.startsWith('https://')) {
      setIsLoading(false)
      toast.error('Invalid URL Format | Missing https://')
      return
    }
    console.log("searchEngineUrl ==>", searchEngineUrl)
    var req = await fetch(`${REACT_APP_BACKEND_URL}/verifyurl?url=${searchEngineUrl}`)
    var {valid, err} = await req.json()
    console.log("valid ==>", valid)
    
    if(valid){
      return addUrl()
    }
    toast.error(err)
    setIsLoading(false)
  }


  return (
    <Modal show={show} onHide={handleShow}>
      <Modal.Header closeButton={true}>
        <Modal.Title>{SECONDARY_PAGE_MODAL_TITLE}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={validateUrl}>
            {
              SECONDARY_PAGE_MODAL_INPUT_OPTIONS.map(options => (
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
                        as={options.type == "textarea" ? options.type : 'input'}
                        type={options.type}
                        placeholder={options?.placeholder}
                        required
                        value={modalInfo[`${options.value_reference}`]}
                        // onChange={changeSubdomain}
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
            <Button type='submit' disabled={isLoading || searchEngineUrl.length < 1} variant="success">
                {SECONDARY_PAGE_MODAL_BUTTON_TEXT}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
