import { Link, useLoaderData, useParams } from 'react-router-dom';
import { Stack, Button, Form, Table, Container } from "react-bootstrap";
import { BallTriangle } from 'react-loader-spinner'
import { useState,useEffect } from 'react';
import { IoCheckmarkDoneSharp, IoReturnUpBack } from "react-icons/io5";
import './css/App.css'
import './css/urlsPage.css'
import AddNewUrlModal from './components/addNewUrlModal';
import { REACT_APP_BACKEND_URL } from './dev_variables';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Tooltip from 'react-bootstrap/Tooltip';
import Lottie from 'react-lottie';
import not_found from './lottie/not_found.json'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { FaExternalLinkAlt } from "react-icons/fa";
import CenteredModal from './components/centeredModal';
import PagnationBtn from './components/pagnationBtn';

export default function UrlsPage({ params }) {
  const [activeIndex, setActiveIndex] = useState({0:false, 1:false,2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false  });
  const [modalInfo, setModalInfo] = useState({show:false, beginScrape:true, urlInfo:{} })
  const [deleteModal, setDeleteModal] = useState({show:false,  url:null, url_id: null})
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshUrls, setRefreshUrls] = useState(false)
  const {subdomain_id, search_engine_url_id, type} = useParams()
  const [pageNum, setPageNum] = useState(1)

  useEffect(() => {
    setIsLoading(true)
    const fetchUrls = async() => {
      try {
        const req = await fetch(`${REACT_APP_BACKEND_URL}/searchEngineUrls/${search_engine_url_id}/urls`)
        let {status, result} = await req.json()
        if(status){
          setData(result)
        }
        setIsLoading(false)
      } catch (error) {
        toast.error("Error Fetching URLS")
      }
    }

    fetchUrls()
  }, [refreshUrls])
  
  
  const selectDomain = (index) => {
    setActiveIndex((prevActiveIndex) => ({
      ...prevActiveIndex,
      [index]: !prevActiveIndex[index],
    }));
  };

  const selectAllDomain = () => {
      Object.keys(activeIndex).forEach((key) => {
        setActiveIndex((prevActiveIndex) => ({
          ...prevActiveIndex,
          [key]: !prevActiveIndex[key],
        }));
      });
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: not_found,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const handleShow = () => {
    setModalInfo(prev => ({
      ...prev,
      show:!modalInfo.show
    }))
  };

  const passUrlInfotoModal = (urlInfo) => {
    setModalInfo((prev) => ({
      ...prev,
      urlInfo
    }))
    handleShow()
  }

  const refreshPage = () => {
    setRefreshUrls(!refreshUrls)
  }

  const deleteUrl = async() => {
    const queryString = new URLSearchParams({
      subdomain_id: subdomain_id,
      search_engine_url_id
    }).toString();
    const req = await fetch(`${REACT_APP_BACKEND_URL}/url/delete/${deleteModal.url_id}?${queryString}`)
    const res = await req.json()
    if (res && res.status) {
      handleDeleteModal()
      toast.success('URL deleted successfully.')
      refreshPage()
    }else{
      toast.error(res.error)
    }
  }

  const handleDeleteModal = () => {
    setDeleteModal(prev => ({
      ...prev,
      show: !deleteModal.show,
      url:null,
      url_id:null
    }))
  }

  const openAddUrlModal = () => {
    setModalInfo(prev => ({
      ...prev,
      urlInfo:{},
      show: true
    }))
  }

  const change_page_num = (num) => {
    setPageNum(num)
  }

  return (
    <>
      <CenteredModal
        show={deleteModal.show}
        onSuccess={deleteUrl}
        onHide={handleDeleteModal}
        header={`Delete URL?`}
        body={`Are you sure you want to delete <strong>${deleteModal.url}</strong>? <br />.`}
        successText='Yes, Delete.'
      />
      {
        subdomain_id && search_engine_url_id &&
      <AddNewUrlModal onSuccess={refreshPage} subdomain_type={type} search_engine_url_id={search_engine_url_id} toast={toast} urlDetails={modalInfo.urlInfo} handleShow={handleShow} show={modalInfo.show} subdomain_id={subdomain_id} />
      }
        <Stack gap={2} className='my-3' direction='horizontal'>
          <Stack className='justify-content-start' gap={2} direction='horizontal'>
            <Button className='edit-btn' onClick={openAddUrlModal} size="md" variant="p-2 btn-dark">Add URLs</Button>
            <Button className='delete-btn' size="md" variant="p-2 btn-danger primary">Delete</Button>
          </Stack>
          <Form className="ms-auto d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="dark">Search</Button>
          </Form>
        </Stack>
        <Table striped hover>
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="input" onClick={selectAllDomain}/>
                  <span className="custom-checkbox"></span>
                </label>
              </th>
              <th>URL</th>
              <th>Progress</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
        <tbody>
        {
          isLoading ?
        <tr>
          <td colspan="6" className='text-center align-middle'>
          <BallTriangle
            height="80"
            width="80"
            color="#000"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{display:'block'}}
            wrapperClass="blocks-wrapper"
            visible={true}
          />
          </td>
        </tr>
        :
        data && data.length > 0 ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice((10 * pageNum) - 10, 10 * pageNum).map((item, index) => {
          const date = new Date(item['created_at']);
          // Format the date in a simpler way
          const options = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,      // To use AM/PM format
            day: 'numeric',
            month: 'short',    // Short month name
            year: 'numeric'
          };

          const formattedDate = date.toLocaleString('en-US', options);
          return (
          <tr className="table_row urlsPage">
            <td>
              <label>
                  {activeIndex[index] ?
                    <input checked type="checkbox" className="input" onClick={() => selectDomain(index)}/>
                  : 
                    <input type="checkbox" className="input" onClick={() => selectDomain(index)} checked={false}/>
                  }
                  <span className="custom-checkbox"></span>
              </label>
            </td>
            <td>
              <div className="d-flex align-items-center justify-content-left">
                <Link className="me-2 ellipsis" to={`${item['_id']}`}>
                  {item['url']}
                </Link>
                <a
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href={`${item['url']}`}
                >
                  <FaExternalLinkAlt color="blue" pointerEvents={'all'}/>
                </a>
              </div>
            </td>
            
            <td style={{ alignContent:'center' }}>
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip id={`tooltip-top`}>
                    <strong>{item['scrape_status_text']}</strong>
                  </Tooltip>
                }
              >
                <ProgressBar
                  animated={item['scrape_status']}
                  striped={item['scrape_status']}
                  variant={item['scrape_progress_color']}
                  label={item['scrape_status_text']}
                  now={item['scrape_progress']}
                />
              </OverlayTrigger>
            </td>
            <td>
              <Link to={item['_id']}>
                {formattedDate}
              </Link>
            </td>
            <td>
              <Button 
                className='edit-btn mx-2 mb-2'
                variant="p-2 btn-outline-dark"
                onClick={() => passUrlInfotoModal(item)}
              >
                Edit
              </Button>
              <Button 
                className='delete-btn mb-2' 
                variant="p-2 btn-danger"
                onClick={
                  () => setDeleteModal({ show:true, url:item['url'], url_id:item['_id']  })
                }
              >
                Delete
              </Button>
            </td>
            
        </tr>
      )}
    )
      :
      <tr>
        <td style={{ background:'transparent' }} colSpan={'5'}>
          <h1 className='my-2 empty-records'><b>No URLs Found for subdomain</b></h1>
          <Lottie 
            options={defaultOptions}
            height={500}
            width={500}
            isClickToPauseDisabled={true}
          />
        </td>
      </tr>
      }
    <ToastContainer />
  </tbody>
  </Table>
  {
    data && data.length > 0 &&
    <div className='d-flex' style={{ justifyContent:'center', alignItems:'center' }}>
      <PagnationBtn data_length={data.length} change_page_num={change_page_num} />
    </div>
  }
  </>
  )
}

export async function Loader({ params }){
  const search_engine_url_id = params.search_engine_url_id
  const req = await fetch(`${REACT_APP_BACKEND_URL}/searchEngineUrls/${search_engine_url_id}/urls`)
  let {status, result} = await req.json()
  // result['subdomain_id'] = subdomain_id
  // result['search_engine_url_id'] = search_engine_url_id

  return result
}