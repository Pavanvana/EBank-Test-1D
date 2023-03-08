import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {
    inputUserId: '',
    inputPin: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  loginFail = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {inputUserId, inputPin} = this.state
    const userDetails = {user_id: inputUserId, pin: inputPin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      this.loginSuccess(fetchedData.jwt_token)
    } else {
      this.loginFail(fetchedData.error_msg)
    }
  }

  onChangeUserIdInput = event => {
    this.setState({inputUserId: event.target.value})
  }

  onChangePinInput = event => {
    this.setState({inputPin: event.target.value})
  }

  render() {
    const {inputUserId, inputPin, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-container">
        <div className="card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-img"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <h1 className="heading">Welcome Back!</h1>
            <label className="label" htmlFor="userId">
              User ID
            </label>
            <input
              className="input-container"
              id="userId"
              type="text"
              placeholder="Enter User ID"
              onChange={this.onChangeUserIdInput}
              value={inputUserId}
            />
            <label className="label" htmlFor="pin">
              PIN
            </label>
            <input
              className="input-container"
              id="pin"
              type="password"
              placeholder="Enter PIN"
              onChange={this.onChangePinInput}
              value={inputPin}
            />
            <button className="login-button" type="submit">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginPage
