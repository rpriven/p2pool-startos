# P2Pool — Post-Install Instructions

## 1. Configure P2Pool

After installation, open the **Actions** menu and run **Configure P2Pool**.

You must set:
- **Monero Wallet Address** — your primary XMR address (starts with 4, 95 characters)
- **Monero Node Host** — the hostname or LAN address of a running `monerod` instance
  (e.g. `your-monero-node.local`)

Optional fields have sensible defaults (P2Pool Mini enabled, RPC port 18089,
ZMQ port 18083, log level 3).

## 2. Ensure monerod is accessible

P2Pool needs monerod with:
- Restricted RPC enabled (`--restricted-rpc --rpc-bind-ip=0.0.0.0`)
- ZMQ enabled (`--zmq-pub tcp://0.0.0.0:18083`)

If monerod is on the same LAN, make sure it accepts connections from your
StartOS box's address.

## 3. Point your miners at the stratum port

Once P2Pool is running (health check turns green), configure your miners:

```
Pool:     <your-startos-box>.local:3333
Username: (leave empty or use any string — not used by P2Pool)
Password: (leave empty)
```

For XMRig:
```json
"pool": {
  "url": "your-startos-box.local:3333",
  "user": "",
  "pass": ""
}
```

## 4. Verify your shares

Track your mining progress on the P2Pool observer:
- Mini: https://mini.p2pool.observer
- Main: https://p2pool.observer

Search for your wallet address to see your shares and estimated payouts.
