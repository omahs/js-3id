import { RPCError } from 'rpc-utils'
import type { RPCErrorObject } from 'rpc-utils'

// TODO didprovider, auth failed codes?
export const rpcError = (id: string | number): RPCErrorObject & { id: string | number } => {
  const rpcError = new RPCError(-32401, `3id-connect: Request not authorized`)
  return Object.assign(rpcError.toObject(), { id })
}

export const didShorten = (did: string): string =>
  `${did.substring(0, 10)}...${did.substring(did.length - 5, did.length)}`
