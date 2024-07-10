// require('dotenv').config({ path: `${process.cwd()}/.env` });
const dotenv = require('dotenv')
const express = require('express');

const authRouter = require('./route/authRoute');
const organisationRouter = require('./route/organisationRoute');
const userRouter = require('./route/userRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

dotenv.config({ path: '.env' });
const app = express();
console.log(process.env.POSTGRES_URL)

app.use(express.json());

// all routes will be here
app.use('/auth', authRouter);
app.use('/api/organisations', organisationRouter);
app.use('/api/users', userRouter);

app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log('Server up and running', PORT);
});