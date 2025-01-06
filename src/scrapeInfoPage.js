import { useEffect, useRef, useState } from "react"
import { REACT_APP_BACKEND_URL } from "./dev_variables"
import { useLoaderData, useParams } from "react-router-dom"
import Card from 'react-bootstrap/Card';
import { Col, Container, Row, Form, InputGroup, Stack } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaExternalLinkAlt } from "react-icons/fa";
import Carousel from 'react-bootstrap/Carousel';
import { MdOutlineEdit } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as chartJsTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import './css/scrapeInfo.css'
import Lottie from "react-lottie";
import summaryImg from './lottie/summary3.json'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {Tooltip } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  chartJsTooltip,
  Legend
);

const chart_options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const chart_labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const chart_data = {
  labels:chart_labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: chart_labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      borderColor: '#f00',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: chart_labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
      borderColor: '#0056ff',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export default function ScrapeInfoPage() {
  const intervalIdRef = useRef(null);
  const data = useLoaderData()
  const [urlId, setUrlId] = useState('')
  const [location, setLocation] = useState('')
  const [urlInfos, setUrlInfos] = useState({})
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState(0)
  const [summary, setSummary] = useState('')
  const [entity, setEntity] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [scrapingInfo, setScrapingInfo] = useState({ 
    progress:data && data.scrape_progress, 
    status_text:data && data.scrape_status_text, 
    scrape_status:data && data.scrape_status,
    color:data && data.scrape_progress_color
  })
  const [editData, setEditData] = useState(false)
  const [isUpdatingData, setIsUpdatingData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {subdomain_id, url_id, type} = useParams()

  useEffect(() => {

    if(!editData){
      const updateUI = async() => {
        const req = await fetch(`${REACT_APP_BACKEND_URL}/subdomain/${subdomain_id}/urls/${url_id}`)
        const {status, result} = await req.json()
        if(status){
          setUrlInfos((prev) => ({
            ...prev,
            url_id:result._id,
            subdomain_id:result.subdomain_id,
            subdomain:result.subdomain,
            subdomain_type:result.subdomain_type,
            search_engine_url_id:result.search_engine_url_id,
            location:result.location,
            status:result.status,
            scrape_status:result.scrape_status,
            scrape_status_text:result.scrape_status_text,
            scrape_progress:result.scrape_progress,
            scrape_progress_color:result.scrape_progress_color,
            url:result.url,
            title:result.title,
            summary:result.summary,
            entity:result.entity,
            price:result.price,
            job_type:result.job_type,
            type_of_workplace:result.type_of_workplace,
            price_currency_in_symbol:result.price_currency_in_symbol,
            price_currency_in_words:result.price_currency_in_words,
            salary:result.salary,
            salary_currency_in_symbol:result.salary_currency_in_symbol,
            salary_currency_in_words:result.salary_currency_in_words,
            thumbnails:result.thumbnails
          }))
          setScrapingInfo(prev => ({
            ...prev,
            progress: result.scrape_progress,
            status_text: result.scrape_status_text,
            scrape_status: result.scrape_status,
          }))
        }
        setIsLoading(false)
      }
      try {
        updateUI()
      } catch (error) {
        toast.error(error)
      }
    }
  
  }, [])

  useEffect(() => {
    if(urlInfos.summary || urlInfos.title || urlInfos.entity){
      setIsLoading(false)
    }
  }, [urlInfos.summary, urlInfos.title, urlInfos.entity])
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: summaryImg,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  
  const startScrape = async() => {
    setIsScraping(true)
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const queryString = new URLSearchParams({
      subdomain_id: subdomain_id,
      search_engine_url_id: urlInfos.search_engine_url_id
    }).toString();
    const req = await fetch(`${REACT_APP_BACKEND_URL}/url/delete/${urlInfos.url_id}?${queryString}`)
    const { status } = await req.json()

    if(status){
      const req = await fetch(`${REACT_APP_BACKEND_URL}/url/add/${urlInfos.url_id}?${queryString}`, {
        method: 'POST',
        body: JSON.stringify(urlInfos),
        headers
      })
      toast.success('URL being scraped. Check again later for update.')
    }else{
      toast.error("URL couldn't be rescraped but was deleted.")
    }
  }

  const updateData = async() => {
    setIsUpdatingData(true)
    try {
      let headers = new Headers();
  
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      const req = await fetch(`${REACT_APP_BACKEND_URL}/update/scrapeData`, {
        method:'POST',
        headers,
        body: JSON.stringify({
          summary,
          title,
          entity,
          location,
          price,
          url_id:urlId,
          scrape_status_text: scrapingInfo.status_text,
          scrape_progress: scrapingInfo.progress,
          scrape_status: scrapingInfo.scrape_status,
          scrape_progress_color: scrapingInfo.color
        })
      })
      const {status, result} = await req.json()
      setIsUpdatingData(false)
      if (!status) {
        toast.error(result)
        return
      }
      setEditData(false)
      toast.success(result)
    } catch (error) {
      setIsUpdatingData(false)
      toast.error(error)
    }
  }

  const customImg = () => (
    <Lottie 
      options={defaultOptions}
      height={'10%'}
      width={'100%'}
      isClickToPauseDisabled={true}
    />
  )

  return (
    <>
    <Container fluid>
      {
        isLoading
        ?
        <Row>
          <Col md={4}>
            <Skeleton style={{ width: '100%',minHeight:'100vh', height:"100%" }} className="box box-skeleton"/>
          </Col>
          <Col md={7}>
            <Row className="mb-4">
              <Col>
                <Skeleton className='box mx-2 p-3 align-content-center box-skeleton'/>
              </Col>
              <Col>
                <Skeleton className='box mx-2 p-3 align-content-center box-skeleton'/>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <Skeleton style={{ minHeight:'300px' }} className='box mx-2 p-3 align-content-center box-skeleton'/>
              </Col>
            </Row>
            <Row className="">
              <Col>
                <Skeleton style={{ minHeight:'300px' }} className='box mx-2 p-3 align-content-center box-skeleton'/>
              </Col>
            </Row>
          </Col>
        </Row>
        :
        <Row>
          <Col md={4}>
            <Card style={{ width: '100%',minHeight:'100%' }} className="box">
              <Card.Img variant="top" as={customImg}/>
              <Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item className='mb-2 rounded'>
                    <Card.Title className='d-flex align-items-center justify-content-between'>
                      <b><h3>Entity</h3></b>
                      {
                        !editData &&
                        <h5 onClick={() => setEditData(true)} style={{ cursor:'pointer' }}><MdOutlineEdit /></h5>
                      }
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <b>
                        {editData 
                          ?
                          <InputGroup className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Entity"
                              className="me-2 main-input"
                              aria-label="Entity"
                              value={urlInfos.entity}
                              onChange={(e) => setEntity(e.target.value)}
                            />
                          </InputGroup>
                          :
                            <h5>{urlInfos.entity}</h5>
                        }
                      </b>
                    </Card.Subtitle>
                  </ListGroup.Item>
                  <ListGroup.Item className='mb-2 rounded'>
                    <Card.Title className='d-flex align-items-center justify-content-between'>
                      <b><h3>{type === 'rental' ? 'Price' : 'Salary'}</h3></b>
                      {
                        !editData &&
                        <h5 onClick={() => setEditData(true)} style={{ cursor:'pointer' }}><MdOutlineEdit /></h5>
                      }
                    </Card.Title>
                    <Card.Text className="mb-2 text-muted">
                      <b>
                        {editData
                          ?
                          <InputGroup className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder={type === 'rental' ? "Price" : "Salary"}
                              className="me-2 main-input"
                              aria-label="Price"
                              value={type === 'rental' ? urlInfos.price : urlInfos.salary}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </InputGroup>
                          :
                            <h6>{type === 'job' ? urlInfos.salary : urlInfos.price}</h6>
                        }
                      </b>
                    </Card.Text>
                  </ListGroup.Item>
                  <ListGroup.Item className='mb-2 rounded'>
                    <Card.Title className='d-flex align-items-center justify-content-between'>
                      <b><h3>Title</h3></b>
                      {
                        !editData &&
                        <h5 onClick={() => setEditData(true)} style={{ cursor:'pointer' }}><MdOutlineEdit /></h5>
                      }
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <b>
                        {editData 
                          ?
                          <InputGroup className="mb-3">
                            <Form.Control
                              type="text"
                              placeholder="Title"
                              className="me-2 main-input"
                              aria-label="Title"
                              value={urlInfos.title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </InputGroup>
                          :
                          <h5>{urlInfos.title}</h5>
                        }
                      </b>
                    </Card.Subtitle>
                  </ListGroup.Item>
                  <ListGroup.Item className='mb-2 rounded'>
                    <Card.Title className='d-flex align-items-center justify-content-between'>
                      <b><h3>Summary</h3></b>
                      {
                        !editData &&
                        <h5 onClick={() => setEditData(true)} style={{ cursor:'pointer' }}><MdOutlineEdit /></h5>
                      }
                    </Card.Title>
                    <Card.Text className="mb-2 text-muted">
                      <b>
                        {
                          editData 
                          ?
                          <InputGroup className="mb-3">
                            <Form.Control
                              type="text"
                              as='textarea'
                              placeholder="Summary"
                              className="me-2 main-input"
                              aria-label="Summary"
                              value={urlInfos.summary}
                              onChange={(e) => setSummary(e.target.value)}
                            />
                          </InputGroup>
                          :
                          <h5>{urlInfos.summary}</h5>
                        }
                      </b>
                    </Card.Text>
                  </ListGroup.Item>
                </ListGroup>
                {
                  editData &&
                  <Stack gap={3} direction='horizontal'>
                    <Button disabled={isUpdatingData} onClick={updateData} size="md" variant='success'>Save Changes</Button>
                    <Button disabled={isUpdatingData} onClick={() => setEditData(false)} size="md" variant='secondary'>Cancel</Button>
                  </Stack>
                }
              </Card.Body>
            </Card>
          </Col>
          <Col md={7}>
            <Row className="mb-4">
              <Col className="box mx-2 p-3 align-content-center">
                <div>
                  <b><h3>Subdomain</h3></b>
                  <a
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ellipses" 
                    href={urlInfos.subdomain}
                  >
                    {urlInfos.subdomain}
                  </a>
                </div>
              </Col>
              <Col className="box mx-2 p-3 align-content-center">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <b><h3>URL</h3></b>
                  <h3>
                    <Button 
                      disabled={urlInfos.scrape_status}
                      onClick={startScrape}
                      size="md" 
                      variant="dark"
                    >
                      Redo Scrape
                    </Button>
                    </h3>
                  {/* <FaExternalLinkAlt /> */}
                </div>
                <OverlayTrigger
                  placement='top'
                  overlay={
                    <Tooltip id={`tooltip-top`}>
                      <strong>{urlInfos.url}</strong>.
                    </Tooltip>
                  }
                >
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ellipses" 
                    href={urlInfos.url}
                  >
                    {urlInfos.url}
                  </a>
                </OverlayTrigger>
                </div>
              </Col>
            </Row>
            {
              urlInfos.subdomain_type === 'rental' &&
              <Row className="mb-4">
                <Col className="box p-0 mx-2">
                  <Carousel fade>
                  {
                    urlInfos.thumbnails.map(thumbnail => (
                      <Carousel.Item>
                        <img src={thumbnail} alt="thumbnail" />
                      </Carousel.Item>
                    ))
                  }
                  </Carousel>
                </Col>
              </Row>
            }
            <Row className="mb-4">
              <Col className="box mx-2 p-3 align-content-center">
                <Line data={chart_data} />
              </Col>
            </Row>
            <Row>
              <Col className="box mx-2 p-3 align-content-center">
                <div>
                  <b><h3>Scraping Progress</h3></b>
                  <ProgressBar
                    animated={urlInfos.scrape_status}
                    striped
                    variant={urlInfos.scrape_progress_color}
                    label={`${urlInfos.scrape_progress}%`} 
                    now={urlInfos.scrape_progress} 
                  />
                  <h5 style={{ textAlign:"center" }}>{urlInfos.scrape_status_text}</h5>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      }
    </Container>
    <ToastContainer />
    </>
  )
}

export async function Loader({ params }){
  const { subdomain_id, url_id, type } = params
  const req = await fetch(`${REACT_APP_BACKEND_URL}/subdomain/${subdomain_id}/urls/${url_id}`)
  const res = await req.json()
  return {...res, type}
}
