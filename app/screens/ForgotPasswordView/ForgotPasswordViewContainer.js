import PcIP from '../../config/MyPcIp'

const sendMail = async (email, setAlertMsg, setShowAlert, ViewIsOpen) => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 5000)

  try {
    await fetch('http://' + PcIP + ':3000/sendMail', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        'Content-type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((body) => {
        setAlertMsg(body.msg)
        ViewIsOpen(false)
        setShowAlert(true)
      })
  } catch (e) {
    setAlertMsg(
      'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde.'
    )
    ViewIsOpen(false)
    setShowAlert(true)
  }
}

export default sendMail
