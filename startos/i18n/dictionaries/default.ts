export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting P2Pool!': 0,
  'Store not found': 1,
  'Stratum Port': 2,
  'P2Pool stratum is ready for miners': 3,
  'P2Pool stratum is not yet listening. Check monerod connection and logs.': 4,
  'Configuration required': 5,
  'Monero Wallet Address': 6,
  'Your Monero primary address (starting with 4). Mining rewards will be sent here.': 7,
  'Use P2Pool Mini': 8,
  'P2Pool Mini has a lower share difficulty and is recommended for miners with less than ~50 kH/s hashrate. Disable to join the main P2Pool chain.': 9,
  'Monero Node Host': 10,
  'Hostname or IP address of your Monero node (monerod). Example: your-monero-node.local': 11,
  'Monero RPC Port': 12,
  "Your Monero node's unrestricted RPC port (default 18081). P2Pool requires the unrestricted RPC — a restricted node (typically 18089) cannot submit the blocks your pool finds.": 13,
  'Monero ZMQ Port': 14,
  'ZMQ port of your Monero node. Default: 18083.': 15,
  'Log Level': 16,
  'P2Pool log verbosity (0 = silent, 6 = maximum). Default: 3.': 17,
  'Configure P2Pool': 18,
  'Set your Monero wallet address, monerod connection, and P2Pool options.': 19,
  'Configuration Saved': 20,
  'P2Pool configuration saved. Restart the service to apply changes.': 21,
  'Stratum (miners)': 22,
  'Stratum port for XMRig and other Monero miners': 23,
  'P2Pool is not configured. Run the Configure action first.': 24,
  'Must be a 95-character Monero primary address starting with 4 (not a subaddress or integrated address).': 25,
  'P2P (sidechain)': 26,
  'P2Pool peer-to-peer port for connecting to other P2Pool nodes': 27,
  'P2Pool needs a Monero node with unrestricted RPC and ZMQ enabled, reachable from your StartOS server. The StartOS Monero service currently exposes only restricted RPC and will not work — you must run a separate, dedicated monerod.': 28,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
