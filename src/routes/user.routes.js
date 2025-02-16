const router = require("express").Router();
const UserController = require("../controller/user.controller");
const { verifyAccessToken, verifyRole } = require("../middleware/auth.middleware");


router.get(
    "/user",
    verifyAccessToken,
    UserController.user
);

router.get(
    "/users/all",
    verifyAccessToken,
    verifyRole(["ADMIN", "DHOBI"]),
    UserController.getAllUsers
);

router.get(
    "/users/:id",
    verifyAccessToken,
    verifyRole(["ADMIN", "DHOBI"]),
    UserController.getUserById
);

router.put(
    "/users/update/:id",
    verifyAccessToken,
    verifyRole(["ADMIN"]),
    UserController.updateUserById,
);

router.get(
    "/dhobis/all",
    verifyAccessToken,
    verifyRole(["ADMIN"]),
    UserController.getAllDhobis
);

router.get(
    "/dhobis/:id",
    verifyAccessToken,
    verifyRole(["ADMIN"]),
    UserController.getDhobiById
);

router.put(
    "/DHOBIs/update/:id",
    verifyAccessToken,
    verifyRole(["ADMIN"]),
    UserController.updateDhobiById
);

router.get(
    "/DHOBIs/:id/users/all",
    verifyAccessToken,
    verifyRole(["ADMIN", "DHOBI"]),
    UserController.getUsersByDhobi
);

router.put(
    "/verify-dhobi-account",
    verifyAccessToken,
    verifyRole(["ADMIN"]),
    UserController.verifyDhobiAccount
);

module.exports = router;
