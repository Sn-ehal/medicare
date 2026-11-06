/**
 * Utility functions for checking and handling appointment time slots
 */

export const isSlotPast = (dateStr, slotStr) => {
  if (!dateStr || !slotStr) return false
  try {
    const [year, month, day] = dateStr.split('-').map(Number)
    if (!year || !month || !day) return false

    const match = slotStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return false

    let hours = parseInt(match[1], 10)
    const minutes = parseInt(match[2], 10)
    const meridian = match[3].toUpperCase()

    if (meridian === 'PM' && hours < 12) hours += 12
    if (meridian === 'AM' && hours === 12) hours = 0

    const slotDate = new Date(year, month - 1, day, hours, minutes, 0, 0)
    return slotDate.getTime() <= Date.now()
  } catch {
    return false
  }
}

export const getTodayDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getTomorrowDateString = () => {
  const now = new Date()
  now.setDate(now.getDate() + 1)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns the first slot that is neither full nor in the past
 */
export const getFirstAvailableSlot = (dateStr, slots = [], availability = {}) => {
  if (!slots || !Array.isArray(slots)) return ''
  for (const slot of slots) {
    if (isSlotPast(dateStr, slot)) continue
    const avail = availability[slot]
    if (avail && avail.isFull) continue
    return slot
  }
  return ''
}

