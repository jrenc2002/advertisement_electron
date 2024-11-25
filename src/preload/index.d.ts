import { ElectronAPI } from '@electron-toolkit/preload'

interface DownloadPDFResponse {
  success: boolean
  path?: string
  error?: string
}

interface Api {
  downloadPDF: (PathName: string, url: string, filename: string) => Promise<DownloadPDFResponse>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
