import admin from '../firebase/index.js';
import User from '../models/user.js';

export const authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (err) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

export const adminCheck = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role_id !== 1) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
