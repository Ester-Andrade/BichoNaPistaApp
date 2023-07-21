import PcIP from '../../config/MyPcIp'

const getData = async (setData) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 5000)

  try {
    await fetch('http://' + PcIP + ':3000/lastrecords', {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then(async (body) => {
        const latestRecords = body
        for (let record of latestRecords) {
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
        }
        setData(latestRecords)
      })
  } catch (e) {
    console.log(
      'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde.'
    )
  }
}

export default getData
