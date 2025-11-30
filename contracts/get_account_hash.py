import hashlib
import sys

if len(sys.argv) < 2:
    print("Usage: python3 get_account_hash.py <public_key_hex>")
    sys.exit(1)

hex_key = sys.argv[1]

# Casper public keys in hex are Tag (1 byte) + Key Bytes.
# 01 = Ed25519 (32 bytes key)
# 02 = Secp256k1 (33 bytes key)

tag = hex_key[:2]
key_bytes_hex = hex_key[2:]

try:
    key_bytes = bytes.fromhex(key_bytes_hex)
except ValueError:
    print("Invalid hex string")
    sys.exit(1)

algo_name = ""
if tag == "01":
    algo_name = "ed25519"
    if len(key_bytes) != 32:
        print(f"Invalid Ed25519 key length: {len(key_bytes)}")
        sys.exit(1)
elif tag == "02":
    algo_name = "secp256k1"
    if len(key_bytes) != 33:
        print(f"Invalid Secp256k1 key length: {len(key_bytes)}")
        sys.exit(1)
else:
    print(f"Unknown tag {tag}")
    sys.exit(1)

# Preimage: algo_name bytes + 0 byte + key bytes
preimage = algo_name.encode('utf-8') + b'\x00' + key_bytes

# Blake2b-256 (32 bytes digest)
h = hashlib.blake2b(digest_size=32)
h.update(preimage)
account_hash = h.hexdigest()

print(f"account-hash-{account_hash}")
