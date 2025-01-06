import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CustomCheckButton from './customCheckButton';
import { REACT_APP_BACKEND_URL } from '../dev_variables';

export default function AddNewUrlModal({ onSuccess, urlDetails, show, subdomain_type, handleShow, subdomain_id, search_engine_url_id, toast  }) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [urlInfo, setUrlInfo] = useState()
  const [scrapeImmediately, setScrapeImmediately] = useState(true)
  const [subdomainInfo, setSubdomainInfo] = useState({ url: '', location: '',type:subdomain_type })

  useEffect(() => {
    setUrlInfo({})
    setUrl('')
    if (urlDetails && urlDetails._id) {
      setUrlInfo(urlDetails)
      setUrl(urlDetails.url)
    }
    const get_subdomain = async() => {
      const req = await fetch(`${REACT_APP_BACKEND_URL}/subdomains/${subdomain_id}`)
      const res = await req.json()

      if (res){
        setSubdomainInfo((prev) => ({
          ...prev,
          url:res.subDomainURL
        }))
      }
    }
    get_subdomain()

  }, [urlDetails, show])

  const addUrl = async() => {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    var payload = { 
      subdomain_id:subdomain_id,
      subdomain_type:subdomainInfo.type,
      subdomain:subdomainInfo.url,
      search_engine_url_id:search_engine_url_id,
      url_id: '',
      url:url, 
      status: true,
      title:'',
      entity: '',
      summary:'',
      scrape_status: true,
      scrape_status_text: "getting website elements",
      scrape_progress: 15,
      scrape_progress_color: "info",
    }
    if (!scrapeImmediately) {
      payload['scrape_status'] = false
      payload['scrape_status_text'] = 'inactive'
      payload['scrape_progress_color'] = 'danger'
      payload['scrape_progress'] = 10
    }
    if (urlInfo && urlInfo._id){
      payload['url_id'] = urlInfo._id
      payload['status'] = urlInfo.status
      payload['scrape_status'] = urlInfo.scrape_status
      payload['scrape_status_text'] = urlInfo.scrape_status_text
      payload['scrape_progress_color'] = urlInfo.scrape_progress_color
      payload['scrape_progress'] = urlInfo.scrape_progress
      payload['thumbnails'] = urlInfo.thumbnails
    }
    if (urlInfo && urlInfo.subdomain_type === "job") {
      payload['salary'] = urlInfo.salary
      payload['salary_currency_in_symbol'] = urlInfo.salary_currency_in_symbol
      payload['salary_currency_in_symbol'] = urlInfo.salary_currency_in_symbol
    }
    if (urlInfo && (urlInfo.subdomain_type === "rentals" || urlInfo.subdomain_type === "real estate") ) {
      payload['price'] = urlInfo.price
      payload['price_currency_in_symbol'] = urlInfo.price_currency_in_symbol
      payload['price_currency_in_words'] = urlInfo.price_currency_in_words
    }
    const queryString = new URLSearchParams({
      subdomain_id,
      search_engine_url_id
    }).toString();
    var req_url = `${REACT_APP_BACKEND_URL}/url/add?${queryString}`
    if (urlInfo && urlInfo._id){
      req_url = `${REACT_APP_BACKEND_URL}/url/edit?${queryString}`
    }
    const req = await fetch(req_url ,{
        method: 'POST',
        body: JSON.stringify(payload),
        headers
    })
    const res = await req.json()
    setIsLoading(false)

    if (res && res.status) {
      toast.success(`URL ${urlInfo && urlInfo._id ? 'updated' : 'added'} successfully.`)
      onSuccess()
      handleShow()
    }else if(res && !res.status){
      toast.error(res.error)
    }
  }

  const validateUrl = async(e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!url.startsWith('https://')) {
      setIsLoading(false)
      toast.error('Invalid URL Format | Missing https://')
      return
    }
    var req = await fetch(`${REACT_APP_BACKEND_URL}/verifyurl?url=${url}`)
    var {valid, err} = await req.json()
    
    if(valid){
      return addUrl()
    }
    toast.error(err)
    setIsLoading(false)
  }
  

  return (
    <Modal show={show} onHide={handleShow}>
      <Modal.Header closeButton={true}>
        <Modal.Title>{urlInfo && urlInfo._id ? 'Edit' : 'Add'} a URL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={validateUrl}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://xxx.xxxxxxx.com"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>
          {
            (!urlInfo || !urlInfo._id) &&
            <Form.Group
              className="my-4"
              controlId="exampleForm.ControlTextarea1"
            >
              <CustomCheckButton checkedState={scrapeImmediately} onClickFunc={() => setScrapeImmediately(!scrapeImmediately)}/>
              <span className='ms-2 justify-self-center'>scrape immediately</span>
            </Form.Group>
          }
          <Modal.Footer>
            <Button disabled={isLoading} variant="secondary" onClick={isLoading ? null : handleShow}>
              Close
            </Button>
            <Button type='submit' disabled={isLoading || subdomainInfo.url.length < 1} variant="success">
            {urlInfo && urlInfo._id ? 'Update' : 'Add'} URL
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
