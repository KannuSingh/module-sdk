import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import {
  getColdStorageSetWaitPeriodAction,
  getRequestTimelockedExecution,
  getRequestTimelockedModuleConfigExecution,
  getFlashloanAddAddressAction,
  getFlashloanWhitelist,
  getFlashloanRemoveAddressAction,
} from 'src/module/cold-storage'
import { PublicClient, TestClient } from 'viem'
import { sendUserOp } from '../infra'
import { moduleTypeIds } from 'src/module/types'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testColdStorageHook = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking VCS isInstalled', async () => {
    const isColdStorageExecutorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: GLOBAL_CONSTANTS.COLD_STORAGE_HOOK_ADDRESS,
      }),
    })

    expect(isColdStorageExecutorInstalled).toBe(true)
  }, 20000)

  it('should return true when checking VCS fallback isInstalled', async () => {
    const isFlashloanInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'fallback',
        module: GLOBAL_CONSTANTS.COLD_STORAGE_FLASHLOAN_ADDRESS,
        functionSig: '0x00000000',
        selector: '0x00000000',
      }),
    })

    expect(isFlashloanInstalled).toBe(true)
  }, 20000)

  it('should set waiting period for execution', async () => {
    const setWaitPeriodAction = getColdStorageSetWaitPeriodAction({
      waitPeriod: 100,
    })

    const receipt = await sendUserOp({
      account,
      actions: [setWaitPeriodAction],
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should request time locked execution', async () => {
    const requestTimeLockedExecutionAction = getRequestTimelockedExecution({
      execution: {
        to: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
        target: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
        value: BigInt(0),
        callData: '0x',
        data: '0x',
      },
      additionalWait: 100,
    })

    const receipt = await sendUserOp({
      account,
      actions: [requestTimeLockedExecutionAction],
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should request time locked module configuration', async () => {
    const moduleConfigAction = getRequestTimelockedModuleConfigExecution({
      moduleTypeId: moduleTypeIds['executor'],
      module: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
      data: '0x',
      isInstall: true,
      additionalWait: 100,
    })

    const receipt = await sendUserOp({
      account,
      actions: [moduleConfigAction],
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should add address to flashloan', async () => {
    const addAddressFlashloanAction = getFlashloanAddAddressAction({
      addressToAdd: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
    })

    const receipt = await sendUserOp({
      account,
      actions: [addAddressFlashloanAction],
    })

    expect(receipt).toBeDefined()
  }, 20000)

  it('should remove address from flashloan', async () => {
    const addressToRemove = '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c'
    const removeAddressFromFlashloanAction =
      await getFlashloanRemoveAddressAction({
        account,
        client: publicClient,
        addressToRemove: addressToRemove,
      })

    const receipt = await sendUserOp({
      account,
      actions: [removeAddressFromFlashloanAction as Execution],
    })

    const whitelist = await getFlashloanWhitelist({
      account,
      client: publicClient,
    })

    expect(whitelist).not.toContain(addressToRemove)
    expect(receipt).toBeDefined()
  }, 20000)
}
