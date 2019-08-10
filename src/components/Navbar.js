import React, { Component } from 'react'

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar is-info">
        <div className="container">
          <div className="navbar-brand">
            <button
              className="navbar-item"
              onClick={e =>
                this.props.history.push('/', {
                  user: this.props.user || {}
                })
              }
            >
              <img src="/image/crunchyy.svg" alt="Logo" />
            </button>
            <span className="navbar-burger burger" data-target="navbarMenu">
              <span />
              <span />
              <span />
            </span>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end">
              <div className="tabs is-right">
                <span className="navbar-item">
                  <a
                    className="button is-white is-outlined"
                    href="https://github.com/pietrosparks/cmf-front"
                    target="_blank"
                  >
                    <span className="icon">
                      <i className="fa fa-github" />
                    </span>
                    <span title="Hello from the other side">View Source</span>
                  </a>
                </span>
                <span className="navbar-item">
                  <a
                    className="button is-white is-outlined"
                    href="https://twitter.com/txheo" target="_blank"
                  >
                    <span className="icon">
                      <i className="fa fa-twitter" />
                    </span>
                    <span title="Hello from the other side">Twitter</span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
