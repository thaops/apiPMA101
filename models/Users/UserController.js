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
async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email }).exec();
        return user;
    } catch (error) {
        console.error('Error while fetching user by email:', error);
        throw error;
    }
}

const resetPassword = async (email, newPassword) => {
    try {
        // Tìm người dùng dựa trên email
        const user = await User.findOne({ email: email });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return { error: 'Không tìm thấy người dùng với email này' };
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới cho người dùng
        user.password = hashedPassword;

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        // Trả về thông báo thành công
        return { success: true, message: 'Mật khẩu đã được đặt lại thành công' };
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        return { error: 'Đã xảy ra lỗi khi đặt lại mật khẩu' };
    }
};


module.exports = {
    login,
    register,
    changePassword,
    getUserByEmail,
    resetPassword
}
