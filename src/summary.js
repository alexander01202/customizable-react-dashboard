import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Col, Container, Stack } from 'react-bootstrap'
import { MdOutlineNumbers  } from "react-icons/md";
import { REACT_APP_BACKEND_URL } from './dev_variables';
import { toast, ToastContainer } from 'react-toastify';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Summary() {
  const [summaryCounts, setSummaryCounts] = useState({ urls:0, subdomains:0, scrapes:0, pendingScrapes:0, successfulScrapes:0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async() => {
      setIsLoading(true)   
      var req = fetch(`${REACT_APP_BACKEND_URL}/count/subdomains`)
      var req_urls = fetch(`${REACT_APP_BACKEND_URL}/count/urls`)
      var req_scrapes = fetch(`${REACT_APP_BACKEND_URL}/count/scrapes`)
      var req_scrapes_pending = fetch(`${REACT_APP_BACKEND_URL}/count/scrapes/pending`)
      var req_scrapes_success = fetch(`${REACT_APP_BACKEND_URL}/count/scrapes/success`)

      var {status, result} = await (await req).json()
      const num_of_subdomains = result
      if (!status) {
        toast.error(result)
        return
      }
      ({status, result} = await (await req_urls).json())
      const num_of_urls = result
      if (!status) {
        toast.error(result)
        return
      }
      ({status, result} = await (await req_scrapes).json())
      const num_of_scrapes = result
      if (!status) {
        toast.error(result)
        return
      }
      ({status, result} = await (await req_scrapes_success).json())
      const num_of_success_scrapes = result
      if (!status) {
        toast.error(result)
        return
      }
      ({status, result} = await (await req_scrapes_pending).json())
      const num_of_pending_scrapes = result
      if (!status) {
        toast.error(result)
        return
      }
      
      setSummaryCounts(prev => ({
        ...prev,
        urls:num_of_urls,
        subdomains:num_of_subdomains,
        pendingScrapes:num_of_pending_scrapes,
        scrapes:num_of_scrapes,
        successfulScrapes: num_of_success_scrapes
      }))
      setIsLoading(false)
    }
    fetchData()
  }, [])

  function Box({ children }) {
    return (
      <Col className='box box-skeleton mx-auto d-flex' md={3}>
        {children}
      </Col>
    );
  }
  

  return (
    <Container fluid>
      {
        isLoading ?
          <Skeleton style={{ borderRadius:'15px' }} wrapper={Box} containerClassName='d-flex' count={3} />
        :
          <Stack direction='horizontal'>
            <Col className='box p-2 mx-auto d-flex' md={3}>
              <div className='d-grid' style={{ width:'100%',textAlign:'center' }}>
                <h5 className='d-flex align-items-center'>
                  <MdOutlineNumbers color='#2e4ead' className='icon'/>
                  <i>Number of Scrapes</i>
                </h5>
                <h1>{summaryCounts.scrapes}</h1>
              </div>
            </Col>
            <Col className='box p-2 mx-auto d-flex' md={3}>
              <div className='d-grid' style={{ width:'100%', textAlign:'center' }}>
                <h5 className='d-flex align-items-center'>
                  <MdOutlineNumbers color='#2e4ead' className='icon'/>
                  <i>Number of subdomains</i>
                </h5>
                <h1>{summaryCounts.subdomains}</h1>
              </div>
            </Col>
            <Col className='box p-2 mx-auto d-flex' md={3}>
              <div className='d-grid' style={{ width:'100%', textAlign:'center' }}>
                <h5 className='d-flex align-items-center'>
                  <MdOutlineNumbers color='#2e4ead' className='icon'/>
                  <i>Number of URLs</i>
                </h5>
                <h1>{summaryCounts.urls}</h1>
              </div>
            </Col>
          </Stack>
      }
      <ToastContainer />
    </Container>
  )
}
