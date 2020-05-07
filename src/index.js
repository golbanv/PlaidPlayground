const plaid = require("plaid");
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const PlaidItem = require("./models/plaid-item")
const PlaidAccount = require("./models/plaid-account")
const User = require("./models/user")
const app = express()
const port = 3000

dotenv.config()

function handleError(errorMessage){
    console.error(errorMessage);
    
}

mongoose.connect(process.env.DB_CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

const client = new plaid.Client(process.env.PLAID_CLIENT_ID, process.env.PLAID_SECRET, process.env.PLAID_PUBLICK_KEY, plaid.environments.sandbox)

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "plaid-link.html"))
})



app.post("/plaid_token_exchange", async(req,res)=>{
    const {publicToken} = req.body;
 const {access_token} = await  client.exchangePublickToken(publicToken).catch(handleError)
const {accounts, item} =  await client.getAccounts(access_token).catch(handleError)

const user = new User({
    email:"example@test.com",
    password:"123456",
})

const savedUser = await user.save()

    const plaidItem = new PlaidItem({
        userId: savedUser._id,
        availableProducts: item.available_products,
        billedProducts: item.billed_products,
        institutionId: item.institution_id,
        itemId: item.id,
        webhook: item.webhook
    })

   const savedItem = await item.save()

   const savedAccounts = accounts.map(
    async account =>
      await new PlaidAccount({
        plaidItemId: plaidItem._id,
        accountId: account.account_id,
        mask: account.mask,
        balances: account.balances,
        name: account.name,
        officialName: account.official_name,
        subtype: account.subtype,
        type: account.type
      }).save()
  );


console.log({
savedUser,
savedAccounts,
savedItem
});


})

app.listen(port, () => console.log(`server startet at port ${port}`));