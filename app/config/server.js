const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
var sha256 = require('js-sha256')
var nodemailer = require('nodemailer')
var AWS = require('aws-sdk')
const s3key = require('./S3Keys')
const myEmail = require('./emailCredentials')

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

  if (req.body.password == '') {
    res.send({ loginFail: true, msg: 'Email ou senha incorreta !' })
  } else {
    connection.getConnection((err, connection) => {
      if (err) {
        console.log(
          'Ocorreu um erro ao tentar se conectar ao banco! Erro: ',
          err
        )
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
  }
})

app.post('/sendMail', (req, res) => {
  const email = req.body.email

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT NomeCompleto FROM usuario WHERE Email = ?',
        [email],
        (err, result) => {
          if (err) {
            res.send(err)
          }
          if (result.length > 0) {
            const nome = result[0].NomeCompleto.split(' ')

            var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: myEmail.email,
                pass: myEmail.password,
              },
            })

            transporter.sendMail({
              from: 'noreply@bichonapista.com',
              to: email,
              subject: 'Password Reset',
              html: '<html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>email</title> </head> <body> <div style="width: 100%; height: 100%; position: relative; background: #EDEDED; border-radius: 10px; overflow: hidden"> <div style="width: 759px; height: 425px; margin-left: 25%; margin-top: 3cm; margin-bottom: 5cm; padding-top: 40px; position: relative; background: white; border-radius: 20px"> <div style="margin-left: 5%; margin-bottom: 0px; position: relative; color: #262626; font-size: 22px; font-family: Source Sans Pro; font-weight: 400; word-wrap: break-word">Olá ' + nome[0] + ' ' + nome[nome.length - 1] + ',</div> <div style="margin-left: 5%; margin-bottom: 20px; position: relative; color: #8C8C8C; font-size: 22px; font-family: Source Sans Pro; font-weight: 400; word-wrap: break-word">Aqui está as instruções para redefinir sua senha.</div> <div style="width: 713px; height: 0px; margin-left: 23px; margin-bottom: 16px; position: relative; border: 0.50px #C4C4C4 solid"></div> <div style="width: 669px; margin-left: 5%; margin-bottom: 46px; position: relative; text-align: justify; color: #404040; font-size: 20px; font-family: Source Sans Pro; font-weight: 400; word-wrap: break-word">Foi realizada uma requisição para redefinir sua senha do app BichoNaPista. Se você não fez essa solicitação, ignore esse email. Se você fez essa solicitação, por favor redefina sua senha: </div> <a href="http://localhost:3000/resetPassword"> <button type="button" style="border:none; width: 185px; height: 52px; margin-left: 287px; margin-bottom: 46px; position: relative; background: #FFDE3B; border-radius: 5px"> <div style="left: 37px; top: 16px; color: #404040; font-size: 16px; font-family: Source Sans Pro; font-weight: 700; word-wrap: break-word">Redefinir senha</div> </button> </a> <div style="margin-left: 5%; margin-bottom: 0px; position: relative; color: #404040; font-size: 20px; font-family: Source Sans Pro; font-weight: 400; word-wrap: break-word">Atenciosamente,</div> <div style="margin-left: 5%; margin-bottom: 3cm; position: relative; color: #404040; font-size: 20px; font-family: Source Sans Pro; font-weight: 400; word-wrap: break-word">Time BichoNaPista</div> </div> </div> </body> </html>'
            })

            res.send({
              msg:
                'Um link para que possa redefinir sua senha foi enviado para o email: \n\n' +
                email,
            })
          } else {
            res.send({
              msg:
                'Não foi encontrado nenhuma conta com o endereço \n\n' + email,
            })
          }
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

//example page to reset password
app.use('/resetPassword', express.static('../emailPage'))

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
        [
          latitudeI,
          longitudeI,
          latitudeF,
          longitudeF,
          iDate,
          fDate,
          iTime,
          fTime,
          user,
          nPeople,
          monitoring,
          speed,
          descr,
        ],
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

app.post('/ranking', (req, res) => {
  const type = req.body.type

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT T1.CodUsuario, nome, NregMes, NregTot, RankResult FROM ( SELECT CodUsuario, NomeCompleto AS nome, count(o.CodOcorrencia) AS NregMes, RANK() OVER (ORDER BY count(o.CodOcorrencia) DESC ) AS RankResult FROM (SELECT * FROM ocorrencia WHERE MONTH(DataRegistro) = MONTH(NOW())) AS o RIGHT JOIN usuario AS u ON o.Usuario = u.CodUsuario WHERE u.Perfil = ? GROUP BY CodUsuario) AS T1 INNER JOIN ( SELECT CodUsuario, count(o.CodOcorrencia) AS NregTot FROM ocorrencia AS o RIGHT JOIN usuario AS u ON o.Usuario = u.CodUsuario WHERE u.Perfil = ? GROUP BY CodUsuario) AS T2 ON T1.CodUsuario = T2.CodUsuario LIMIT 10',
        [type, type],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/rankingPosition', (req, res) => {
  const type = req.body.type
  const user = req.body.user

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT * FROM (SELECT T1.CodUsuario, nome, NregMes, NregTot, RankResult FROM ( SELECT CodUsuario, NomeCompleto AS nome, count(o.CodOcorrencia) AS NregMes, RANK() OVER (ORDER BY count(o.CodOcorrencia) DESC ) AS RankResult FROM (SELECT * FROM ocorrencia WHERE MONTH(DataRegistro) = MONTH(NOW())) AS o RIGHT JOIN usuario AS u ON o.Usuario = u.CodUsuario WHERE u.Perfil = ? GROUP BY CodUsuario) AS T1 INNER JOIN ( SELECT CodUsuario, count(o.CodOcorrencia) AS NregTot FROM ocorrencia AS o RIGHT JOIN usuario AS u ON o.Usuario = u.CodUsuario WHERE u.Perfil = ? GROUP BY CodUsuario) AS T2 ON T1.CodUsuario = T2.CodUsuario) AS ranking WHERE ranking.CodUsuario = ?',
        [type, type, user],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.get('/lastrecords', function (req, res) {
  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT o.CodOcorrencia, o.Foto1, e.NomeComum, e.NomeCientifico, o.NomeComumNaoCadastrado, o.NomeCientificoNaoCadastrado, o.DataRegistro, o.HoraRegistro, g.NomeGrupoTax, o.CondicaoAnimal, o.Latitude, o.Longitude from ocorrencia AS o LEFT JOIN especie AS e ON o.Especie = e.CodEspecie LEFT JOIN grupotaxonomico AS g ON o.GrupoTaxonomico = g.CodGrupoTax ORDER BY o.CodOcorrencia DESC LIMIT 20',
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/getPhoto', (req, res) => {
  const photoName = req.body.photoName

  var s3 = new AWS.S3({
    accessKeyId: s3key.accessKeyID,
    secretAccessKey: s3key.secretAccessKey,
    region: 'sa-east-1',
  })

  var params = {
    Bucket: 'bicho-na-pista-bucket',
    Key: 'images/' + photoName,
  }
  s3.getSignedUrl('getObject', params, function (err, url) {
    res.send({ link: url })
  })
})

app.post('/toComplementRecords', (req, res) => {
  const user = req.body.user

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT o.CodOcorrencia, o.Especie, e.NomeComum, o.NomeComumNaoCadastrado, o.NomeCientificoNaoCadastrado, o.GrupoTaxonomico, o.NumeroIndividuos, o.Foto1, o.Foto2, o.Foto3, o.Sexo, o.CondicaoAnimal, o.AnimalVivo, o.Causa, o.InstituicaoDepositaria, o.Endereco, o.AnimalEmUC, o.Sentido, o.Km, o.TipoVia, o.TipoPavimento, o.NumPistas, o.NumFaixas, o.VelocidadeMax, o.Intervencao, o.DescrIntervencao, o.Vazamento, o.DescrVazamento, o.EncontradoEm, o.CondicaoTempo, o.LagoRioRiacho, o.Observacoes, o.STATUS, o.DataRegistro, o.HoraRegistro FROM ocorrencia AS o LEFT JOIN especie AS e ON o.Especie = e.CodEspecie WHERE usuario = ? AND (STATUS = "Em análise e a complementar" OR STATUS = "Validado e a complementar") ORDER BY o.CodOcorrencia DESC',
        [user],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/destinationRecords', (req, res) => {
  const ID = req.body.recordID

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT DestinoAnimal FROM destinoanimalocorrencia WHERE Ocorrencia = ?',
        [ID],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/divRRecords', (req, res) => {
  const ID = req.body.recordID

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT TipoDivisãoPistas FROM divisaopistasocorrencia WHERE Ocorrencia = ?',
        [ID],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/vegRecords', (req, res) => {
  const ID = req.body.recordID

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT VegetacaoEntorno FROM vegetacaoentornoocorrencia WHERE Ocorrencia = ?',
        [ID],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/myRecords', (req, res) => {
  const user = req.body.user

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'SELECT o.CodOcorrencia, o.Especie, e.NomeComum, o.NomeComumNaoCadastrado, o.NomeCientificoNaoCadastrado, o.GrupoTaxonomico, o.NumeroIndividuos, o.Foto1, o.Foto2, o.Foto3, o.Sexo, o.CondicaoAnimal, o.AnimalVivo, o.Causa, o.InstituicaoDepositaria, o.Endereco, o.AnimalEmUC, o.Sentido, o.Km, o.TipoVia, o.TipoPavimento, o.NumPistas, o.NumFaixas, o.VelocidadeMax, o.Intervencao, o.DescrIntervencao, o.Vazamento, o.DescrVazamento, o.EncontradoEm, o.CondicaoTempo, o.LagoRioRiacho, o.Observacoes, o.STATUS, o.DataRegistro, o.HoraRegistro FROM ocorrencia AS o LEFT JOIN especie AS e ON o.Especie = e.CodEspecie WHERE usuario = ? ORDER BY o.CodOcorrencia DESC',
        [user],
        (error, results) => {
          res.send(results)
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

app.post('/upload', (req, res) => {
  const id = req.body.id
  const destinacao = req.body.destinacao
  const status = req.body.status

  connection.getConnection((err, connection) => {
    if (err) {
      console.log('Ocorreu um erro ao tentar se conectar ao banco! Erro: ', err)
    } else {
      connection.query(
        'DELETE FROM destinoanimalocorrencia WHERE Ocorrencia = ?',
        [id],
        (error, results) => {
          if (destinacao.length > 0) {
            destinacao.map((CodDest) => {
              connection.query(
                'INSERT INTO destinoanimalocorrencia (Ocorrencia, DestinoAnimal) VALUES (?, ?)',
                [id, CodDest],
                (err, response) => {
                  if (err) {
                    console.log(err)
                  }
                }
              )
            })
          }
          connection.query(
            'UPDATE ocorrencia SET STATUS = ? WHERE CodOcorrencia = ?',
            [status, id],
            (err, response) => {
              res.send()
              if (err) {
                console.log(err)
              }
            }
          )
        }
      )
    }
    if (connection) connection.release()
    return
  })
})

// Iniciando o servidor.
app.listen(3000, () => {
  console.log('Rodando em http://localhost:3000/ ! \n\n\n')
})
