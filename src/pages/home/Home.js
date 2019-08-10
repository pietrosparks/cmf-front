import React, { Component, Fragment } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loading'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import { API_URL } from '../../config'
import axios from 'axios'
import './Home.css'
import moment from 'moment'
import { isEmpty } from 'lodash'

class Home extends Component {
  state = {
    user: {},
    step: 1,
    position: null,
    result: null,
    loading: false,
    datePeriod: null,
    startDate: moment().format('DD/MM/YY'),
    endDate: null,
    showCustom: false,
    taxiService: null,
    handleChangeEnd: null,
    handleChangeStart: null
  }

  componentDidMount() {
    this.propmptForLocation()
    this.setState({ user: this.props.location.state.user })
  }

  handleChangeStart = date => {
    this.setState({
      startDate: date
    })
  }

  propmptForLocation = () => {
    navigator.geolocation.getCurrentPosition((position, err) => {
      if (err) return
      const { latitude, longitude } = position.coords
      this.setState({ position: { longitude, latitude } })
    })
  }

  handleChangeEnd = date => {
    this.setState({
      endDate: date
    })
  }

  datePickerRender() {
    if (this.state.showCustom) {
      return (
        <div className="pd-50">
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            placeholderText="Choose Starting Date"
          />

          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            placeholderText="Choose Ending Date"
          />
        </div>
      )
    } else return null
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
    if (this.state.datePeriod === 'this-week') {
      period = 'this week'
    }
    if (this.state.datePeriod === 'this-month') {
      period = 'this month'
    }
    if (this.state.datePeriod === 'this-year') {
      period = 'this Year'
    }
    return period
  }

  back() {
    this.setState({
      step: 1,
      result: null,
      taxiService: null,
      datePeriod: null
    })
  }

  logout() {
    this.setState({ user: {} })
    this.props.history.push('/')
  }

  crunch = () => {
    this.setState({ loading: true })

    const params = {
      taxiService: this.state.taxiService,
      datePeriod: this.state.datePeriod
    }

    if (!isEmpty(this.state.position)) {
      params.longitude = this.state.position.longitude
      params.latitude = this.state.position.latitude
    }

    axios
      .get(`${API_URL}/mail`, {
        params,
        headers: {
          Authorization: this.state.user.token
        },
        withCredentials: true
      })
      .then(res => {
        this.setState({ loading: false, result: res.data.data })
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            this.notifyError('Session Expired, Please Reauthenticate')
            this.logout()
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
  toggleShowCustom() {
    this.setState({ showCustom: !this.showCustom })
  }

  tweetLink() {
    let period

    switch (this.state.datePeriod) {
      case 'this-week':
        period = 'This week'
        break
      case 'this-month':
        period = 'This Month'
        break
      case 'this-year':
        period = 'This Year'
        break
      default:
        period = 'This Week'
    }

    const message = `Someone Safe me pls, I've spent ${
      this.state.result.negative
    } on ${
      this.state.taxiService
    } ${period} - Check yours and cry with me on https://crunchmyfare.herokuapp.com`
    return `http://twitter.com/intent/tweet?text=${message}`
  }

  render() {
    return (
      <Fragment>
        <Navbar
          user={this.props.location.state.user}
          history={this.props.history}
        />
        <section className="section">
          <div className="container">
            <div className="columns">
              {!this.state.loading ? (
                <Fragment>
                  {!this.state.result ? (
                    <div className="column card is-half is-offset-one-quarter">
                      <figure className="image is-128x128 has-image-centered">
                        <img
                          className="is-rounded"
                          src={this.state.user.photo}
                          alt="avatar"
                        />
                      </figure>
                      <hr />
                      <div className="has-text-centered">
                        <h4 className="is-size-4 has-text-info">
                          Welcome {this.state.user.name}
                        </h4>

                        <hr />
                        {this.state.step === 1 ? (
                          <Fragment>
                            {' '}
                            <div className="pd-50">
                              <h5 className="is-size-5">
                                Select your Taxi service to be calculated
                              </h5>
                              <button
                                className="button mglr-50 is-medium is-fullwidth is-uber"
                                onClick={e => this.selectTaxiService('uber')}
                              >
                                Uber
                              </button>
                              <button
                                className="button mglr-50 is-medium is-fullwidth is-success"
                                onClick={e => this.selectTaxiService('taxify')}
                              >
                                Taxify
                              </button>
                            </div>
                          </Fragment>
                        ) : (
                          <Fragment>
                            {' '}
                            <div className="pd-50">
                              <h5 className="is-size-5">Select Date Period</h5>
                              <button
                                className="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.selectPeriod('this-week')}
                              >
                                This Week
                              </button>
                              <button
                                className="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.selectPeriod('this-month')}
                              >
                                This Month
                              </button>
                              <button
                                className="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.selectPeriod('this-year')}
                              >
                                This Year
                              </button>
                              {/* <button
                                className="button mglr-50 is-medium is-fullwidth is-info"
                                onClick={e => this.toggleShowCustom()}
                              >
                                Custom Date Period
                              </button> */}

                              {this.datePickerRender()}
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="column card is-half is-offset-one-quarter">
                      <figure className="image is-128x128 has-image-centered">
                        <img
                          className="is-rounded"
                          src={this.state.user.photo}
                          alt="avatar"
                        />
                      </figure>
                      <hr />

                      <div className="notification is-info">
                        <div className=" pdlr-50 has-text-centered">
                          <h4 className="is-size-5 has-text-white">
                            You successfully spent
                          </h4>
                          <hr />
                          <h3 className="is-size-3 has-text-weight-bold">
                            NGN {this.state.result.negative}{' '}
                            <span role="img" aria-label="emoji">
                              💸{' '}
                            </span>
                          </h3>

                          <hr />
                          <h4 className="is-size-5 has-text-white">
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
                          <a
                            className="button is-info is-medium is-fullwidth is-inverted"
                            href={this.tweetLink()}
                            target="_blank"
                          >
                            Tweet It{' '}
                            <span role="img" aria-label="emoji">
                              ✨
                            </span>{' '}
                          </a>
                          <br />
                          <button
                            className="button is-danger is-medium is-fullwidth is-inverted"
                            onClick={e => this.back()}
                          >
                            Back{' '}
                            <span role="img" aria-label="emoji">
                              🔙
                            </span>
                          </button>
                          <br />
                          <button
                            className="button is-danger is-medium is-fullwidth"
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
