# P2Pool for StartOS

Run your own P2Pool node on StartOS. P2Pool is a decentralized, permissionless,
0%-fee peer-to-peer Monero mining pool.

## What is P2Pool?

P2Pool lets you mine Monero without trusting a centralized pool. You run your own
pool node, point your miners at it, and earn rewards directly to your wallet.
No fees. No registration. No custodian.

## Architecture

This package runs the p2pool daemon and exposes the stratum port (3333) on your
StartOS LAN so miners (XMRig, etc.) can connect directly.

**Monerod is a configurable remote node** — you supply the host/port in the
Configure action. A future version will optionally depend on the StartOS monerod
package once its 0.4 port lands.

## Configuration

After installing, run the **Configure** action and set:

| Field | Description | Default |
|-------|-------------|---------|
| Monero Wallet Address | Your primary XMR address (starts with 4) | required |
| Use P2Pool Mini | Lower difficulty, for < 50 kH/s miners | true |
| Monero Node Host | Hostname/IP of your monerod | required |
| Monero RPC Port | monerod restricted RPC port | 18089 |
| Monero ZMQ Port | monerod ZMQ port | 18083 |
| Log Level | Verbosity 0-6 | 3 |

## Connecting Miners

Point XMRig (or any Stratum-compatible miner) at:

```
stratum+tcp://your-startos-box.local:3333
```

No username/password needed — P2Pool uses the wallet address configured in the
package.

## Building via CI

This package is built by Start9 CI. Do not run `make` locally — push a PR
against `main` and the `build.yml` workflow will produce the `.s9pk` artifact.

## Links

- Upstream: https://github.com/SChernykh/p2pool
- P2Pool website: https://p2pool.io/
- StartOS: https://start9.com

## License

GPL-3.0 — see [LICENSE](LICENSE)
