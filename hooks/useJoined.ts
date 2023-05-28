import { useEffect, useState } from 'react'

// This hook only tells you whether the client had already joined on page load
// To watch join/unjoin changes during usage, add a event listener for 'joinevent'
const useJoined = () => {
  const [joined, setJoined] = useState(false)
  useEffect(() => {
    const initialStage: string = JSON.parse(
      localStorage.getItem('bingoStage') ?? '{}'
    )
    if (typeof initialStage !== 'string' || initialStage.length < 1) {
      setJoined(false)
      return
    }
    setJoined(true)
  }, [])

  return joined
}

export { useJoined }
