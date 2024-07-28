#!/bin/bash

#YOU NEED TO EXPORT THE WALLET_ADDRESS AND WALLET_PK FIRST
#E.g.
#export WALLET_ADDRESS=your_wallet_address
#export WALLET_PK=your_wallet_pk

docker run -e REACT_APP_WALLET_ADDRESS=$WALLET_ADDRESS -e REACT_APP_WALLET_PK=$WALLET_PK REACT_APP_ENVIRONMENT='prod' -dp 3000:3000 paulrodas/usdt-batch-transfer:latest