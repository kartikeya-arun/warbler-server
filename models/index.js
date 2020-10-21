const mongoose=require('mongoose');
mongoose.set('debug',true);
mongoose.Promise=Promise;
mongoose.connect(process.env.DB_URI||"mongodb://localhost/warbler",{
    keepAlive: true,
});

module.exports.User=require("./user");
module.exports.Message=require("./message");