FROM node:14.17.6

ENV REACT_APP_WALLET_ADDRESS=$WALLET_ADDRESS
ENV REACT_APP_WALLET_PK=$WALLET_PK

RUN mkdir /app
WORKDIR /app

RUN git clone https://github.com/prodasl/TRC20-Batch-Transfer.git

# RUN npm install dotenv
# RUN npm install @tronweb3/tronwallet-abstract-adapter @tronweb3/tronwallet-adapters

RUN npm install

CMD ["npm", "start"]