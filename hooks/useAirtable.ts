const useAirtable = () => {
  const getStages = async () => {
    try {
      const res = await fetch('/api/get-stages')
      const resJson = await res.json()

      if (resJson.status === 'success') {
        return resJson.data
      }

      throw resJson.error
    } catch (error: any) {
      throw new Error(error)
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
        return resJson.data
      }

      throw resJson.error
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return { getStages, checkPassword }
}

export { useAirtable }