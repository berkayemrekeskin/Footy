const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Info = require("../models/Info");
const asyncHandler = require("express-async-handler");

/*
    1. Get name, surname, email & password from body
    2. Check if all given
    3. Check mongoDB for the user using User schema , if found dont create return error
    4. Hash the given password using bcrypt
    5. Create the user and add to mongoDB
*/

//@desc Register a user
//@route POST /api/auth/register
//@access public

const registerUser = asyncHandler(async(req,res) => {

    const { name, surname, email, password } = req.body;

    if(!name || !surname || !email || !password)
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


/*
    1. Get email & password from body
    2. Check if both given
    3. Check mongoDB for the user using User schema
    4. Check the given password is correct with the found user
    5. Create an access token for the user to login
*/


//@desc Login user
//@route POST /api/auth/login
//@access public

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
                name: user.name,
                surname: user.surname,
                email: user.email,
                id: user.id,
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "1h"}
        );
        const info = await Info.findOne({user_id: user.id});
        console.log(await bcrypt.compare(password, user.password));
        res.status(200).json({
        accessToken: accessToken,    
        user: {
            name: user.name,
            surname: user.surname,
            email: user.email,
            id: user.id,
            info: info,
        }
        });
    }
    else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    //res.json( { message: "Login the user"});
});

const getUser = asyncHandler(async(req,res) => {
    res.json(req.user);
}
);

module.exports = { loginUser, registerUser, getUser };