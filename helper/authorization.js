const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' || !req.user.approved) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
};

const isUserApproved = (req, res, next) => {
    if (req.user.role === 'user' && !req.user.approved) {
        return res.status(403).json({ success: false, message: 'User not approved' });
    }
    next();
};

module.exports = { isSuperAdmin, isAdmin, isUserApproved };
