const path = require('path');
const User = require('../schemas/User');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendFile(path.join(__dirname, '..', 'public', 'logoutComplete.html'));
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken} ).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendFile(path.join(__dirname, '..', 'public', 'logoutComplete.html'));
    }

    // Delete refreshToken in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendFile(path.join(__dirname, '..', 'public', 'logoutComplete.html'));
}

module.exports = { handleLogout }