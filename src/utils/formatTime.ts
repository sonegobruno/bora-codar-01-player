export function formatTime(currentTime: number): string {
    const timeInSeconds = Math.round(currentTime)
  
    if(!Number.isNaN(timeInSeconds)) {
      const minutesAmount = Math.floor( timeInSeconds / 60)
      const secondsAmount = timeInSeconds % 60
    
      const minutes = String(minutesAmount).padStart(2, '0')
      const seconds = String(secondsAmount).padStart(2, '0')
    
      return minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0')
    }
  
    return '00:00'
}