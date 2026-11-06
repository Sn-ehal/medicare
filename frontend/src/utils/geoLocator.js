/**
 * Resilient Multi-Tier Geolocation Engine for MediCare
 * 
 * Flow:
 * 1. Checks Browser Geolocation (HTML5 GPS / Wi-Fi positioning) with fast response.
 * 2. If browser geolocation is denied, blocked, timed out, or unavailable (common on Windows
 *    PCs lacking dedicated hardware GPS), it automatically falls back to network IP geolocation.
 * 3. Formats clean, human-readable city and locality names.
 */

// Reverse geocode coordinate into city/locality name
export async function reverseGeocodeCoords(latitude, longitude) {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const data = await res.json()
      const locality = data.locality || ''
      const city = data.city || ''
      const state = data.principalSubdivision || ''

      if (locality && city && locality !== city) {
        return `${locality}, ${city}`
      }
      if (locality || city) {
        const place = locality || city
        return state && !place.toLowerCase().includes(state.toLowerCase()) ? `${place}, ${state}` : place
      }
      if (state) return state
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err)
  }
  return `${Number(latitude).toFixed(3)}, ${Number(longitude).toFixed(3)}`
}

// IP-based Geolocation Fallback
export async function detectLocationFromIP() {
  // Service 1: BigDataCloud free client-info IP endpoint
  try {
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.latitude && data.longitude) {
        const locality = data.locality || ''
        const city = data.city || ''
        const state = data.principalSubdivision || ''
        let areaName = ''
        if (locality && city && locality !== city) {
          areaName = `${locality}, ${city}`
        } else if (locality || city) {
          const place = locality || city
          areaName = state && !place.toLowerCase().includes(state.toLowerCase()) ? `${place}, ${state}` : place
        } else if (state) {
          areaName = state
        } else {
          areaName = 'Current Location'
        }

        return {
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          locationName: areaName,
          source: 'ip',
        }
      }
    }
  } catch (err) {
    console.warn('BigDataCloud IP detection failed, trying secondary IP provider...', err)
  }

  // Backup Service 2: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/', {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.latitude && data.longitude) {
        const city = data.city || ''
        const region = data.region || ''
        const areaName = city && region ? `${city}, ${region}` : (city || region || 'Current Location')
        return {
          lat: Number(data.latitude),
          lng: Number(data.longitude),
          locationName: areaName,
          source: 'ip',
        }
      }
    }
  } catch (err) {
    console.warn('ipwho.is IP detection failed', err)
  }

  return null
}

/**
 * Main function to request user's location.
 * Tries Browser Geolocation first, then automatically falls back to IP geolocation.
 * @returns {Promise<{lat: number, lng: number, locationName: string, source: 'gps' | 'ip'}>}
 */
export async function requestUserLocation() {
  return new Promise((resolve, reject) => {
    const runFallback = async (reason) => {
      console.warn(`Browser GPS unavailable (${reason}). Automatically falling back to network IP location...`)
      try {
        const ipLocation = await detectLocationFromIP()
        if (ipLocation) {
          resolve(ipLocation)
          return
        }
      } catch (e) {
        console.error('IP fallback failed:', e)
      }
      reject(new Error(reason || 'Location could not be determined.'))
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      runFallback('Browser does not support geolocation')
      return
    }

    // Fast attempt with enableHighAccuracy: false
    // On Windows laptops and desktops, high accuracy fails or hangs because there is no GPS chip.
    // Standard accuracy uses Wi-Fi / IP BSSID which resolves within 100-300ms.
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const areaName = await reverseGeocodeCoords(latitude, longitude)
          resolve({
            lat: latitude,
            lng: longitude,
            locationName: areaName,
            source: 'gps',
          })
        } catch {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            locationName: `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`,
            source: 'gps',
          })
        }
      },
      (err) => {
        // Any error (permission denied, position unavailable, timeout) -> automatically run IP fallback
        let msg = 'Position unavailable'
        if (err.code === 1) msg = 'Location permission denied by user or browser'
        else if (err.code === 2) msg = 'Position unavailable on this device'
        else if (err.code === 3) msg = 'Location request timed out'
        runFallback(msg)
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
    )
  })
}
