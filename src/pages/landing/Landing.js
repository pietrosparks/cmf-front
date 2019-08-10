import React, { Component, Fragment } from 'react'
import Navbar from '../../components/Navbar'
import { Redirect } from 'react-router-dom'
import { API_URL } from '../../config'
import io from 'socket.io-client'
import './Landing.css'
import axios from 'axios'
import { isEmpty } from 'lodash'

class Landing extends Component {
  state = {
    user: {},
    disabled: '',
    socket: {}
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.user) {
      const { user } = this.props.location.state
      this.setState({ user })
    }

    axios.get('/wake-up')
    const socket = io(API_URL)
    this.setState({ socket })

    socket.on('google', user => {
      this.popup.close()
      this.setState({ user, redirect: true })
    })
  }

  checkPopup() {
    const check = setInterval(() => {
      const { popup } = this
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check)
        this.setState({ disabled: '' })
      }
    }, 1000)
  }

  openPopup() {
    const width = 600
    const height = 600
    const left = window.innerWidth / 2 - width / 2
    const top = window.innerHeight / 2 - height / 2
    const url = `${API_URL}/google?socketId=${this.state.socket.id}`

    return window.open(
      url,
      '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`
    )
  }

  startAuth = () => {
    if (!this.state.disabled) {
      this.popup = this.openPopup()
      this.checkPopup()
      this.setState({ disabled: 'disabled' })
    }
  }

  closeCard = () => {
    this.setState({ user: {} })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: '/home',
            state: {
              user: this.state.user
            }
          }}
        />
      )
    }
    return (
      <Fragment>
        <section className="hero is-info is-medium is-bold">
          <div className="hero-head">
            <Navbar user={this.state.user} history={this.props.history} />
          </div>
          <div className="hero-body">
            <div className="container">
              <div>
                <h1 className="title is-size-1">
                  CrunchMyFare helps you estimate your spending{' '}
                  <span role="img" aria-label="emoji">
                    💸{' '}
                  </span>
                  on Uber & Taxify{' '}
                  <span role="img" aria-label="emoji">
                    🚗
                  </span>
                </h1>
              </div>
              <br />
              <h2 className="subtitle">
                It's very easy to lose track of finances as we hop from one ride
                to another across town. <br /> We get receipts at the end of
                these trips but do we ever sit to calculate these expenses ?
              </h2>
              <br />
              {isEmpty(this.state.user) ? (
                <button className="button is-google" onClick={this.startAuth}>
                  Sign in with Google &nbsp;{' '}
                  <i className="fa fa-google" aria-hidden="true" />
                </button>
              ) : (
                <button
                  className="button is-google"
                  onClick={e =>
                    this.props.history.push('/home', {
                      user: this.state.user
                    })
                  }
                >
                  Lets get Crunching &nbsp;{' '}
                  <i className="fa fa-chevron-right" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </section>
        <div className="box cta">
          <p className="has-text-centered">
            <span className="tag is-primary">Note</span> Calculations are done
            from your mail receipts
            <span className="is-size-5">
              {' '}
              (Only supports Gmail for now
              <span role="img" aria-label="emoji">
                {' '}
                ⚠️{' '}
              </span>{' '}
              ){' '}
            </span>
          </p>
        </div>
        <section className="container">
          <div className="columns features">
            <div className="column is-4">
              <div className="card my-card">
                <div className="card-header">
                  <div className="card-header-title">
                    <h3 className="is-size-4">
                      Step{' '}
                      <span role="img" aria-label="emoji">
                        1️⃣{' '}
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="card-content">
                  <div className="content">
                    <p>
                      Click the button above{' '}
                      <span role="img" aria-label="emoji">
                        👆
                      </span>{' '}
                      to authorize access to your mail. <br />
                      Dont worry all data is secure via OAuth and HMAC{' '}
                      <span role="img" aria-label="emoji">
                        🔒🔒
                      </span>
                    </p>
                    <p>
                      <a
                        href="https://oauth.net/2/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more about OAuth
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-4">
              <div className="card my-card">
                <div className="card-header">
                  <div className="card-header-title">
                    <h3 className="is-size-4">
                      {' '}
                      Step{' '}
                      <span role="img" aria-label="emoji">
                        2️⃣{' '}
                      </span>{' '}
                    </h3>
                  </div>
                </div>
                <div className="card-content">
                  <div className="content">
                    <p>
                      Select your preferred taxi service. <br />(
                      <span role="img" aria-label="emoji">
                        {' '}
                        ⚠️{' '}
                      </span>{' '}
                      You must have taken rides with them )
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-4">
              <div className="card my-card">
                <div className="card-header">
                  <div className="card-header-title">
                    <h3 className="is-size-4">
                      Step{' '}
                      <span role="img" aria-label="emoji">
                        3️⃣{' '}
                      </span>{' '}
                    </h3>
                  </div>
                </div>
                <div className="card-content">
                  <div className="content">
                    <p>
                      You Choose date period you want to be calculated{' '}
                      <span role="img" aria-label="emoji">
                        📅.
                      </span>
                      <br />
                      <p>
                        We do what we do{' '}
                        <span role="img" aria-label="emoji">
                          🔥
                        </span>
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="footer">
          <div className="container">
            <div className="content has-text-centered">
              <div className="control level-item">
                <a href="https://github.com/dansup/bulma-templates">
                  <div className="tags has-addons">
                    <span className="tag is-dark">Bulma Templates</span>
                    <span className="tag is-info">MIT license</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </Fragment>
    )
  }
}

export default Landing
