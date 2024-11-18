import { user } from "../model/user.js";

export const authMiddleware = (req, res, next) => {
  const ip = req.clientIp;

  user
    .findOne({ ip: ip })
    .then((userData) => {
      if (userData) {
        req.user = userData;
        req.auth = "noauth";
        return next();
      }

      const newUser = new user({
        ip: ip,
        location: "Yerevan", //in the feature will be nice also to add location
      });

      return newUser
        .save()
        .then(() => {
          return user.findOne({ ip: ip });
        })
        .then((userData) => {
          if (!userData) {
            const error = new Error("User not found");
            error.statusCode = 403;
            throw error;
          }
          req.user = userData;
          req.auth = "noauth";
          return next();
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
