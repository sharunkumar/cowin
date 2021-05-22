# Personal Bot for Cowin Vaccination Availabilty

## Prerequesites
1. Group or channel on Telegram. Make sure you have the group's ID
2. A Telegram bot. Talk to @botfather on Telegram to create a bot and get its access token. Also, add the bot to the group where it needs to send messages
3. IDs of districts you want to poll. This can be obtained from [Govt. Metadata API](https://apisetu.gov.in/public/marketplace/api/cowin/cowin-public-v2)
4. NodeJS

## Setup
1. Clone the code and install npm packages
```
git clone git@github.com:sharunkumar/cowin.git
cd cowin
npm install
```
2. Generate a config file. Run the following: `npm run config`
3. Once the config file is generated, you can run the bot using `npm start`
