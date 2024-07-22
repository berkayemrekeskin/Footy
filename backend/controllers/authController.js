const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Auth");
const Info = require("../models/Info");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async(req,res) => {

    const { username, email, password } = req.body;

    if( !username || !email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    try {
        let user = await User.findOne({ email });
        if(user)
            return res.status(400).json({ msg: "User is already registered!"});
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);

        user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
    
        console.log(`User created ${user}`);
        if(user) {
            res.status(201).json({_id: user.id, email: user.email});
        }
        else {
            res.status(400);
            throw new Error("User data is not valid");
        }
    
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});

const loginUser = asyncHandler( async (req,res) => {
    
    const {email, password} = req.body;

    if(!email || !password)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({email});

    //Compare password with hashed password

    if(user && (await bcrypt.compare(password, user.password)))
    {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "10h"}
        );
        const info = await Info.findOne({user_id: user.id});
        console.log(await bcrypt.compare(password, user.password));
        res.status(200).json({
        accessToken: accessToken,    
        user: {
            username: user.username,
            email: user.email,
            id: user.id,
        }
        });
    }
    else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    //res.json( { message: "Login the user"});
});

const changePassword = asyncHandler(async(req,res) => {

    const {email, password, newPassword} = req.body;
    let user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password)))
    {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("Hashed password: ", hashedPassword);
        user = await User.findOneAndUpdate({_id: user._id}, {$set: {password: hashedPassword}}, {new: true});
        console.log("New password: ", user.password);
        res.status(200).json({
            user
        });
    }
    else 
    {
        res.status(400);
    }

});

module.exports = { loginUser, registerUser, changePassword};