FROM node:14.17.6

RUN mkdir /app
WORKDIR /app

RUN git clone https://github.com/prodasl/TRC20-Batch-Transfer.git

WORKDIR /app/TRC20-Batch-Transfer

RUN npm install

CMD ["npm", "start"]