const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
var sha256 = require('js-sha256')

// Database connection
const connection = mysql.createPool({
  host: 'bicho-na-pista.cvqbdffimake.sa-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'mysecret',
  database: 'bicho_na_pista',
})

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.post('/register', (req, res) => {
  var hash = sha256.create()

  hash.update(req.body.password)
  const passwordHash = hash.hex()
  const email = req.body.email
  const name = req.body.fullName
  const phone = req.body.phone

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM usuario WHERE Email = ?',
        [email],
        (err, result) => {
          if (err) {
            res.send(err)
          }
          if (result.length == 0) {
            connection.query(
              'INSERT INTO usuario (Email, Senha, NomeCompleto, Telefone, Perfil) VALUES (?,?,?,?,2)',
              [email, passwordHash, name, phone],
              (error, response) => {
                if (err) {
                  res.send(err)
                }
                res.send({
                  Added: true,
                  msg: 'Usuário cadastrado com sucesso.', // Verifique seu endereço de email para fazer login.
                })
              }
            )
          } else {
            res.send({ Added: false, msg: 'Esse email já está em uso.' })
          }
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/login', (req, res) => {
  var hash = sha256.create()

  hash.update(req.body.password)
  const passwordHash = hash.hex()
  const email = req.body.email

  console.log(email)

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT CodUsuario, NomeCompleto, Perfil FROM usuario WHERE Email = ? AND Senha = ?',
        [email, passwordHash],
        (err, result) => {
          if (err) {
            res.send(err)
          }
          if (result.length > 0) {
            res.send({ loginFail: false, result })
          } else {
            res.send({ loginFail: true, msg: 'Email ou senha incorreta !' })
          }
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/grupoTax', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM grupotaxonomico',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/especie', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query('SELECT * FROM especie', (error, results, fields) => {
        res.send(results)
      })
    }
    if (connection) connection.release()
    return
  })
})

app.get('/destinoAnimal', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM destinoanimal',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/instituDepositaria', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM instituicaodepositaria',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/sentido', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query('SELECT * FROM sentido', (error, results, fields) => {
        res.send(results)
      })
    }
    if (connection) connection.release()
    return
  })
})

app.get('/divPistas', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM tipodivisaopistas',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/pavimento', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM tipopavimento',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/vegetacao', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM vegetacaoentorno',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/encontradoEm', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM encontradoem',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

//ultmos registro

//Meus regstros

//registros a complementar

//ranking

// Iniciando o servidor.
app.listen(3000, () => {
  console.log('Rodando em http://localhost:3000/ !')
})
