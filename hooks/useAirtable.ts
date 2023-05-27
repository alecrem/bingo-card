const useAirtable = () => {
  const getStages = async () => {
    try {
      const res = await fetch('/api/get-stages')
      const resJson = await res.json()
      if (resJson.status === 'success') {
        return resJson.data
      }

      return { status: res.status }
    } catch (error: any) {
      return { status: 'error' }
    }
  }

  const checkPassword = async (password: string, stage: string) => {
    try {
      const url = '/api/password/' + stage + '/' + password
      const res = await fetch(url, {
        method: 'POST'
      })
      const resJson = await res.json()

      if (resJson.status === 'success') {
        return { status: res.status, data: resJson.data }
      }

      return { status: res.status }
    } catch (error: any) {
      return { status: 503 }
    }
  }

  return { getStages, checkPassword }
}

export { useAirtable }
