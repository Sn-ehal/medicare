/**
 * Utility to check if a specific time slot on a given date has already passed relative to current time.
 * @param {string} dateStr Format: YYYY-MM-DD (e.g. "2026-11-05")
 * @param {string} slotStr Format: "10:00 AM", "02:30 PM", etc.
 * @returns {boolean} True if the slot timestamp is in the past.
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

