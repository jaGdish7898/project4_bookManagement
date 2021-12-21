const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')



// VALIDATION
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


// USER CREATATION 
const createUser = async function (req, res) {
    let requestBody = req.body;
    try {
        
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details' })
            return
        }

        let { name, title, email, phone, password } = requestBody

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: 'Title is required' })
            return
        }
        title=title.trim()

        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, message: `Title should be among Mr, Mrs, Miss ` })
            return
        }

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'name is required' })
            return
        }
        if (!isValid(phone)) {
            res.status(400).send({ status: false, message: 'phone number is required' })
            return
        }

        phone=phone.trim()

        if (!(/^[6-9]\d{9}$/gi.test(phone))) {
            res.status(400).send({ status: false, message: `phone number should be valid number` })
            return
        }
        const isPhoneAlreadyUsed = await userModel.findOne({ phone });

        if (isPhoneAlreadyUsed) {
            res.status(400).send({ status: false, message: `${phone}  is already registered` })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }

        const isEmailAlreadyUsed = await userModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} email address is already registered` })
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }

        password=password.trim()

        if (!(password.length<=15 && password.length>=8 )) {
            res.status(400).send({ status: false, message: `password length should be betwwen 8-15` })
            return
        }

        //!(8<=password.length<=15)
       
        let user = await userModel.create(req.body)
        res.status(201).send({ status: true, msg:"success",data: user })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}




//=========================================================================================================


// LOGIN USER 
const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        const { email, password } = requestBody;
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: `Email is required` })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: `Password is required` })
            return
        }
        const user = await userModel.findOne({ email, password });
        if (!user) {
            res.status(401).send({ status: false, message: `Invalid login credentials` });
            return
        }
        let payload = { _id: user._id }
        let token = await jwt.sign(payload,
            
            '16th-Dec-Project-Books', { expiresIn: '30min' })
           
        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
module.exports.loginUser = loginUser
module.exports.createUser = createUser









