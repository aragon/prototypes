import React from 'react'
import styled from 'styled-components'
import { animated, Transition } from 'react-spring'
import { PublicUrl, BaseStyles } from '@aragon/ui'
import Windowable from './Windowable'
import Onboarding from './Onboarding'
import Dao from './Dao'

const LOADING_TIME = 700
// const LOADING_TIME = 300
const PAUSE_TIME = 300

const DEV_MODE = false
// const DEV_MODE = true

class App extends React.Component {
  state = {
    appStatus: 'onboarding', // onboarding | dao
    screen: 'onboarding', // onboarding | loading-dao | loading-dao-done | dao
    // appStatus: 'dao',
    // screen: 'dao',
  }
  load = () => {
    this.setState({ appStatus: 'loading-dao' })
    clearTimeout(this._timeout)

    this._timeout = setTimeout(() => {
      this.setState({ appStatus: 'loading-dao-done' })

      this._timeout = setTimeout(() => {
        this.setState({ appStatus: 'dao', screen: 'dao' })
      }, DEV_MODE ? 0 : PAUSE_TIME)
    }, DEV_MODE ? 0 : LOADING_TIME)
  }
  reset = () => {
    this.setState({ appStatus: 'onboarding', screen: 'onboarding' })
    clearTimeout(this._timeout)
  }
  componentWillUnmount() {
    clearTimeout(this._timeout)
  }
  handleTransitionRest = () => {
    const { appStatus } = this.state
    this.setState({ screen: appStatus === 'onboarding' ? 'onboarding' : 'dao' })
  }
  render() {
    const { appStatus, screen } = this.state
    return (
      <PublicUrl.Provider url="/aragon-ui/">
        <BaseStyles />
        <Windowable
          fullscreen={appStatus === 'dao'}
          onTransitionRest={this.handleTransitionRest}
          renderWindow={progress => (
            <animated.div style={{ opacity: progress }}>
              <Onboarding onLaunch={this.load} appStatus={appStatus} />
            </animated.div>
          )}
          renderFullscreen={progress => (
            <animated.div style={{ opacity: progress }}>
              <Dao
                onClose={this.reset}
                onDaoChange={this.load}
                screen={screen}
                openProgress={progress}
              />
            </animated.div>
          )}
        />
      </PublicUrl.Provider>
    )
  }
}

export default App
