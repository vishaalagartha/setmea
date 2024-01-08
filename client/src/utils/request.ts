let API_ENDPOINT: string
if (process.env.REACT_APP_ENV === 'production') {
  API_ENDPOINT = 'https://api.setmea.com'
} else if (process.env.REACT_APP_ENV === 'test') {
  API_ENDPOINT = 'https://api.dev.setmea.com'
} else {
  API_ENDPOINT = 'http://localhost:8080'
}

const request: (endpoint: string, options: Record<string, unknown>) => Promise<any> = async (
  endpoint: string,
  options: Record<string, unknown>
) => {
  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    ...options
  }

  return await fetch(`${API_ENDPOINT}/${endpoint}`, fetchOptions).then(async (response) => {
    const data = await response.json()

    if (response.ok) {
      return { status: response.status, data }
    } else {
      // eslint-disable-next-line
      throw { status: response.status, data }
    }
  })
}

export default request
