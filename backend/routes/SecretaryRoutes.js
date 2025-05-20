const express = require("express");
const router = express.Router();
const {registerSecretary,loginSecretary,getSecretaryById,sendPasswordResetCode,resetPassword} = require("../controllers/SecretaryController");

router.post("/register", registerSecretary);
router.post("/login", loginSecretary);
router.get("/secretaries/:id", getSecretaryById);
router.post("/forgot-password", sendPasswordResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;