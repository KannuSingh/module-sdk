import { UNIVERSAL_EMAIL_RECOVERY_ADDRESS } from './constants'
import { Execution } from '../../../account/types'
import {
  Address,
  encodeFunctionData,
  Hex,
  PublicClient,
  toHex,
  zeroAddress,
} from 'viem'
import { Account } from '../../../account/types'
import { abi } from './abi'

export type EmailAuthMsg = {
  templateId: bigint
  commandParams: Hex[]
  skippedCommandPrefix: bigint
  proof: EmailProof
}

export type EmailProof = {
  domainName: string
  publicKeyHash: Hex
  timestamp: bigint
  maskedCommand: string
  emailNullifier: Hex
  accountSalt: Hex
  isCodeExist: boolean
  proof: Hex
}

export const getRecoveryConfig = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{ delay: bigint; expiry: bigint }> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getRecoveryConfig',
      args: [account.address],
    })
  } catch (err) {
    return { delay: 0n, expiry: 0n }
  }
}

export const getRecoveryRequest = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly [bigint, bigint, bigint, Hex]> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getRecoveryRequest',
      args: [account.address],
    })
  } catch (err) {
    return [0n, 0n, 0n, toHex(0, { size: 32 })]
  }
}

export const getPreviousRecoveryRequest = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{
  previousGuardianInitiated: Address
  cancelRecoveryCooldown: bigint
}> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getPreviousRecoveryRequest',
      args: [account.address],
    })
  } catch (err) {
    return {
      previousGuardianInitiated: zeroAddress,
      cancelRecoveryCooldown: 0n,
    }
  }
}

export const isActivated = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<boolean> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'isActivated',
      args: [account.address],
    })
  } catch (err) {
    return false
  }
}

export const canStartRecoveryRequest = async ({
  account,
  client,
  validator,
}: {
  account: Account
  client: PublicClient
  validator: Address
}): Promise<boolean> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'canStartRecoveryRequest',
      args: [account.address, validator],
    })
  } catch (err) {
    return false
  }
}

export const getAllowValidatorRecoveryAction = ({
  validator,
  isInstalledContext,
  recoverySelector,
}: {
  validator: Address
  isInstalledContext: Hex
  recoverySelector: Hex
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'allowValidatorRecovery',
    abi,
    args: [validator, isInstalledContext, recoverySelector],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getDisallowValidatorRecoveryAction = ({
  validator,
  prevValidator,
  recoverySelector,
}: {
  validator: Address
  prevValidator: Address
  recoverySelector: Hex
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'disallowValidatorRecovery',
    abi,
    args: [validator, prevValidator, recoverySelector],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getAllowedValidators = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly Address[]> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getAllowedValidators',
      args: [account.address],
    })
  } catch (err) {
    return []
  }
}

export const getAllowedSelectors = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly Hex[]> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getAllowedSelectors',
      args: [account.address],
    })
  } catch (err) {
    return []
  }
}

export const acceptanceCommandTemplates = async ({
  client,
}: {
  client: PublicClient
}): Promise<readonly (readonly string[])[]> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'acceptanceCommandTemplates',
    })
  } catch (err) {
    return []
  }
}

export const recoveryCommandTemplates = async ({
  client,
}: {
  client: PublicClient
}): Promise<readonly (readonly string[])[]> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'recoveryCommandTemplates',
    })
  } catch (err) {
    return []
  }
}

export const extractRecoveredAccountFromAcceptanceCommand = async ({
  client,
  commandParams,
  templateIdx,
}: {
  client: PublicClient
  commandParams: Hex[]
  templateIdx: bigint
}): Promise<Address> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'extractRecoveredAccountFromAcceptanceCommand',
      args: [commandParams, templateIdx],
    })
  } catch (err) {
    return zeroAddress
  }
}

export const extractRecoveredAccountFromRecoveryCommand = async ({
  client,
  commandParams,
  templateIdx,
}: {
  client: PublicClient
  commandParams: Hex[]
  templateIdx: bigint
}): Promise<Address> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'extractRecoveredAccountFromRecoveryCommand',
      args: [commandParams, templateIdx],
    })
  } catch (err) {
    return zeroAddress
  }
}

export const computeAcceptanceTemplateId = async ({
  client,
  templateIdx,
}: {
  client: PublicClient
  templateIdx: bigint
}): Promise<bigint> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'computeAcceptanceTemplateId',
      args: [templateIdx],
    })
  } catch (err) {
    return 0n
  }
}

