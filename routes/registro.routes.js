const express = require("express")
const router = express.Router()
const User = require("../models/User.model.js")
const bcrypt = require('bcryptjs')

// vamos a crear una ruta get para renderizar el formulario para inscribirse
router.get("/inscribirse",  (req, res, next) => {
  res.render("registro/inscribirse.hbs")
})

// vamos a crear un ruta post para recibir la info del formulario y crear el perfil en la data base
router.post("/inscribirse", async (req, res, next) => {
  const {username, password} = req.body
  console.log(req.body)
  //1. validacion del backend
  if(username === "" || password === ""){ // .todos los campos deben de estar llenos
    res.render("registro/inscribirse.hbs", {
      mensajeError: "Debes de rellenar todos los campos"
    })
    return;
  }

  //validamos la fuerza de la contraseña
  const contraseñaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

  if(contraseñaRegex.test(password) ===false){ 
    res.render("registro/inscribirse.hbs", {
      mensajeError: "La contraseña debe tener minimo 8 caracteres, una mayuscula y un número"
    })
    return;
  }

  try { // validación de que el usuario sea unico, no esté actualmente en la DB
    const encontrarUsuario = await User.findOne({username: username})
    console.log(encontrarUsuario)
    if(encontrarUsuario !== null) {
      // si existe en la DB
      res.render("registro/inscribirse.hbs", {
        mensajeError: "Usuario ya ha creado con ese nombre"
      })
      return;
    }
    //2. elementos de seguridad
    const salt = await bcrypt.genSalt(12)
    const hashContraseña = await bcrypt.hash(password, salt) //genero contraseña cifrada
    //3. crear el pefil
    const nuevoUsuario = {
      username: username,
      password: hashContraseña
    }
    await User.create(nuevoUsuario)



    res.redirect("/")

  } catch (error) {
    next(error)
  }
})

// vamos a crear una ruta get para renderizar el formulario para acceder
router.get("/acceso", (req, res, next) => {
  res.render("registro/acceso.hbs")
})

// vamos a crear una rut post para recibir las credenciales y validar
router.post("/acceso", async (req, res, next) => {
  const {username, password} = req.body
  console.log(req.body)

  //1. validaciones del backend
  if(username === "" || password === ""){
    res.render("registro/acceso.hbs", {
      errorMensaje: "Los campos deben de estar completos"
    })
    return
  }

  try {
    const encontrarUsuario = await User.findOne({username: username})
    if(encontrarUsuario === null){
      res.render("registro/acceso.hbs", {
        errorMensaje: "Credenciales incorrectas"
      })
      return
    }

    //2. verificar la contraseña del usuario(validar)
    const isContraseñaValida = await bcrypt.compare(password, encontrarUsuario.password)
    console.log(`Es contraseña valida: ${isContraseñaValida}`)
    if(isContraseñaValida === false) {
      res.render("registro/acceso.hbs", {
        errorMensaje: "Credenciales incorrectas"
      })
      return
    }

    // 3. IMPLEMENTAR un sistema de sesiones y abrir una sesion para este usuario
    req.session.activarUsuario = encontrarUsuario

    req.session.save(() => {
      res.redirect("/perfil")
    })


  } catch (error) {
    next(error)
  }
})

router.get("/cerrarsesion", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/")
  })
})







module.exports = router