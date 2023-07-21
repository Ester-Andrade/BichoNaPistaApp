import PcIP from '../../config/MyPcIp'

const getData = async (userID, setData) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 30000)

  try {
    await fetch('http://' + PcIP + ':3000/myRecords', {
      method: 'POST',
      body: JSON.stringify({
        user: userID,
      }),
      headers: {
        'Content-type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then(async (body) => {
        const complRecords = body
        for (let record of complRecords) {
          //Foto1
          await fetch('http://' + PcIP + ':3000/getPhoto', {
            method: 'POST',
            body: JSON.stringify({
              photoName: record.Foto1.split('/')[4],
            }),
            headers: {
              'Content-type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((body) => {
              record.Foto1 = body.link
            })
          //Foto2
          if (record.Foto2 != null) {
            await fetch('http://' + PcIP + ':3000/getPhoto', {
              method: 'POST',
              body: JSON.stringify({
                photoName: record.Foto2.split('/')[4],
              }),
              headers: {
                'Content-type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then((body) => {
                record.Foto2 = body.link
              })
          }
          // //Foto3
          if (record.Foto3 != null) {
            await fetch('http://' + PcIP + ':3000/getPhoto', {
              method: 'POST',
              body: JSON.stringify({
                photoName: record.Foto3.split('/')[4],
              }),
              headers: {
                'Content-type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then((body) => {
                record.Foto3 = body.link
              })
          }
          //Destination
          await fetch('http://' + PcIP + ':3000/destinationRecords', {
            method: 'POST',
            body: JSON.stringify({
              recordID: record.CodOcorrencia,
            }),
            headers: {
              'Content-type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((body) => {
              if (body.length != 0) {
                const dests = []
                for (let dest of body) {
                  dests.push(dest.DestinoAnimal)
                }
                record.destinacao = dests
              } else {
                record.destinacao = []
              }
            })
          //Road division
          await fetch('http://' + PcIP + ':3000/divRRecords', {
            method: 'POST',
            body: JSON.stringify({
              recordID: record.CodOcorrencia,
            }),
            headers: {
              'Content-type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((body) => {
              if (body.length != 0) {
                const divs = []
                for (let div of body) {
                  divs.push(div.TipoDivisãoPistas)
                }
                record.divPista = divs
              } else {
                record.divPista = []
              }
            })
          //Surrounding vegetation
          await fetch('http://' + PcIP + ':3000/vegRecords', {
            method: 'POST',
            body: JSON.stringify({
              recordID: record.CodOcorrencia,
            }),
            headers: {
              'Content-type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((body) => {
              if (body.length != 0) {
                const vegs = []
                for (let veg of body) {
                  vegs.push(veg.VegetacaoEntorno)
                }
                record.surrVeg = vegs
              } else {
                record.surrVeg = []
              }
            })
        }
        setData(complRecords)
      })
  } catch (e) {
    console.log(
      'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde.'
    )
  }
}

export default getData
