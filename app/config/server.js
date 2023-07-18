const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
var sha256 = require('js-sha256')
var AWS = require('aws-sdk')
const s3key = require('./S3Keys')

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

app.post('/sendPhoto', (req, res) => {
  const photoName = req.body.photoName

  var s3 = new AWS.S3({
    accessKeyId: s3key.accessKeyID,
    secretAccessKey: s3key.secretAccessKey,
    region: 'sa-east-1',
  })

  var params = {
    Bucket: 'bicho-na-pista-bucket',
    Key: 'images/' + photoName + '.jpg',
    ContentType: 'image/jpeg',
  }
  s3.getSignedUrl('putObject', params, function (err, url) {
    res.send({ link: url })
  })
})

app.post('/occurrence', (req, res) => {
  const occurrence = req.body.occurrence
  const date = req.body.date
  const time = req.body.time
  const type = req.body.type
  const city = req.body.city
  const street = req.body.street
  const user = req.body.user
  const monitoring = req.body.monitoring
  const occuStatus = req.body.occuStatus

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT CodMunicipio FROM municipio WHERE NomeMunicipio = ?',
        [city],
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
            var county
            if (result.length == 0) {
              county = null
            } else {
              county = result[0].CodMunicipio
            }

            connection.query(
              'SELECT CodRodovia FROM rodovia WHERE NomeRodovia = ?',
              [street],
              (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  var highway
                  if (result.length == 0) {
                    highway = null
                  } else {
                    highway = result[0].CodRodovia
                  }

                  connection.query(
                    'INSERT INTO ocorrencia (Especie, NomeComumNaoCadastrado, NomeCientificoNaoCadastrado, GrupoTaxonomico, NumeroIndividuos, Foto1, Foto2, Foto3, DataRegistro, HoraRegistro, TipoRegistro, Sexo, CondicaoAnimal, AnimalVivo, Causa, InstituicaoDepositaria, Latitude, Longitude, Endereco, AnimalEmUC, Municipio, Rodovia, Sentido, Km, TipoVia, TipoPavimento, NumPistas, NumFaixas, VelocidadeMax, Intervencao, DescrIntervencao, Vazamento, DescrVazamento, EncontradoEm, CondicaoTempo, LagoRioRiacho, Observacoes, Usuario, Monitoramento, STATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      occurrence.especie,
                      occurrence.nome_comum_nao_cadastrado,
                      occurrence.nome_cientifico_nao_cadastrado,
                      occurrence.grupo_taxonomico,
                      occurrence.n_individuos,
                      occurrence.photo1,
                      occurrence.photo2,
                      occurrence.photo3,
                      date,
                      time,
                      type,
                      occurrence.sexo,
                      occurrence.condicao_animal,
                      occurrence.animal_vivo,
                      occurrence.causa,
                      occurrence.instituicao_depositaria,
                      occurrence.latitude,
                      occurrence.longitude,
                      occurrence.local,
                      occurrence.animal_em_uc,
                      county,
                      highway,
                      occurrence.sentido_da_via,
                      occurrence.km,
                      occurrence.tipo_de_via,
                      occurrence.tipo_de_pavimento,
                      occurrence.n_pistas,
                      occurrence.n_faixas,
                      occurrence.velocidade_max_permitida,
                      occurrence.trecho_com_intervencao,
                      occurrence.descr_intervencao,
                      occurrence.vazamento_na_pista,
                      occurrence.descr_vazamento,
                      occurrence.encontrado_em,
                      occurrence.condicoes_do_tempo,
                      occurrence.lago_rio_riacho,
                      occurrence.observacoes,
                      user,
                      monitoring,
                      occuStatus,
                    ],
                    (error, response) => {
                      if (err) {
                        console.log(err)
                      } else {
                        connection.query(
                          'SELECT LAST_INSERT_ID()',
                          (error, results) => {
                            if (err) {
                              console.log(err)
                            } else {
                              const occuID = results[0]['LAST_INSERT_ID()']

                              if (occurrence.destinacao.length > 0) {
                                occurrence.destinacao.map((CodDest) => {
                                  connection.query(
                                    'INSERT INTO destinoanimalocorrencia (Ocorrencia, DestinoAnimal) VALUES (?, ?)',
                                    [occuID, CodDest],
                                    (error, response) => {
                                      if (err) {
                                        console.log(err)
                                      }
                                    }
                                  )
                                })
                              }
                              if (occurrence.tipo_de_divisao.length > 0) {
                                occurrence.tipo_de_divisao.map((CodDiv) => {
                                  connection.query(
                                    'INSERT INTO divisaopistasocorrencia (Ocorrencia, TipoDivisãoPistas) VALUES (?, ?)',
                                    [occuID, CodDiv],
                                    (error, response) => {
                                      if (err) {
                                        console.log(err)
                                      }
                                    }
                                  )
                                })
                              }
                              if (occurrence.vegetacao_entorno.length > 0) {
                                occurrence.vegetacao_entorno.map((CodVeg) => {
                                  connection.query(
                                    'INSERT INTO vegetacaoentornoocorrencia (Ocorrencia, VegetacaoEntorno) VALUES (?, ?)',
                                    [occuID, CodVeg],
                                    (error, response) => {
                                      if (err) {
                                        console.log(err)
                                      }
                                    }
                                  )
                                })
                              }
                              res.send({ resp: 'Envio realizado' })
                            }
                          }
                        )
                      }
                    }
                  )
                }
              }
            )
          }
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/formaMonitoramento', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM formamonitoramento',
        (error, results, fields) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/monitoring', (req, res) => {
  const latitudeI = req.body.latitudeI
  const longitudeI = req.body.longitudeI
  const latitudeF = req.body.latitudeF
  const longitudeF = req.body.longitudeF
  const iDate = req.body.iDate
  const fDate = req.body.fDate
  const iTime = req.body.iTime
  const fTime = req.body.fTime
  const user = req.body.user
  const nPeople = req.body.nPeople
  const monitoring = req.body.monitoring
  const speed = req.body.speed
  const descr = req.body.descr

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'INSERT INTO monitoramento (LatitudeInicial, LongitudeInicial, LatitudeFinal, LongitudeFinal, DataInicial, DataFinal, HoraInicial, HoraFinal, Usuario, NumPessoasMonitorando, FormaMonitoramento, VelocidadeMonitoramento, DescrMonitoramento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [latitudeI, longitudeI, latitudeF, longitudeF, iDate, fDate, iTime, fTime, user, nPeople, monitoring, speed, descr],
        (error, response) => {
          if (err) {
            console.log(err)
          } else {
            connection.query('SELECT LAST_INSERT_ID()', (error, results) => {
              if (err) {
                console.log(err)
              } else {
                res.send({ ID: results[0]['LAST_INSERT_ID()'] })
              }
            })
          }
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
  console.log('Rodando em http://localhost:3000/ ! \n\n\n')
})