export const computeRecoveryTemplateId = async ({
  client,
  templateIdx,
}: {
  client: PublicClient
  templateIdx: bigint
}): Promise<bigint> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'computeRecoveryTemplateId',
      args: [templateIdx],
    })
  } catch (err) {
    return 0n
  }
}

export const getVerifier = async ({
  client,
}: {
  client: PublicClient
}): Promise<Address> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'verifier',
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getDkim = async ({
  client,
}: {
  client: PublicClient
}): Promise<Address> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'dkim',
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getEmailAuthImplementation = async ({
  client,
}: {
  client: PublicClient
}): Promise<Address> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'emailAuthImplementation',
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getUpdateRecoveryConfigAction = ({
  delay,
  expiry,
}: {
  delay: bigint
  expiry: bigint
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'updateRecoveryConfig',
    abi,
    args: [{ delay, expiry }],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getHandleAcceptanceAction = ({
  emailAuthMsg,
  templateIdx,
}: {
  emailAuthMsg: EmailAuthMsg
  templateIdx: bigint
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'handleAcceptance',
    abi,
    args: [emailAuthMsg, templateIdx],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getHandleRecoveryAction = ({
  emailAuthMsg,
  templateIdx,
}: {
  emailAuthMsg: EmailAuthMsg
  templateIdx: bigint
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'handleRecovery',
    abi,
    args: [emailAuthMsg, templateIdx],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getCompleteRecoveryAction = ({
  account,
  recoveryData,
}: {
  account: Address
  recoveryData: Hex
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'completeRecovery',
    abi,
    args: [account, recoveryData],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getCancelRecoveryAction = (): Execution => {
  const data = encodeFunctionData({
    functionName: 'cancelRecovery',
    abi,
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getCancelExpiredRecoveryAction = ({
  account,
}: {
  account: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'cancelExpiredRecovery',
    abi,
    args: [account],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const computeEmailAuthAddress = async ({
  client,
  recoveredAccount,
  accountSalt,
}: {
  client: PublicClient
  recoveredAccount: Address
  accountSalt: Hex
}): Promise<Address> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'computeEmailAuthAddress',
      args: [recoveredAccount, accountSalt],
    })
  } catch (err) {
    return zeroAddress
  }
}

export const getGuardianConfig = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<{
  guardianCount: bigint
  totalWeight: bigint
  acceptedWeight: bigint
  threshold: bigint
}> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getGuardianConfig',
      args: [account.address],
    })
  } catch (err) {
    return {
      guardianCount: 0n,
      totalWeight: 0n,
      acceptedWeight: 0n,
      threshold: 0n,
    }
  }
}

export const getGuardian = async ({
  account,
  client,
  guardian,
}: {
  account: Account
  client: PublicClient
  guardian: Address
}): Promise<{ status: number; weight: bigint }> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getGuardian',
      args: [account.address, guardian],
    })
  } catch (err) {
    return { status: 0, weight: 0n }
  }
}

export const getAllGuardians = async ({
  account,
  client,
}: {
  account: Account
  client: PublicClient
}): Promise<readonly Address[]> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'getAllGuardians',
      args: [account.address],
    })
  } catch (err) {
    return []
  }
}

export const hasGuardianVoted = async ({
  account,
  client,
  guardian,
}: {
  account: Account
  client: PublicClient
  guardian: Address
}): Promise<boolean> => {
  try {
    return await client.readContract({
      address: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
      abi,
      functionName: 'hasGuardianVoted',
      args: [account.address, guardian],
    })
  } catch (err) {
    return false
  }
}

export const getAddGuardianAction = ({
  guardian,
  weight,
}: {
  guardian: Address
  weight: bigint
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'addGuardian',
    abi,
    args: [guardian, weight],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getRemoveGuardianAction = ({
  guardian,
}: {
  guardian: Address
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'removeGuardian',
    abi,
    args: [guardian],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}

export const getChangeThresholdAction = ({
  threshold,
}: {
  threshold: bigint
}): Execution => {
  const data = encodeFunctionData({
    functionName: 'changeThreshold',
    abi,
    args: [threshold],
  })

  return {
    to: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    target: UNIVERSAL_EMAIL_RECOVERY_ADDRESS,
    value: 0n,
    callData: data,
    data,
  }
}
