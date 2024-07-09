const { Sequelize } = require('sequelize');
const User = require('../db/models/user');
const Organisation = require('../db/models/organisation');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { v4: uuidv4 } = require('uuid');

const getAllOrganisations1 = catchAsync(async (req, res, next) => {
    const organisations = await Organisation.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps if not needed
    });

    if (!organisations || organisations.length === 0) {
        return next(new AppError('No organisations found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: organisations,
    });
});




const getAllOrganisations = catchAsync(async (req, res, next) => {
    // Retrieve organisations associated with the authenticated user
    const organisations = await Organisation.findAll({
        include: [
            {
                model: User,
                attributes: [], // Specify fields you want from User model
                where: { userId: req.user.userId }, // Assuming req.user.userId is attached by authentication middleware
                through: { attributes: [] }, // To exclude association attributes if any
            },
        ],
        attributes: ['orgId', 'name', 'description'], // Specify fields you want from Organisation model
        // attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps if not needed
    });

    if (!organisations || organisations.length === 0) {
        return next(new AppError('No organisations found', 404));
    }

    return res.status(200).json({
        status: 'success',
        message: 'Successful',
        data: {
            organisations: organisations
        }
    });
});





const getOrganisationById1 = catchAsync(async (req, res, next) => {
    const orgId  = req.params.Id; // Assuming orgId is passed as a route parameter

    

    const organisation = await Organisation.findOne({
        where: { orgId: orgId }, // Specify the condition
        attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps if not needed
    });

    if (!organisation) {
        return next(new AppError('Organisation not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: organisation,
    });
});



const getOrganisationById = catchAsync(async (req, res, next) => {
    const organisationId = req.params.Id; // Assuming organisationId is passed as a route parameter

    // Retrieve organisation associated with the authenticated user and with the specified organisationId
    const organisation = await Organisation.findOne({
        where: {
            orgId: organisationId,
        },
        include: [
            {
                model: User,
                attributes: [],
                where: { userId: req.user.userId }, // Ensure the authenticated user is the creator
                through: { attributes: [] }, // To exclude association attributes if any
            },
        ],
        attributes: ['orgId', 'name', 'description'],
        // attributes: { exclude: ['createdAt', 'updatedAt'] }, // Exclude timestamps if not needed
    });

    if (!organisation) {
        return next(new AppError('Organisation not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        message: 'request successful',
        data: organisation,
    });
});




const createOrganisation = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;

    // Validate request body
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return next(new AppError('Name is required and cannot be null', 400));
    }

    // Create new organisation
    const newOrganisation = await Organisation.create({
        orgId: uuidv4(), // Generate orgId (you can use uuid or any other method)
        name: name.trim(),
        description: description || '',
    });

    if (!newOrganisation) {
        return next(new AppError('Bad Request', 400));
    }

    // Construct response payload
    const responseData = {
        orgId: newOrganisation.orgId,
        name: newOrganisation.name,
        description: newOrganisation.description,
    };

    return res.status(201).json({
        status: 'success',
        message: 'Organisation created successfully',
        data: responseData,
    });
});




// POST /api/organisations/:orgId/users
const addUserToOrg = catchAsync(async (req, res, next) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    console.log('orgId: ',orgId)
    console.log('userId: ', userId)

    // Validate request body
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return next(new AppError('Invalid userId in request body', 400));
    }

    // Find the organisation by orgId
    const organisation = await Organisation.findByPk(orgId);
    if (!organisation) {
        return next(new AppError('Organisation not found', 404));
    }

    // Find the user by userId
    const user = await User.findByPk(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Add the user to the organisation
    await organisation.addUser(user);

    // Send success response
    return res.status(200).json({
        status: 'success',
        message: 'User added to organisation successfully',
    });
});






module.exports = {getAllOrganisations, getOrganisationById, createOrganisation, addUserToOrg}