
const isloggedIn = (req, res, next) => {
  if(req.session.activarUsuario === undefined) {
    res.redirect("/registro/acceso")
  } else{
    next()
  }
}

module.exports = {
  isloggedIn
}