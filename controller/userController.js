const { Sequelize } = require('sequelize');
const User = require('../db/models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.findAndCountAll({
        // where: {
        //     userType: {
        //         [Sequelize.Op.ne]: '0',
        //     },
        // },
        attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});


// const getUser = catchAsync(async (req, res, next) => {
//     const user = await user.findById(req.params.id);
//     //Country.findOne({_id: req.params.id})
  
//     if (!getUser) {
//       return next(new AppError('No user found with that ID', 404));
//     }
  
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user,
//       },
//     });
//   });



  const getUserById1 = catchAsync(async (req, res, next) => {
    const userId  = req.params.Id; // Assuming userId is passed as a route parameter
    console.log('req.params: ', req.params)
    console.log('req.params.id:  ', req.params.Id)

    const user = await User.findOne({
        where: { userId: userId }, // Specify the condition
        attributes: { exclude: ['password'] },
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: user,
    });
});
 




const getUserById = catchAsync(async (req, res, next) => {
    const requestedUserId = req.params.Id; // Assuming userId is passed as a route parameter
    // console.log(requestedUserId)
    // console.log(req.User.userId)
    console.log(req.user.userId)

    // Check if the authenticated user's ID matches the requested user's ID
    if (req.user.userId !== requestedUserId) {
        return next(new AppError('You are not authorized to access this user', 403));
    }

    const user = await User.findOne({
        where: { userId: requestedUserId }, // Fetch user based on requested userId
        attributes: { exclude: ['password'] }, // Exclude sensitive fields
    });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: user,
    });
});

// module.exports = getUserById;


module.exports = { getAllUser, getUserById };