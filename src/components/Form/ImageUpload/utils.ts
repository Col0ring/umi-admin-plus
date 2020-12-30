export function getBase64(img: File | Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));
    reader.addEventListener('error', (e) => reject(e));
    reader.readAsDataURL(img);
  });
}
