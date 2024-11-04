const User = require('../schemas/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd, pwdConfirm } = req.body;
    if (!user || !pwd || !pwdConfirm) {
        return res.status(400).json({ 'message': '닉네임, 비밀번호, 비밀번호 확인이 필요합니다.' });
    }
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    
    if (!usernameRegex.test(user)) {
        return res.status(400).json({ 'message': '닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성되어야 합니다.' });
    }
    if (user.toLowerCase() === 'all'){
        return res.status(400).json({ 'message': 'all은 닉네임으로 사용할 수 없습니다.'})
    }
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.status(409).json({ 'message': '중복된 닉네임입니다.' });

    if (pwd.length < 4) {
        return res.status(400).json({ 'message': '비밀번호는 최소 4자 이상이어야 합니다.' });
    }
    if (pwd.includes(user)) {
        return res.status(400).json({ 'message': '비밀번호에 닉네임과 같은 값이 포함될 수 없습니다.' });
    }
    if (pwd !== pwdConfirm) {
        return res.status(400).json({ 'message': '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);

        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        res.status(201).json({ 'success': `새로운 사용자 ${user}가 가입했습니다!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };