import Resizer from 'react-image-file-resizer'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const resizeImage: (file: File) => Promise<any> = async (file: File) =>
  await new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri)
      },
      'file'
    )
  })

const convertFile: (f: File) => Promise<File> = async (f: File) => {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
  const format = f.name.split('.')[1]
  const fileToConvert = await fetchFile(f)
  const ffmpeg = new FFmpeg()
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
  })
  ffmpeg.on('log', ({ message }) => {
    console.log(message)
  })
  await ffmpeg.writeFile(`input.${format}`, fileToConvert)
  await ffmpeg.exec([
    '-i',
    `input.${format}`,
    '-c:v',
    'libx264',
    '-crf',
    '28',
    '-preset',
    'ultrafast',
    'output.mp4'
  ])
  const data = await ffmpeg.readFile('output.mp4')
  const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }))
  const res = await fetch(url).then(async (res) => await res.blob())
  const file = new File([res], 'new_file.mp4', { type: 'video/mp4' })
  return file
}

export { convertFile, resizeImage }
