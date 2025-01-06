import './css/App.css';
import { Stack, Button, Form, Table, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { Blocks, BallTriangle } from 'react-loader-spinner'
import './css/App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { REACT_APP_BACKEND_URL, MAIN_PAGE_DASHBOARD_HEADERS, MAIN_PAGE_FAKE_DATA, DEVELOPMENT_PHASE } from './dev_variables';
import Lottie from 'react-lottie';
import not_found from './lottie/not_found.json'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { countries } from './components/countries';
import CenteredModal from './components/centeredModal';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import MainPageModal from './components/mainPageModal';

function App() {
  const [activeIndex, setActiveIndex] = useState({});
  const [data, setData] = useState(DEVELOPMENT_PHASE ? MAIN_PAGE_FAKE_DATA : [])
  const [modalInfo, setModalInfo] = useState({show:false, subdomain:'', location:'', error:''})
  const [deleteModal, setDeleteModal] = useState({show:false,  subdomain:null, subdomain_id: null})
  const [deleteManyModal, setDeleteManyModal] = useState({show:false,  count:0})
  const [refreshData, setRefreshData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editSubdomainInfo, setEditSubdomainInfo] = useState({ subdomain_id:'', location:'', subdomain_type:'', subdomain:'' })
  const [selectedAllDomains, setSelectedAllDomains] = useState(false)

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      setActiveIndex(prev => ({
        ...prev,
        [i]: activeIndex?.i ? activeIndex.i : false
      }))
    }

  }, [data])

  useEffect(() => {
    setIsLoading(true)
    const getData = async() => {
      try {
        await sleep(500);
        setIsLoading(false)
      } catch (error) {
        toast.error(error)
      }
    }
    getData()
  }, [refreshData])
  
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: not_found,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const selectDomain = (index) => {
    const newActiveIndex = {...activeIndex, [index]: !activeIndex[index]}

    // Step 1: Get all entries [key, value] pairs
    const entries = Object.entries(newActiveIndex);

    // Step 2: Filter out entries where the value is not true
    const trueEntries = entries.filter(([key, value]) => value === true);
    setDeleteManyModal(prev => ({
      ...prev,
      count: trueEntries.length
    }))
    if (trueEntries.length === Object.keys(newActiveIndex).length) {
      setSelectedAllDomains(true)
    }else{
      setSelectedAllDomains(false)
    }
    setActiveIndex(prevActiveIndex => ({
      ...prevActiveIndex,
      [index]: !prevActiveIndex[index],
    }));
  };

  const selectAllDomain = () => {
    Object.keys(activeIndex).forEach(key => {
      setActiveIndex(prevActiveIndex => ({
        ...prevActiveIndex,
        [key]: !selectedAllDomains,
      }));
    });
    setDeleteManyModal(prev => ({
      ...prev,
      count: Object.keys(activeIndex).length
    }))
    setSelectedAllDomains(!selectedAllDomains)
  }

  const handleShow = () => {
    setModalInfo((prev) => ({
      ...prev,
      show:!modalInfo.show
    }))
  };

  const AddSubdomainInfoToModal = (location, subdomain_type, id, subdomain) => {
    setEditSubdomainInfo((prev) => ({
      ...prev,
      subdomain,
      location,
      subdomain_type,
      subdomain_id: id
    }))
    handleShow()
  }

  const changeDeleteManySubdomainModal = () => {
    if (deleteManyModal.count < 1) {
      toast.error('No subdomain selected')
      return
    }
    setDeleteManyModal(prev => ({
      ...prev,
      show: !deleteManyModal.show
    }))
  }

  const deleteSubdomain = async() => {
    const req = await fetch(`${REACT_APP_BACKEND_URL}/delete/subdomain/${deleteModal.subdomain_id}`)
    const {status, result} = await req.json()
    setRefreshData(!refreshData)
    setDeleteModal({ show:false, subdomain:null, subdomain_id:null })
    if (status) {
      toast.success('Deleted subdomain & subdomain urls')
      return
    }
    toast.error(result)
  }
  
  const deleteManySubdomain = async() => {
    const subdomain_ids = []
    for (let i = 0; i < data.length; i++) {
      if (activeIndex[i]) {
        subdomain_ids.push(data[i]['_id'])
      }
    }
    if (subdomain_ids.length < 1) {
      toast.error('No subdomain selected')
      return
    }
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const req = await fetch(`${REACT_APP_BACKEND_URL}/delete/subdomains`, {
      method: "POST",
      body: JSON.stringify({ids: subdomain_ids}),
      headers
    })
    const {status, result} = await req.json()
    setRefreshData(!refreshData)
    changeDeleteManySubdomainModal()
    if (status) {
      setDeleteManyModal(prev => ({
        ...prev,
        count: deleteManyModal.count - subdomain_ids.length 
      }))
      toast.success(result)
      return
    }
    toast.error(result)
  }

  const openAddSubdomainModal = () => {
    setEditSubdomainInfo(prev => ({
      ...prev,
      location: '',
      subdomain: '',
      subdomain_id: '',
      subdomain_type: 'job'
    }))
    handleShow()
  }

  return (
    <>
    <CenteredModal
      show={deleteModal.show}
      onSuccess={deleteSubdomain}
      onHide={() => setDeleteModal({ show:false, subdomain:null, subdomain_id:null })}
      header={`Delete Subdomain?`}
      body={`Are you sure you want to delete <strong>${deleteModal.subdomain}</strong>? <br /> This would also delete all urls under this subdomain.`}
      successText='Yes, Delete.'
    />
    <CenteredModal
      show={deleteManyModal.show}
      onSuccess={deleteManySubdomain}
      onHide={changeDeleteManySubdomainModal}
      header={`Delete Subdomains?`}
      body={`Are you sure you want to delete <strong>${deleteManyModal.count}</strong> subdomains? <br /> This would also delete all urls under these subdomains.`}
      successText='Yes, Delete.'
    />
    <MainPageModal 
      onSuccess={() => setRefreshData(!refreshData)} 
      show={modalInfo.show} 
      handleShow={handleShow}
      subdomainInfo={editSubdomainInfo}
      toast={toast}
    />
        <Stack gap={2} className='my-3' direction='horizontal'>
        <Stack className='justify-content-start' gap={2} direction='horizontal'>
          <Button onClick={() => setModalInfo({ show:true })} className='edit-btn' size="md" variant="p-2 btn-light">Add new CSV Article</Button>
          <Button className='delete-btn' size="md" variant="p-2 btn-danger primary">Delete</Button>
        </Stack>
          <Form className="ms-auto d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 main-input"
              aria-label="Search"
            />
            <Button variant="light">Search</Button>
          </Form>
        </Stack>
        <Table striped hover>
          <thead>
            <tr>
              {
                MAIN_PAGE_DASHBOARD_HEADERS.map(header => (
                  <th>{header}</th>
                ))
              }
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
          data.length > 0 ?
            data.map((item, index) => (
              <tr className="table_row urlsPage">
                <td>
                  <Link style={{ textTransform:'capitalize' }}>
                    {item['title']}
                  </Link>
                </td>
                <td>
                  <Link style={{ textTransform:'capitalize' }}>
                    {item['additional_prompt']}
                  </Link>
                </td>
                <td>
                  <Form.Switch
                    readOnly
                    type="switch"
                    id="disabled-custom-switch"
                    checked={item['chart_enabled']}
                  />
                </td>
                <td>
                  <Form.Switch
                      readOnly
                      type="switch"
                      id="disabled-custom-switch"
                      checked={item['map_enabled']}
                    />
                </td>
              </tr>
            ))
          :
          <tr>
            <td style={{ background:'transparent' }} colSpan={'6'}>
            <h1 className='my-2' style={{ textTransform:'uppercase', fontSize:'30px', textAlign:"center" }}><b>No Subdomain Found</b></h1>
            <Lottie 
              options={defaultOptions}
              height={500}
              width={500}
              isClickToPauseDisabled={true}
            />
            </td>
          </tr>
        }
      </tbody>
    </Table>
    <ToastContainer />
    </>
  );
}


export default App;