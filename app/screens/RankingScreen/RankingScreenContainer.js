import PcIP from '../../config/MyPcIp'

const getData = async (type, ID, setPos, setData, setTop3, setFinalData) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 5000)

  await fetch('http://' + PcIP + ':3000/ranking', {
    method: 'POST',
    body: JSON.stringify({
      type: type,
    }),
    headers: {
      'Content-type': 'application/json',
    },
    signal: controller.signal
  })
    .then((response) => response.json())
    .then((body) => {
      let find = false
      const ranking = body
      ranking.map((user) => {
        if (user.CodUsuario == ID) {
          find = true
          setPos(user.RankResult)
          setFinalData(null)
        }
        let name = user.nome
        name = name.split(' ')
        user.nome = name[0] + ' ' + name[name.length - 1]
      })
      if (!find) {
        fetch('http://' + PcIP + ':3000/rankingPosition', {
          method: 'POST',
          body: JSON.stringify({
            type: type,
            user: ID,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((body) => {
            setFinalData(body[0])
            setPos(body[0].RankResult)
          })
      }
      const top3 = ranking.splice(0, 3)
      setData(ranking)
      setTop3([top3[1], top3[0], top3[2]])
    })
  return
}

export default getData
