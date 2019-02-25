import React from 'react'
import styled from 'styled-components'
import { animated, Spring } from 'react-spring'
import { Button, TextInput, theme, unselectable } from '@aragon/ui'
import menu from './assets/menu.png'
import network from './assets/network.png'
import switcherButton from './assets/switcher-button.png'
import blockies1 from './assets/blockies-1.png'
import blockies2 from './assets/blockies-2.png'

class Dao extends React.PureComponent {
  state = { switcherOn: false }
  handleChange = () => {
    this.setState({ switcherOn: false })
    this.props.onDaoChange()
  }
  render() {
    const { onClose, screen, openProgress, onDaoChange } = this.props
    return (
      <Main>
        <Sidebar>
          <DaoSwitcher>
            <SwitcherButton
              onClick={() => {
                this.setState(({ switcherOn }) => ({ switcherOn: !switcherOn }))
              }}
            />
            <Spring
              native
              to={{ openProgress: Number(this.state.switcherOn) }}
              config={{
                mass: 0.5,
                tension: 400,
                friction: 30,
                precision: 0.01,
              }}
            >
              {({ openProgress }) => (
                <Daos
                  style={{
                    opacity: openProgress,
                    display: openProgress.interpolate(
                      v => (v <= 0 ? 'none' : 'block')
                    ),
                  }}
                >
                  <ul>
                    <li>Organization info…</li>
                    <li className="dao" onClick={this.handleChange}>
                      <img src={blockies1} alt="" width="22.5" />
                      OSS Project
                    </li>
                    <li className="dao" onClick={this.handleChange}>
                      <img src={blockies2} alt="" width="22.5" />
                      Personal DAO
                    </li>
                    <li>Manage list…</li>
                  </ul>
                </Daos>
              )}
            </Spring>
          </DaoSwitcher>
          <img src={menu} alt="" style={{ width: '100%' }} />
        </Sidebar>
        <Home onClick={onClose}>
          <HomeHeader>Home</HomeHeader>
          <HomeContent />
          <HomeFooter />
        </Home>
      </Main>
    )
  }
}

const DaoSwitcher = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
`

const SwitcherButton = styled.img.attrs({
  src: switcherButton,
  alt: '',
  height: '62',
})``

const Daos = styled(animated.div)`
  position: absolute;
  top: 40px;
  left: 20px;
  background: white;
  border-radius: 3px;
  border: 1px solid ${theme.contentBorder};

  ul {
    list-style: none;
    padding: 10px 0;
  }

  li {
    padding: 5px 20px;
    height: 40px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    &:active {
      background: rgba(220, 234, 239, 0.3);
    }
  }

  li:first-child {
    border-bottom: 1px solid ${theme.contentBorder};
  }

  li.dao img {
    margin-right: 10px;
  }
`

const Main = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  overflow: hidden;
  background: rgb(247, 251, 253);
  z-index: 1;
  ${unselectable};
`

const Sidebar = styled(animated.div)`
  position: relative;
  z-index: 2;
  flex-grow: 0;
  flex-shrink: 0;
  width: 219px;
  border-right: 1px solid rgb(232, 232, 232);
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 0px 15px;
`

const Home = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-rows: 64px auto 54px;
`

const HomeHeader = styled(animated.div)`
  display: flex;
  align-items: center;
  padding-left: 30px;
  border-bottom: 1px solid rgb(232, 232, 232);
  font-size: 22px;
  background: #fff;
`
const HomeContent = styled.div``
const HomeFooter = styled(animated.div)`
  border-top: 1px solid rgb(232, 232, 232);
  background: 30px 50% no-repeat url(${network});
  background-size: calc(340px / 2) calc(56px / 2);
  background: #fff;
`

export default Dao
