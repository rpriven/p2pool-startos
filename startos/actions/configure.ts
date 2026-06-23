import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  walletAddress: Value.text({
    name: i18n('Monero Wallet Address'),
    description: i18n(
      'Your Monero primary address (starting with 4). Mining rewards will be sent here.',
    ),
    required: true,
    default: null,
    patterns: [
      {
        regex: '^4[1-9A-HJ-NP-Za-km-z]{94}$',
        description: i18n(
          'Must be a 95-character Monero primary address starting with 4 (not a subaddress or integrated address).',
        ),
      },
    ],
  }),
  miniSidechain: Value.toggle({
    name: i18n('Use P2Pool Mini'),
    description: i18n(
      'P2Pool Mini has a lower share difficulty and is recommended for miners with less than ~50 kH/s hashrate. Disable to join the main P2Pool chain.',
    ),
    default: true,
  }),
  monerodHost: Value.text({
    name: i18n('Monero Node Host'),
    description: i18n(
      'Hostname or IP address of your Monero node (monerod). Example: your-monero-node.local',
    ),
    required: true,
    default: null,
  }),
  monerodRpcPort: Value.number({
    name: i18n('Monero RPC Port'),
    description: i18n(
      'RPC port of your Monero node. Default: 18089 (restricted RPC, works for mining). Use 18081 (unrestricted) for full functionality including block submission.',
    ),
    required: false,
    default: 18089,
    min: 1,
    max: 65535,
    step: null,
    integer: true,
    units: null,
  }),
  monerodZmqPort: Value.number({
    name: i18n('Monero ZMQ Port'),
    description: i18n('ZMQ port of your Monero node. Default: 18083.'),
    required: false,
    default: 18083,
    min: 1,
    max: 65535,
    step: null,
    integer: true,
    units: null,
  }),
  logLevel: Value.number({
    name: i18n('Log Level'),
    description: i18n('P2Pool log verbosity (0 = silent, 6 = maximum). Default: 3.'),
    required: false,
    default: 3,
    min: 0,
    max: 6,
    step: null,
    integer: true,
    units: null,
  }),
})

export const configure = sdk.Action.withInput(
  // id
  'configure',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure P2Pool'),
    description: i18n(
      'Set your Monero wallet address, monerod connection, and P2Pool options.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const store = await storeJson.read().once()
    if (!store) return {}
    return {
      walletAddress: store.walletAddress || undefined,
      miniSidechain: store.miniSidechain,
      monerodHost: store.monerodHost || undefined,
      monerodRpcPort: store.monerodRpcPort,
      monerodZmqPort: store.monerodZmqPort,
      logLevel: store.logLevel,
    }
  },

  // the execution function
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      walletAddress: input.walletAddress,
      miniSidechain: input.miniSidechain,
      monerodHost: input.monerodHost,
      monerodRpcPort: input.monerodRpcPort ?? 18089,
      monerodZmqPort: input.monerodZmqPort ?? 18083,
      logLevel: input.logLevel ?? 3,
    })

    return {
      version: '1',
      title: i18n('Configuration Saved'),
      message: i18n(
        'P2Pool configuration saved. Restart the service to apply changes.',
      ),
      result: null,
    }
  },
)
