const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const logger = require('_helpers/logger');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    logger.info({message: username + ' is trying to log in'})
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ 
            sub: user.id, 
            userGroups: user.userGroups, 
            company: user.company, 
            username: user.username, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            userId: user._id }, process.env.SECRET, {
            expiresIn: '12h',
       });
        return {
            ...userWithoutHash,
            token: 'Bearer ' + token
        };
    }
}

async function getAll(token) {
    const decoded = jwt.decode(token)
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        logger.error('User creating failed - ' + 'Username "' + userParam.username + '" is already taken')
        throw {message: 'Username "' + userParam.username + '" is already taken', code: 1000};
    }

    logger.info({message: 'Creating new user ' + userParam.username})

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    logger.info({ message: 'Updating user ' + userParam.username })

    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw {message: 'Username "' + userParam.username + '" is already taken', code: 1000};
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await User.updateOne({ "_id": id }, { $set: userParam })
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
