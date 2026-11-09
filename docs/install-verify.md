# Install the sovereign-swap client: download, verify, sideload (#35)

For the beta, the client ships as a signed StartOS package (`.s9pk`) you download, verify, and sideload
onto your own StartOS server. Verifying the signature is not optional: it is how you know the package is
the one we built and published, not something tampered with in transit. It takes a minute.

## 1. Download the release files

From the latest release at
`https://github.com/TwentyOneLife/sovereign-swap-client-startos/releases/latest`, download all three:

- `sovereign-swap-client_x86_64.s9pk` , the package
- `SHA256SUMS` , the checksum of the package
- `SHA256SUMS.asc` , our detached GPG signature over `SHA256SUMS`

## 2. Verify the signature and checksum

You verify in two steps: the GPG signature proves `SHA256SUMS` is ours, then the checksum proves the
`.s9pk` matches what that signed file lists.

Import our release key (published in the repo at `keys/twentyonelife-release.asc`) into a throwaway
keyring, so your own keyring is untouched and the check is exactly what a fresh user sees:

```
# From the folder with the three downloaded files, and a local copy of the release key:
export GNUPGHOME=$(mktemp -d)
gpg --import twentyonelife-release.asc

# 1) The signature over SHA256SUMS must be a GOOD signature from TwentyOne.Life <dev@twentyone.life>:
gpg --verify SHA256SUMS.asc SHA256SUMS

# 2) The .s9pk must match the checksum that signed file lists:
sha256sum --check --strict SHA256SUMS

rm -rf "$GNUPGHOME"
```

The signing key's primary fingerprint is:

```
09F6 80BB 428D 92E4 BEDC  8251 15DC 7438 A64C 9B6D
```

A `gpg --verify` that says "Good signature" and a `sha256sum --check` that prints `OK` mean the package
is authentic and intact. (The "This key is not certified with a trusted signature" warning is expected:
it only means you have not personally signed our key in your web of trust; the cryptographic signature
itself is still valid.) **If either check fails, stop and do not install the package.**

## 3. Sideload onto your StartOS server

With the verified `.s9pk` on (or copied to) the server:

```
# over SSH to your StartOS server:
sudo start-cli package install --trust --sideload sovereign-swap-client_x86_64.s9pk
```

`--trust` tells StartOS to install a locally supplied package; the signature and integrity you checked
in step 2 are what establish trust, so do not skip step 2. The package appears in your StartOS UI once
it installs.

## 4. Next

Configure it and connect your nodes: see the end-to-end setup guide (`docs/end-to-end-setup.md`) and the
package's own instructions.

---

A one-click install from a StartOS registry is planned for the public launch; for the beta, this
download-and-verify path is the distribution method, and it is the same verification we run on every
deploy.
