export async function getImagePreviewData(file: File) {
  return file ? await getBase64(file) : ""
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = error => reject(error)
  })
