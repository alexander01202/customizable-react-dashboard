import { InfinitySpin } from 'react-loader-spinner'
import { Container } from 'react-bootstrap'
import { Navigate, useLoaderData, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authAction } from './store/actions/actions'
import { useDispatch } from 'react-redux'

export default function LoaderPage({ setIsLoaded }) {
  const data = useLoaderData()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  useEffect(() => {
    const checkData = async() => {
      console.log("LOADER PAGE DATA ==> ", data)
      if(!data?.result){
        console.log("LOGGING OUT")
        dispatch(authAction.logout())
        navigate('/')
      }else if (data?.result && data?.email) {
        dispatch(authAction.login({ id:data.result._id, email:data.email, username:data.result.username }))
      }
      await sleep(800)
      setIsLoaded()
    }
    checkData()
  }, [])
 
  return (
    <Container fluid style={{height:'100vh', width:'100%', background:'#ababab'}} className='d-flex justify-content-center align-items-center'>
      <InfinitySpin
          visible={true}
          width="200"
          color="#00246B"
          ariaLabel="infinity-spin-loading"
      />
    </Container>
  )
}

