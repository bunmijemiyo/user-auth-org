const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Change this
// const bcrypt = require('bcrypt');

// To this
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');


const { v4: uuidv4 } = require('uuid');
const  Organisation = require('../db/models/organisation');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

/*
const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if(user) console.log('user', user)

    // if (!['1', '2'].includes(body.userType)) {
    //     throw new AppError('Invalid user Type', 400);
    // }

    const existingUser = await user.findOne({
        where: {
            email: body.email,
            deletedAt: null
        },
    });

    if (existingUser) {
        return next(new AppError('Email already exists', 400));
    }

    
    

    const newUser = await user.create({
        userId: uuidv4(),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
        return next(new AppError('Registration Unsuccessful', 400));
    }

    // Create default organisation
    // const Organisation = db.Organisation
    const organisationName = `${body.firstName}'s Organisation`;
    const orgId = uuidv4();
    const newOrganisation = await Organisation.create({
      name: organisationName, orgId,
    });

    // console.log(newUser)
    // console.log('New User:', newUser.toJSON());
    // console.log('New Organisation:', newOrganisation.toJSON());


    try {
        await newUser.addOrganisation(newOrganisation);
    } catch (error) {
        console.error('Error associating user with organisation:', error);
        return next(new AppError('Registration Unsuccessful', 400));
    }


     // Add user to organisation
     await newUser.addOrganisation(newOrganisation);

    //  console.log(newUser)

     const result = {
        userId: newUser.userId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone, // Include phone in the result
        token: generateToken({
            id: newUser.userId, // Adjust if necessary to match the actual user ID field
        }),
    };

    // const result = newUser.toJSON();

    // delete result.password;
    // delete result.deletedAt;

    // result.token = generateToken({
    //     id: result.userId,
    // });

    return res.status(201).json({
        status: 'success',
        message: "Registration successful",
        data: result,
    });
});
*/

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    // Check if user exists
    const existingUser = await user.findOne({
        where: {
            email: body.email,
            deletedAt: null
        },
    });

    if (existingUser) {
        return next(new AppError('Email already exists', 400));
    }

    // Create new user
    const newUser = await user.create({
        userId: uuidv4(),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        password: await bcrypt.hash(body.password, 12), // Hash password
        confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
        return next(new AppError('Registration Unsuccessful', 400));
    }

    // Create default organisation
    const organisationName = `${body.firstName}'s Organisation`;
    const orgId = uuidv4();
    const newOrganisation = await Organisation.create({
        name: organisationName,
        orgId,
    });

    try {
        // Directly create entry in the UserOrganisation join table
        await UserOrganisation.create({
            userId: newUser.userId,
            orgId: newOrganisation.orgId
        });
    } catch (error) {
        console.error('Error associating user with organisation:', error);
        return next(new AppError('Registration Unsuccessful', 400));
    }

    const result = {
        userId: newUser.userId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        token: generateToken({
            id: newUser.userId,
        }),
    };

    return res.status(201).json({
        status: 'success',
        message: "Registration successful",
        data: result,
    });
});




const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const result = await user.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
        return next(new AppError('Authentication failed', 401));
    }

    const token = generateToken({
        id: result.userId,
    });

    const userDetail = {
        userId: result.userId,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        
    };

    return res.json({
        status: 'success',
        message: 'Login successful',
        token,
        user: {
            ...userDetail,
        }
    });
});


const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
    let idToken = '';
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Bearer asfdasdfhjasdflkkasdf
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }
    // 2. token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    // 3. get the user detail from db and add to req object
    const freshUser = await user.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
});


/*
const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(
                new AppError(
                    "You don't have permission to perform this action",
                    403
                )
            );
        }
        return next();
    };

    return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo };
*/

module.exports = { signup, login, authentication };