# P2Pool

> **You must run your own external Monero node.** P2Pool needs a `monerod` with
> **unrestricted RPC** and **ZMQ** enabled, reachable from your StartOS server. The
> StartOS Monero package will **not** work for this yet — it exposes only a restricted
> RPC, and a restricted node can't submit the blocks your pool finds. Run a separate,
> dedicated monerod (another machine on your LAN is ideal).

## Documentation

- [P2Pool README](https://github.com/SChernykh/p2pool/blob/master/README.md) — the upstream setup and usage reference, including the full list of monerod requirements.

## What you get on StartOS

- **Your own P2Pool node** — a decentralized, 0%-fee Monero pool with no operator and no registration.
- **A Stratum interface** your miners connect to directly.
- **A P2P interface** for connecting to the rest of the P2Pool sidechain.
- **A Configure action** to set your wallet and monerod connection.

## Getting set up

1. **Prepare your Monero node first.** On the machine running `monerod`, enable
   unrestricted RPC and ZMQ and bind them where your StartOS box can reach them —
   for example:

   ```
   monerod --zmq-pub tcp://0.0.0.0:18083 \
           --rpc-bind-ip 0.0.0.0 --confirm-external-bind \
           --out-peers 32 --in-peers 64 \
           --disable-dns-checkpoints --enable-dns-blocklist
   ```

   Keep this node on a trusted LAN or firewall the RPC port to your StartOS box —
   an unrestricted RPC should never be open to the internet.

2. **Run the Configure P2Pool action.** Set your Monero **primary** wallet address
   (it starts with `4`), your monerod **host**, and — if you changed them — the RPC
   and ZMQ ports. Leave **Use P2Pool Mini** on if you mine under ~50 kH/s.

3. **Start the service.** P2Pool connects to monerod first, then opens its stratum
   port; the **Stratum Port** health check turns green once it is ready for miners.
   If it stays red, recheck the monerod host, ports, RPC/ZMQ flags, and that the
   node is reachable from your StartOS box.

4. **Point your miners at the Stratum interface.** Copy its address from the
   service's interfaces, and use it as your pool URL.

## Using P2Pool

### Connecting miners

P2Pool uses your configured wallet address — miners need no username or password.
For XMRig, set the pool to your Stratum interface address (port `3333`):

```json
"pool": { "url": "your-startos-box.local:3333", "user": "", "pass": "" }
```

### Re-configuring

Run **Configure P2Pool** again any time to change your wallet, switch between the
Mini and main sidechain, or adjust the monerod connection. Restart the service to
apply the changes.

### Checking your shares

P2Pool has no built-in dashboard. Track your shares and estimated payouts on the
public observer by searching your wallet address:

- Mini sidechain: <https://mini.p2pool.observer>
- Main sidechain: <https://p2pool.observer>
