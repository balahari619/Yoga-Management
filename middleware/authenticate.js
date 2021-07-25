const jwt = require('jsonwebtoken')


const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.PRIVATE_KEY)

        req.user = decode
        next()
    }
    catch(error) {
        res.json({
            message : "Authentication failed !!!"
        })
    }
}


const authorize = (Permissions) => {
    return (req, res, next) => {
        const decoded = jwt.decode(req.headers.authorization.split(' ')[1], process.env.PRIVATE_KEY)
        const userRole = decoded.role;
        if(Permissions==userRole) {
            next()
        } else {
            return res.status(401).json({
                message : "Not authorized to access !!!"
            })
        }
    }
}


module.exports = { authenticate, authorize }