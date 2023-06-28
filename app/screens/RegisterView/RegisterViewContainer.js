import PcIP from '../../config/MyPcIp'

const register = async (registerData, setAlertMsg, setShowAlert, ViewIsOpen) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);
  
  try {
    await fetch('http://' + PcIP + ':3000/register', {
      method: 'POST',
      body: JSON.stringify({
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullname,
        phone: registerData.phone === '' ? null : registerData.phone,
      }),
      headers: {
        'Content-type': 'application/json',
      },
      signal: controller.signal
    })
      .then((response) => response.json())
      .then((body) => {
        setAlertMsg(body.msg)
        if (body.Added) {
          ViewIsOpen(false)
        }
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

export default register
