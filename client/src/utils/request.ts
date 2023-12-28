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

  return await fetch(`http://localhost:8080/${endpoint}`, fetchOptions).then(async (response) => {
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
