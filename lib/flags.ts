import { get } from '@vercel/edge-config'

export async function getFlag(key: string, defaultVal = false): Promise<boolean> {
  try {
    const val = await get<boolean>(key)
    return val ?? defaultVal
  } catch {
    return defaultVal
  }
}
