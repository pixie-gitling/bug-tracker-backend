const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const comparePassword = async (password, hashPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization || '' // Fallback to empty string if no token provided

//     // Static token for development environment
//     // const staticToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtpcmFuIiwiaWQiOiI2NjBmZGUzMzdlOWVkOGE5YjVjYmI1ZDUiLCJuYW1lIjoiS2lyYW5kZWVwIiwiaWF0IjoxNzEyOTAxNjU4fQ.ZSsjZud_O5ebLq3LjNg1zMfamOflQA6atzNnBEVspsA"

//     // if (!token && process.env.NODE_ENV === 'development') {
//     //     // In development environment, use static token
//     //     req.user = jwt.verify(staticToken, SECRET_KEY)
//     //     next()
//     // } else 
//     {
//         // In other environments, verify token as usual
//         jwt.verify(token, SECRET_KEY, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: 'Unauthorized: Invalid token!!!' })
//             }
//             req.user = decoded
//             next()
//         })
//     }
// }

module.exports = { hashPassword, comparePassword }