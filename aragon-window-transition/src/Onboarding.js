import React from 'react'
import styled from 'styled-components'
import { animated, Spring } from 'react-spring'
import { Button, TextInput } from '@aragon/ui'

class Onboarding extends React.PureComponent {
  status() {
    const { appStatus } = this.props
    if (appStatus === 'loading-dao') return 'Loading myorg.aragonid.eth…'
    if (appStatus === 'loading-dao-done' || appStatus === 'dao') return 'Ready.'
    return ''
  }
  render() {
    const { appStatus } = this.props
    return (
      <React.Fragment>
        {appStatus === 'onboarding' && <Title>Welcome to Aragon</Title>}
        <Status>{this.status()}</Status>
        <Main>
          {appStatus === 'onboarding' && (
            <Button mode="strong" onClick={this.props.onLaunch}>
              Open organization
            </Button>
          )}
        </Main>
      </React.Fragment>
    )
  }
}

const Main = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-grow: 1;
  padding: 40px;
`

const Title = styled(animated.h1)`
  position: absolute;
  top: 120px;
  width: 100%;
  text-align: center;
  font-size: 37px;
  font-weight: 600;
  color: rgb(59, 59, 59);
  margin-bottom: 100px;
`

const Status = styled(animated.div)`
  height: 40px;
  position: absolute;
  top: 180px;
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 400;
  color: rgb(59, 59, 59);
`

export default Onboarding
