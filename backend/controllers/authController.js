const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");


const registerUser = asyncHandler(async(req,res) => {

    const { name, surname, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(user)
            return res.status(400).json({ msg: "User is already registered!"});
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);

        user = await User.create({
            name,
            surname,
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
        {expiresIn: "1h"}
    );
        console.log(await bcrypt.compare(password, user.password));
        res.status(200).json({accessToken});
    }
    else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    res.json( { message: "Login the user"});
});


module.exports = { loginUser, registerUser };