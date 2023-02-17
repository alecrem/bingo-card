const useAirtable = () => {
  const getStages = async () => {
    try {
      const res = await fetch('/api/get-stages')
      const resJson = await res.json()

      if (resJson.status === 'success') {
        return resJson.key
      }

      throw resJson.error
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return { getStages }
}

export { useAirtable }
