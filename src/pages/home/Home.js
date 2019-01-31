import React, { Component, Fragment } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loading'
import axios from 'axios'
import { API_URL } from '../../config'
import 'react-toastify/dist/ReactToastify.min.css'
import './Home.css'

class Home extends Component {
  state = {
    user: {},
    taxiService: null,
    datePeriod: null,
    step: 1,
    result: null,
    loading: false
  }

  componentDidMount() {
    this.setState({ user: this.props.location.state.user })
  }

  notifyError = message => {
    toast.error(`${message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    })
  }

  notifySuccess = message => {
    toast.success(`${message}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    })
  }
  determineTime() {
    let period
    if (this.state.datePeriod === 'past-week') {
      period = 'this week'
    }
    if (this.state.datePeriod === 'past-month') {
      period = 'this month'
    }
    if (this.state.datePeriod === 'past-year') {
      period = 'this Year'
    }
    return period
  }

  back() {
    this.setState({ step: 1, result:null, taxiService: null, datePeriod: null })
  }

  logout() {
    this.setState({ user: {} });
    this.props.history.push('/');
  }

  crunch = () => {
    this.setState({ loading: true })
    axios
      .get(`${API_URL}/mail`, {
        params: {
          taxiService: this.state.taxiService,
          datePeriod: this.state.datePeriod
        },
        headers: {
          Authorization: this.state.user.token
        },
        withCredentials: true
      })
      .then(res => {
        console.log(res, 'respo')
        this.setState({ loading: false, result: res.data.data })
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            this.notifyError('Session Expired, Please Reauthenticate')
            this.logout();
          }
        }
      })
  }

  selectTaxiService(taxi) {
    this.setState({ taxiService: taxi, step: 2 })
  }
  selectPeriod = date => {
    this.setState({ datePeriod: date }, () => {
      this.crunch()
    })
  }
  render() {
    return (
      <Fragment>
        <Navbar />
        <section class="section">
          <div class="container">
            <div class="columns">
              {!this.state.loading ? (
                <Fragment>
                  {!this.state.result ? (
                    <div class="column card is-half is-offset-one-quarter">
                      <figure class="image is-128x128 has-image-centered">
                        <img
                          class="is-rounded"
                          src={this.state.user.photo}
                          alt="avatar"
                        />
                      </figure>
                      <hr />
                      <div class="has-text-centered">
                        <h4 class="is-size-4 has-text-info">
                          Welcome {this.state.user.name}
                        </h4>

                        <hr />
                        {this.state.step === 1 ? (
                          <Fragment>
                            {' '}
                            <div class="pd-50">
                              <h5 class="is-size-5">
                                Select your Taxi service to be calculated
                              </h5>
                              <button
                                class="button mglr-50 is-medium is-fullwidth is-uber"
                                onClick={e => this.selectTaxiService('uber')}
                              >
                                Uber
                              </button>
                              <button
                                class="button mglr-50 is-medium is-fullwidth is-success"
                                onClick={e => this.selectTaxiService('taxify')}
                              >
                                Taxify
                              </button>
                            </div>
                          </Fragment>
                        ) : (
                          <Fragment>
                            {' '}
                            <div class="pd-50">
                              <h5 class="is-size-5">Select Date Period</h5>
                              <button
                                class="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.selectPeriod('past-week')}
                              >
                                Past Week
                              </button>
                              <button
                                class="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.selectPeriod('past-month')}
                              >
                                Past Month
                              </button>
                              <button
                                class="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.selectPeriod('past-year')}
                              >
                                Past Year
                              </button>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div class="column card is-half is-offset-one-quarter">
                      <figure class="image is-128x128 has-image-centered">
                        <img
                          class="is-rounded"
                          src={this.state.user.photo}
                          alt="avatar"
                        />
                      </figure>
                      <hr />

                      <div class="notification is-info">
                        <div class=" pdlr-50 has-text-centered">
                          <h4 class="is-size-5 has-text-white">
                            You successfully spent
                          </h4>
                          <hr />
                          <h3 class="is-size-3 has-text-weight-bold">
                            NGN {this.state.result.negative}{' '}
                            <span role="img" aria-label="emoji">
                              💸{' '}
                            </span>
                          </h3>

                          <hr />
                          <h4 class="is-size-5 has-text-white">
                            on{' '}
                            {this.state.taxiService === 'uber'
                              ? 'Uber'
                              : 'Taxify'}{' '}
                            <span role="img" aria-label="emoji">
                              🚗
                            </span>{' '}
                            {this.determineTime()}
                          </h4>

                          <br />
                          <button class="button is-info is-medium is-fullwidth is-inverted">
                            Tweet It{' '}
                            <span role="img" aria-label="emoji">
                              ✨
                            </span>{' '}
                          </button>
                          <br />
                          <button
                            class="button is-danger is-medium is-fullwidth is-inverted"
                            onClick={e => this.back()}
                          >
                            Back{' '}
                            <span role="img" aria-label="emoji">
                              🔙
                            </span>
                          </button>
                          <br />
                          <button
                            class="button is-danger is-medium is-fullwidth"
                            onClick={e => this.logout()}
                          >
                            Bye{' '}
                            <span role="img" aria-label="emoji">
                              👋
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <Loader
                    className="m50-auto"
                    type={'bubbles'}
                    color="#209cee"
                  />
                </Fragment>
              )}
            </div>
          </div>
        </section>
        <ToastContainer />
      </Fragment>
    )
  }
}

export default Home
