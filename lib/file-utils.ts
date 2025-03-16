/**
 * Utility function to save data as a file for download
 * @param data The data to save
 * @param filename The name of the file
 * @param type The MIME type of the file
 */
export function saveAs(data: BlobPart, filename: string, type = "application/octet-stream") {
  try {
    // Create a blob with the data and type
    const blob = new Blob([data], { type })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"

    // Append to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)

    return true
  } catch (error) {
    console.error("Error saving file:", error)
    return false
  }
}

interface Navigator {
  msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
}

/**
 * Alternative download method using Blob and navigator.msSaveBlob for IE/Edge
 * or creating a download link for other browsers
 */
export function downloadFile(data: BlobPart, filename: string, type = "application/octet-stream") {
  try {
    const blob = new Blob([data], { type })

    // For IE and Edge
    if (window.navigator && (window.navigator as Navigator).msSaveOrOpenBlob) {
      (window.navigator as Navigator).msSaveOrOpenBlob?.(blob, filename)
      return true
    }

    // For other browsers
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    document.body.appendChild(a)
    a.style.display = "none"
    a.href = url
    a.download = filename
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return true
  } catch (error) {
    console.error("Error downloading file:", error)
    return false
  }
}
