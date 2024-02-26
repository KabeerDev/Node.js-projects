const { user, comparePassword } = require("../model/user");
const { generateToken } = require("../jwt");
const bcrypt = require("bcrypt");

function validateCNIC(cnic) {
    // Remove dashes or spaces if present
    const cleanedCNIC = cnic.replace(/[-\s]/g, '');

    // Check if CNIC is a 13-digit number
    if (!/^\d{13}$/.test(cleanedCNIC)) {
        return false;
    }

    // Extract family number, individual number, and check digit
    const familyNumber = cleanedCNIC.substring(0, 5);
    const individualNumber = cleanedCNIC.substring(5, 12);
    const checkDigit = cleanedCNIC.substring(12);

    // Check the validity of the check digit
    const calculatedCheckDigit = calculateCheckDigit(familyNumber, individualNumber);
    return checkDigit === calculatedCheckDigit;
}

function calculateCheckDigit(familyNumber, individualNumber) {
    const combinedNumber = familyNumber + individualNumber;
    const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    let sum = 0;
    for (let i = 0; i < combinedNumber.length; i++) {
        sum += parseInt(combinedNumber[i]) * weights[i];
    }

    const remainder = sum % 10;
    const result = (remainder === 0) ? 0 : (10 - remainder);
    return result.toString();
}

async function handleSignup(req, res) {
    try {
        const data = req.body;

        if (!data.name || !data.age || !data.address || !data.naIdCardNo || !data.password) {
            return res.render("signup", { error: "Please fill all the mandatory feilds!" });
        }

        const isValid = await validateCNIC(data.naIdCardNo);

        if (!isValid) return res.render("signup", { error: "Invalid CNIC" })


        if (data.password.length > 12 || data.password.length < 4) {
            return res.render("signup", { error: "Password must contain 4 to 12 characters!" });
        }

        if (req.file) {
            data.p_img = req.file.filename;
        } else {
            data.p_img = "default.png";
        }

        const newUser = new user(data);
        const response = await newUser.save();

        const payload = {
            id: response.id,
        };
        const token = await generateToken(payload);

        return res.cookie("token", token).redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Intenal server error" });
    }
}

async function handleLogin(req, res) {
    try {
        const { naIdCardNo, password } = req.body;

        if (!naIdCardNo && !password) return res.render("login", { error: "Please fill all the feilds!" });

        const isValid = await validateCNIC(naIdCardNo);

        if (!isValid) return res.render("login", { error: "Invalid CNIC" })

        const userData = await user.findOne({ naIdCardNo: naIdCardNo });

        if (!userData) return res.render("login", { error: "User do not exist!" });

        const passMatched = await comparePassword(password, userData.password);

        if (passMatched == false) return res.render("login", { error: "Incorrect Password!" });

        const payload = {
            id: userData.id,
        };
        const token = await generateToken(payload);

        return res.cookie("token", token).redirect("/");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Intenal server error" });
    }
}

async function handleLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/login");
}

async function changePass(req, res) {
    try {
        const { password_old, password, userId } = req.body;

        const userData = await user.findById(userId);

        if (!password_old && !password) return res.render("changePassword", { error: "Please fill all the feilds!" });

        const passMatched = await comparePassword(password_old, userData.password);

        if (passMatched == false) return res.render("changePassword", { error: "Incorrect Password!", userData });

        const new_passMatched = await comparePassword(password, userData.password);

        if (new_passMatched == true) return res.render("changePassword", { error: "Please select a new password!", userData });

        if (password.length > 12 || password.length < 4) {
            return res.render("changePassword", { error: "Password must contain 4 to 12 characters!", userData });
        }
        const salt = await bcrypt.genSalt(12);
        const h_pass = await bcrypt.hash(password, salt);

        const updatedData = await user.findByIdAndUpdate(userData._id, { password: h_pass });

        if (!updatedData) return res.render("changePassword", { error: "something went wrong. Try again!", userData });

        res.clearCookie("token");

        return res.redirect("/login");
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Intenal server error" });
    }
}

module.exports = { handleSignup, handleLogin, handleLogout, changePass };