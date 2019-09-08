#!/usr/bin/env bash
host="http://localhost:8081/"
base_url="ipns/syn.ci/"

npx polymer build --base-path $base_url
hash=$(ipfs add -r -q build/default | tail -n1)
echo "$hash >root hash"
ipfs name publish $hash
echo "online at $host$base_url"
