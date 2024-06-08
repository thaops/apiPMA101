const { json } = require("express");
const User = require("./UserModel");
const bcrypt = require('bcryptjs');

const login = async (email, password) => {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return user;
            }
        } else {
            return { error: `Email hoặc mật khẩu sai` };
        }
    } catch (error) {
        console.log("user bug >> " + error);
        return error
    }
}

const register = async (email, password, name, phone) => {
    try {
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return { error: 'Email đã được đăng ký' };
        }

        let bcryptPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            name: name,
            email: email,
            password: bcryptPassword,
            phone: phone
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        console.log("user bug >> " + error);
        return error
    }
}

const changePassword = async (email, password, newPassword) => {
    try {
        const userFind = await User.findOne({ email: email });
        if (userFind) {
            const isMatch = await bcrypt.compare(password, userFind.password);

            if (isMatch) {
                const bcryptPassword = await bcrypt.hash(newPassword, 10);
                userFind.password = bcryptPassword;
                await userFind.save();
                return userFind;
            } else {
                return { error: 'Sai mật khẩu!' };
            }

        } else {
            return { error: `Không thể tìm thấy ${email}` };
        }
    } catch (error) {
        console.log("user bug >> " + error);
    }
}




module.exports = {
    login,
    register,
    changePassword
}
