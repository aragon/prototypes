import React from 'react'
import styled from 'styled-components'
import { animated, Spring, Keyframes } from 'react-spring'
import { springs } from '@aragon/ui'

function lerp(progress, value1, value2) {
  return (value2 - value1) * progress + value1
}

const STATUS_WINDOWED = Symbol('STATUS_WINDOWED')
const STATUS_FULLSCREEN = Symbol('STATUS_FULLSCREEN')

class Windowable extends React.PureComponent {
  static defaultProps = {
    fullscreen: false,
    onTransitionRest: () => {},
    children: () => {},
  }
  state = {
    isAnimating: false,
    status: null,
    windowRect: null,
    viewportRect: null,
  }
  _windowRef = React.createRef()

  componentDidMount() {
    this.setState({
      status: this.props.fullscreen ? STATUS_FULLSCREEN : STATUS_WINDOWED,
    })

    setTimeout(this.updateGeometry, 0)
    window.addEventListener('resize', this.updateGeometry)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateGeometry)
  }

  componentDidUpdate(prevProps) {
    if (this.props.fullscreen && !prevProps.fullscreen) {
      this.updateGeometry()
    }
  }

  getWindowRect() {
    const el = this._windowRef.current
    return el ? el.getBoundingClientRect() : null
  }

  updateGeometry = () => {
    this.setState({
      windowRect: this.getWindowRect(),
      viewportRect: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })
  }

  handleRest = () => {
    const { fullscreen, onTransitionRest } = this.props
    onTransitionRest()
    this.setState({
      status: fullscreen ? STATUS_FULLSCREEN : STATUS_WINDOWED,
      isAnimating: false,
    })
  }

  handleStart = () => {
    this.setState({ isAnimating: true })
  }

  render() {
    const { fullscreen, children, renderFullscreen, renderWindow } = this.props
    const { windowRect, viewportRect, status, isAnimating } = this.state
    return (
      <Main style={{ overflow: isAnimating ? 'hidden' : 'auto' }}>
        <WindowTransitions
          native
          windowRect={windowRect}
          viewportRect={viewportRect}
          state={windowRect && fullscreen ? 'fullscreen' : 'windowed'}
          onRest={this.handleRest}
          onStart={this.handleStart}
        >
          {({ fullscreenProgress, windowProgress, windowDecorations }) => (
            <React.Fragment>
              <WindowBase>
                <WindowBaseIn>
                  <WindowSpacing>
                    <Window
                      innerRef={this._windowRef}
                      style={{
                        transformOrigin: '0 0',
                        transform: fullscreenProgress.interpolate(
                          v => `
                            translate3d(
                              ${windowRect ? lerp(v, 0, -windowRect.x) : 0}px,
                              ${windowRect ? lerp(v, 0, -windowRect.y) : 0}px,
                              0
                            )
                            scale3d(
                              ${
                                windowRect
                                  ? lerp(
                                      v,
                                      1,
                                      viewportRect.width / windowRect.width
                                    )
                                  : 1
                              },
                              ${
                                windowRect
                                  ? lerp(
                                      v,
                                      1,
                                      viewportRect.height / windowRect.height
                                    )
                                  : 1
                              },
                              1
                            )
                          `
                        ),
                        borderRadius: windowDecorations.interpolate(
                          v => `${v * 3}px`
                        ),
                        boxShadow: windowDecorations.interpolate(
                          v => `rgba(11, 103, 157, ${v * 0.7}) 0 10px 28px`
                        ),
                        pointerEvents: windowProgress.interpolate(
                          v => (v === 0 ? 'none' : 'auto')
                        ),
                      }}
                    >
                      <Content>
                        {(renderWindow || children)(windowProgress)}
                      </Content>
                    </Window>
                  </WindowSpacing>
                </WindowBaseIn>
              </WindowBase>
              <Fullscreen
                style={{
                  pointerEvents: fullscreenProgress.interpolate(
                    v => (v === 0 ? 'none' : 'auto')
                  ),
                  transformOrigin: '0 0',
                  transform: fullscreenProgress.interpolate(
                    v => `
                      translate3d(
                        ${windowRect ? (1 - v) * windowRect.x : 0}px,
                        ${windowRect ? (1 - v) * windowRect.y : 0}px,
                        0
                      )
                      scale3d(
                        ${
                          windowRect
                            ? lerp(v, windowRect.width / viewportRect.width, 1)
                            : 1
                        },
                        ${
                          windowRect
                            ? lerp(
                                v,
                                windowRect.height / viewportRect.height,
                                1
                              )
                            : 1
                        },
                        1
                      )
                    `
                  ),
                  borderRadius: windowDecorations.interpolate(
                    v => `${v * 3}px`
                  ),
                }}
              >
                {(renderFullscreen || children)(fullscreenProgress)}
              </Fullscreen>
            </React.Fragment>
          )}
        </WindowTransitions>
      </Main>
    )
  }
}

const WindowTransitions = Keyframes.Spring({
  windowed: {
    windowProgress: 1,
    fullscreenProgress: 0,
    windowDecorations: 1,
    config: { tension: 500, friction: 35 },
  },
  fullscreen: [
    {
      windowProgress: 0,
      windowDecorations: 1,
      fullscreenProgress: 1,
      config: { tension: 400, friction: 50, mass: 2 },
    },
    {
      windowDecorations: 0,
      config: { tension: 600, friction: 20, precision: 0.3 },
    },
  ],
})

const Main = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;

  background-image: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0%,
      rgba(0, 0, 0, 0.08) 100%
    ),
    linear-gradient(-226deg, rgb(0, 241, 225) 0%, rgb(0, 180, 228) 100%);
`

const Fullscreen = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
`

const WindowBase = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: grid;
  align-items: center;
  justify-content: center;
`

const WindowBaseIn = styled.div`
  min-width: 0;
`

const WindowSpacing = styled.div`
  padding: 40px;
`

const Window = styled(animated.div)`
  width: 980px;
  height: 600px;
  min-height: 0;
  min-width: 0;
  background: white;
`

const Content = styled(animated.div)`
  position: relative;
  min-height: 100%;
`

export default Windowable
