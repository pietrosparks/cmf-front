import React from 'react'

const Navbar = () => {
  return (
    <nav class="navbar is-info">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="/image/crunchyy.svg" alt="Logo" />
          </a>
          <span class="navbar-burger burger" data-target="navbarMenu">
            <span />
            <span />
            <span />
          </span>
        </div>
        <div id="navbarMenu" class="navbar-menu">
          <div class="navbar-end">
            <div class="tabs is-right">
              <span class="navbar-item">
                <a
                  class="button is-white is-outlined"
                  href="https://github.com/dansup/bulma-templates/blob/master/templates/hero.html"
                >
                  <span class="icon">
                    <i class="fa fa-github" />
                  </span>
                  <span title="Hello from the other side">View Source</span>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
