import { useEffect, useState } from 'react'

const useJoined = () => {
  const [joined, setJoined] = useState(false)
  useEffect(() => {
    const initialUsername: string = JSON.parse(
      localStorage.getItem('bingoUsername') ?? '""'
    ).toLowerCase()
    if (typeof initialUsername !== 'string' || initialUsername.length < 1) {
      setJoined(false)
      return
    }
    setJoined(true)
  }, [])

  return joined
}

export { useJoined }
