<p align="center">
  <img src="icon.svg" alt="P2Pool Logo" width="21%">
</p>

# P2Pool on StartOS

> **Upstream docs:** <https://github.com/SChernykh/p2pool/blob/master/README.md>
>
> Everything not listed in this document should behave the same as upstream
> P2Pool. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable.

P2Pool is a decentralized, permissionless, 0%-fee peer-to-peer mining pool for
Monero. This package runs your own P2Pool node on StartOS and exposes its stratum
port so your miners can connect directly. Source: [SChernykh/p2pool](https://github.com/SChernykh/p2pool).

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Image         | Custom Dockerfile — official P2Pool release binary on a Debian slim base |
| Verification  | Release tarball checked against the signed `sha256sums.txt.asc`        |
| Architectures | x86_64, aarch64                                                       |
| Command       | `p2pool` (arguments assembled by StartOS from the Configure action)   |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose                                                              |
| ------ | ----------- | ------------------------------------------------------------------- |
| `main` | `/data`     | P2Pool cache, peer list, and log (`--data-dir`), plus `store.json`  |

`store.json` holds the StartOS-managed configuration (wallet address, monerod
connection, and pool options). P2Pool's own runtime files (`p2pool.cache`,
peer data, `p2pool.log`) live alongside it under `/data`. No Monero wallet keys
are stored — rewards are paid to the external address you configure.

---

## Installation and First-Run Flow

P2Pool has no upstream setup wizard. On first launch the service **refuses to
start until it is configured**: it seeds default settings and raises a required
Configure task. Until you provide a wallet address and a monerod host, the
service stays in an error state with only that task actionable.

1. Install the package.
2. Run the **Configure P2Pool** action and set, at minimum, your Monero wallet
   address and your monerod host.
3. Start the service.

---

## Configuration Management

All configuration is StartOS-managed via the Configure action; there is no
upstream config file or in-app settings UI to manage separately.

| StartOS-Managed (Configure action → `store.json` → daemon arguments) | Upstream-Managed |
| -------------------------------------------------------------------- | ---------------- |
| Wallet address, P2Pool Mini toggle, monerod host, monerod RPC port, monerod ZMQ port, log level | None exposed |

Configuration changes take effect on the next service start (the action confirms
with a reminder to restart).

---

## Network Access and Interfaces

| Interface          | Port  | Protocol  | Purpose                                          |
| ------------------ | ----- | --------- | ------------------------------------------------ |
| Stratum (miners)   | 3333  | TCP (raw) | Miners (XMRig and other Stratum clients) connect here |
| P2P (sidechain)    | 37889 | TCP (raw) | Inbound connections from other P2Pool nodes      |

**Access methods:**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address (if a Tor interface is provisioned)
- Custom domains (if configured)

The stratum port is the one your miners point at. The p2p port is for sidechain
peering — forwarding it lets other P2Pool nodes connect to you; outbound peering
works regardless. The p2p port is pinned to 37889 for both the main and mini
sidechains.

---

## Actions (StartOS UI)

| Action            | ID          | Visibility | Availability | Purpose                                                        |
| ----------------- | ----------- | ---------- | ------------ | -------------------------------------------------------------- |
| Configure P2Pool  | `configure` | Enabled    | Any status   | Set the wallet address, monerod connection, and pool options.  |

**Inputs:** Monero wallet address (primary address, validated), P2Pool Mini
toggle, monerod host, monerod RPC port, monerod ZMQ port, log level.
**Output:** a confirmation noting that changes apply on the next start.

---

## Backups and Restore

**Included in backup:**

- `main` volume (configuration plus P2Pool cache, peers, and log)

**Restore behavior:** the volume is fully restored before the service starts.
The cache and peer list are non-critical (P2Pool rebuilds them from the network);
the meaningful restored state is your `store.json` configuration.

---

## Health Checks

| Check        | Method                       | Messages                                                                                  |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------- |
| Stratum Port | Port listening (3333), 180s grace | Success: "P2Pool stratum is ready for miners" / Error: "P2Pool stratum is not yet listening. Check monerod connection and logs." |

P2Pool opens its stratum port only after it successfully connects to monerod, so
a green check also confirms a working monerod connection.

---

## Dependencies

> [!IMPORTANT]
> **The StartOS Monero (`monerod`) package cannot currently serve as P2Pool's node.**
> It publishes only a *restricted* RPC interface to other services, and a restricted
> node cannot run `submit_block` — a pool pointed at it would serve miners but
> **silently fail to submit any block it finds**. Until the Monero package exposes an
> unrestricted RPC interface, P2Pool **must** connect to a separate, external monerod
> that you run and control.

**No StartOS package dependency.** P2Pool connects to a monerod that **you supply**
(host and ports set in the Configure action). That node must expose:

- **Unrestricted RPC** (default 18081) — P2Pool submits found blocks via `submit_block`,
  which restricted RPC rejects.
- **ZMQ pub** (default 18083) — P2Pool consumes monerod's `--zmq-pub` stream to build
  block templates.

Run that monerod on separate hardware or another machine on your LAN, reachable from
your StartOS server.

---

## Limitations and Differences

1. **Requires an external unrestricted monerod (RPC + ZMQ).** This is not bundled,
   and the community monerod package's exposed RPC is restricted and insufficient
   for block submission.
2. **No bundled stats dashboard.** P2Pool's local API is file-based and not exposed
   as an interface; track your shares and payouts on the public observer
   (`mini.p2pool.observer` / `p2pool.observer`) by wallet address.
3. **Inbound internet peering needs manual port forwarding.** The p2p port is
   exposed on the LAN, but reaching it from the internet requires forwarding it
   yourself; `--p2p-external-port` is not currently configurable.
4. **Primary address only.** Mining to a subaddress or integrated address is not
   supported by the Configure form.
5. **No riscv64 build.** P2Pool ships a riscv64 binary, but the Debian slim base
   image has no riscv64 variant, so only x86_64 and aarch64 are built.

---

## What Is Unchanged from Upstream

The P2Pool binary is the official upstream release, signature/checksum-verified
and unmodified. Sidechain selection (main vs mini), the stratum protocol,
share/PPLNS accounting, peer discovery, and all mining semantics behave exactly as
upstream documents. Anything not listed in this README is upstream-accurate.

---

## Quick Reference for AI Consumers

```yaml
package_id: p2pool
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  stratum: 3333
  p2p: 37889
dependencies: none
startos_managed_env_vars: none
actions:
  - configure
```
