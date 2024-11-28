import { ElectronAPI } from '@electron-toolkit/preload'

interface DownloadResponse {
  success: boolean
  path?: string
  error?: string
}

interface Api {
  downloadPDF: (PathName: string, url: string, filename: string) => Promise<DownloadResponse>
  downloadVideo: (PathName: string, url: string, filename: string) => Promise<DownloadResponse>
  downloadImage: (PathName: string, url: string, filename: string) => Promise<DownloadResponse>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
