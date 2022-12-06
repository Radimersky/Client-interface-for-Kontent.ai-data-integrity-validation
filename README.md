# Kontent.ai data integrity validation

This project contains client interface that loads content item variants from Kontent.ai Delivery API. Using Phantom wallet they can be send to Solana blockchain. These variants on blockchain then can be used to perform data integrity validation against the variants in Delivery API.

The app is live on https://kontent-ai.netlify.app/ . Make sure you set the Phantom wallet to Devnet. You can get faucet (SOL) on https://solfaucet.com/

## Setup

- npm install
- npm run

## Important
- The "src" folder contains "AppConfig.ts" file where you can setup working environment (local, production, developement). The external urls are in the "Constants.ts" file.
- The app is dependend on these repositories:
	- https://github.com/Radimersky/Content-item-variant-signature-service
    - https://github.com/Radimersky/Solana-kontent

