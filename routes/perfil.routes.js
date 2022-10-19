const express = require("express")
const router = express.Router()
const User = require("../models/User.model.js")

const {isloggedIn} = require("../middlewares/registro.js")

router.get("/", isloggedIn, (req, res, next) => {
  
  console.log("Usuario que hace la soli:", req.session.activarUsuario)

  User.findById(req.session.activarUsuario._id)
  .then((response) => {
    res.render("perfil/mi-perfil.hbs", {
      usuarioDetalles: response
    })
  })
  .catch((err) => {
    next(err)
  })
})


module.exports = router