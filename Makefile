# p2pool ships a riscv64 binary, but debian:bookworm-slim has no riscv64 variant
# (no match for platform in manifest), so riscv is dropped for now — same as forgejo.
# Re-add 'riscv' here + 'riscv64' in the manifest once on a riscv64-capable base image.
ARCHES := x86 arm
include s9pk.mk
