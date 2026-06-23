import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    walletAddress: z.string().catch(''),
    miniSidechain: z.boolean().catch(true),
    monerodHost: z.string().catch(''),
    monerodRpcPort: z.number().catch(18089),
    monerodZmqPort: z.number().catch(18083),
    logLevel: z.number().min(0).max(6).catch(3),
  })
  .strip()

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
