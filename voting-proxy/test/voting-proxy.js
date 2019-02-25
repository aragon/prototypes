const VotingProxyFactory = artifacts.require('VotingProxyFactory')

contract('Voting Proxy Factory', ([hotKey, coldKey]) => {
  beforeEach(async () => {
    this.factory = await VotingProxyFactory.new()
  })

  it('deploys proxy', async () => {
    const deployingAddress = await this.factory.proxyAddress(coldKey, hotKey)

    const { logs } = await this.factory.newProxy(coldKey, hotKey)

    const { proxy, hot, cold } = logs.find(({ event }) => event === 'ProxyDeploy').args

    assert.equal(cold, coldKey, 'cold')
    assert.equal(hot, hotKey, 'hot')
    assert.equal(proxy, deployingAddress, 'proxy')
  })
})