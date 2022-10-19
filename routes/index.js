const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const profileRoutes = require("./perfil.routes")
router.use("/perfil", profileRoutes)

const authRoutes = require("./registro.routes")
router.use("/registro", authRoutes)

module.exports = router;
