import { getAccount, getInstalledModules } from 'src'
import { getClient } from 'src'
import { MockAccountDeployed } from 'test/utils/mocks/account'
import { MockClient } from 'test/utils/mocks/client'

describe('Get installed modules', () => {
  // Setup
  const client = getClient(MockClient)
  const account = getAccount(MockAccountDeployed)

  it('Should return the installed modules', async () => {
    const installedModules = await getInstalledModules({
      client,
      account,
    })

    expect(installedModules.length).toBeGreaterThan(0)
  })
})