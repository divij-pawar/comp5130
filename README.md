# Introduction
This project involves creating a website where users can buy and sell items within their university campus. Each university acts as a local marketplace, enabling short-distance, in-person transactions. The platform's role is to connect buyers and sellers, without handling payments or order fulfillment.
# What?
It is a website created in MERN (Mongo Express ReactJS Node.js) stack. Users can lookup items, or post items for sale. Then chat with the person that is interested in buying/selling.
# Why?
The aim of the website is to encourage reuse and reduce individuals' carbon footprints.
## Installation
This project uses Atlas to host the MongoDB database. You can signup and get your mongodb uri <a href="https://www.mongodb.com/atlas">here</a>.

```bash
$ git clone https://github.com/divij-pawar/comp5130.git
$ cd comp5130/switch-mern
$ npm install 
$ touch .env
$ echo MONGO_URI= (your mongodb uri here) >> .env
$ echo PORT=5000 >> .env
$ cd client
$ npm install
```

## Usage
### Start the server
In $ ../comp5130/switch-mern
 ```bash
$ npm run dev
 ```
 ### Start the client
In $../comp5130/switch-mern/client
```bash
$ npm start
```