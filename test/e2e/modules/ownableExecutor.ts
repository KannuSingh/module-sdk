import { Account, Execution, isModuleInstalled } from 'src/account'
import { getModule } from 'src/module'
import {
  getAddOwnableExecutorOwnerAction,
  getOwnableExecutorOwners,
  getRemoveOwnableExecutorOwnerAction,
} from 'src/module/ownable-executor'
import { Address, getAddress, Hex, PublicClient, TestClient } from 'viem'
import { getInstallModuleData, sendUserOp } from '../infra'
import {
  getExecuteBatchOnOwnedAccountAction,
  getExecuteOnOwnedAccountAction,
} from 'src/module/ownable-executor/usage'
import { GLOBAL_CONSTANTS } from 'src/constants'

type Params = {
  account: Account
  publicClient: PublicClient
  testClient: TestClient
}

export const testOwnableExecutor = async ({
  account,
  publicClient,
}: Params) => {
  it('should return true when checking ownable executor isInstalled', async () => {
    const isOwnableValidatorInstalled = await isModuleInstalled({
      account,
      client: publicClient,
      module: getModule({
        type: 'executor',
        module: GLOBAL_CONSTANTS.OWNABLE_EXECUTOR_ADDRESS,
      }),
    })

    expect(isOwnableValidatorInstalled).toBe(true)
  }, 20000)

  it('should return correct module owners', async () => {
    const { ownableExecutor } = getInstallModuleData({ account })

    const owners = await getOwnableExecutorOwners({
      account,
      client: publicClient,
    })

    expect(getAddress(owners[0])).toEqual(getAddress(ownableExecutor.owner))
  }, 20000)

  it('should add new owner to ownable executor', async () => {
    const newOwner = '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwnableExecutorOwners({
      account,
      client: publicClient,
    })
    const addNewOwnerAction = await getAddOwnableExecutorOwnerAction({
      owner: newOwner,
      account,
      client: publicClient,
    })

    await sendUserOp({ account, actions: [addNewOwnerAction] })

    const newOwners = await getOwnableExecutorOwners({
      account,
      client: publicClient,
    })
    expect(newOwners.length).toEqual(oldOwners.length + 1)
  }, 20000)

  it('should remove owner from ownable executor', async () => {
    const ownerToRemove =
      '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address

    const oldOwners = await getOwnableExecutorOwners({
      account,
      client: publicClient,
    })
    const removeOwnerAction = await getRemoveOwnableExecutorOwnerAction({
      account,
      client: publicClient,
      owner: ownerToRemove,
    })

    await sendUserOp({ account, actions: [removeOwnerAction as Execution] })

    const newOwners = await getOwnableExecutorOwners({
      account,
      client: publicClient,
    })
    expect(newOwners.length).toEqual(oldOwners.length - 1)
  }, 20000)

  it('should execute on owned account', async () => {
    const executeOnOwnedAccount = getExecuteOnOwnedAccountAction({
      ownedAccount: account.address,
      execution: {
        to: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
        target: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c',
        value: BigInt(0),
        callData: '0x',
        data: '0x',
      },
    })

    const hash = await sendUserOp({
      account,
      actions: [executeOnOwnedAccount],
    })

    expect(hash).toBeDefined()
  }, 20000)

  it('should batch execute on owned account', async () => {
    const execution = {
      to: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address,
      target: '0x206f270A1eBB6Dd3Bc97581376168014FD6eE57c' as Address,
      value: BigInt(0),
      callData: '0x' as Hex,
      data: '0x' as Hex,
    }

    const executeOnOwnedAccount = getExecuteBatchOnOwnedAccountAction({
      ownedAccount: account.address,
      executions: [execution, execution],
    })

    const hash = await sendUserOp({
      account,
      actions: [executeOnOwnedAccount],
    })

    expect(hash).toBeDefined()
  }, 20000)
}
