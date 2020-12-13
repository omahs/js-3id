import { createLink, authenticate } from '3id-blockchain-utils'
import type { LinkProof } from '3id-blockchain-utils'
import { AccountID } from 'caip'

import AbstractAuthProvider from './abstractAuthProvider'
import { assert } from '../errors'
import type { EOSIOProvider } from '../types'

/**
 *  AuthProvider which can be used for eosio providers that meet the universal authentication interface(UAL)
 */
class EOSIOAuthProvider extends AbstractAuthProvider {
  accountId: string | null
  provider: EOSIOProvider

  constructor(eosioProvider: EOSIOProvider) {
    assert.isDefined(eosioProvider, 'Missing EOSIO provider')
    super('eosio')
    this.provider = eosioProvider
    this.accountId = null
  }

  async init(): Promise<void> {
    this.accountId = await this._toAccoundId()
  }

  _toCAIPChainId(chainId: string): string {
    return `eosio:${chainId.substr(0, 32)}`
  }

  async _toAccoundId(address?: string): Promise<string> {
    if (!address && this.accountId) {
      return this.accountId
    }
    const chainId = this._toCAIPChainId(await this.provider.getChainId())
    address = address || (await this.provider.getAccountName())
    return new AccountID({ address, chainId }).toString()
  }

  async authenticate(message: string, address?: string): Promise<string> {
    assert.isString(message, 'Message must be a string')
    // @ts-ignore wrong definition in 3id-blockchain-utils?
    const accountId = await this._toAccoundId(address)
    console.log('AccountId: ', accountId)
    return await authenticate(message, accountId, this.provider)
  }

  async createLink(did: string, address?: string): Promise<LinkProof> {
    assert.isString(did, 'DID must be a string')
    // @ts-ignore wrong definition in 3id-blockchain-utils?
    const accountId = await this._toAccoundId(address)
    console.log('AccountId: ', accountId)
    return createLink(did, accountId, this.provider, { type: 'eosio' })
  }
}

export default EOSIOAuthProvider
