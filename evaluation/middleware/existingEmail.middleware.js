const { UserModel } = require("../model/user.model");


const existingEmail = async(req, res, next) => {
    try {
        const { email } = req.body;
        const data = await UserModel.find({ email });
        if (data.length >= 1) {
            res.status(404).json({ 'msg': 'Email-ID already registered' })
        } else {
            next();
        }
    }catch(err){
        res.status(404).json({ 'msg': 'Something went Wrong!' })
    }
}

module.exports = {existingEmail};