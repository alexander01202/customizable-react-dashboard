import { useDispatch } from "react-redux"
import { redirect } from "react-router-dom"
import { authAction } from "../store/actions/actions"
import { REACT_APP_BACKEND_URL } from "../dev_variables"

export function getTokenDuration(){
    const token_expiration = new Date(localStorage.getItem('token_expiration'))
    const now = new Date()
    console.log("token_expiration.getTime()", token_expiration.getTime())
    const token_duration = token_expiration.getTime() - now.getTime();
    console.log("token_duration", token_duration)
    return token_duration
}

export function getAuthToken() {
    if (getTokenDuration() > 1) {
        const token = localStorage.getItem('token')
        return token
    }else{
        return null
    }
}

export function verifyAuthToken(){
    const token = getAuthToken()
    console.log("token", token)
    return token ? token : null
}

export function RemoveAuthToken(){
    const dispatch = useDispatch()

    try {
        localStorage.removeItem('token')
        localStorage.removeItem('token_expiration')
    } catch (error) {
        console.log(error)
        return null
    }finally{
        dispatch(authAction.logout())
        console.log('REDIRECTING...')
        return redirect('/')
        // return null
    }
}

const getEmail = async(token) => {
    if (typeof token !== 'string') {
      return null
    }
    try {
      const req = await fetch(`${REACT_APP_BACKEND_URL}/verify_token`, {
        method:'GET',
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      const {status, result} = await req.json()
      if (status) {
        return result
      }else{
        return null
      }
    } catch (error) {
      return null
    }
  }

  export const log_in_admin = async() => {
    const token = getAuthToken()
    const email = await getEmail(token)

    if (email) {
      const req = await fetch(`${REACT_APP_BACKEND_URL}/admin/${email}`)
      const {status, result} = await req.json()
  
      if (status && typeof token === 'string') {
        localStorage.removeItem('token')
        localStorage.removeItem('token_expiration')
        localStorage.setItem('token', token)
        const expiration = new Date()
        expiration.setHours(expiration.getHours() + 1)
        localStorage.setItem('token_expiration', expiration.toISOString())
        return {result, email}
      }
    }else{
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiration')
      return {result:'', email:''}
    }
  }