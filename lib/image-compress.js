const imagemin = require('imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminJpegtran = require('imagemin-jpegtran')
const byteSize = require('byte-size')
const path = require('path')

let fileType = ['jpg', 'png', 'jpeg']
async function imageCompress(source, output) {
  let sourcePath = ''
  let outputPath = ''
  let glob = false
  let isDir = false
  let sourceFiles = []

  if (!Array.isArray(source)) {
    if (path.extname(source)) {
      // is file
      source = [source]
    } else {
      // is dir
      isDir = true
      glob = true
      sourcePath = source + `/*.{${fileType.toString()}}`
    }
  } else {
    // is files    
    source.forEach(filePath => {
      sourceFiles.push(filePath)
    })
  }
  outputPath = path.extname(output) ? path.dirname(output) : output
  
  console.log('sourcePath', isDir ? sourcePath : sourceFiles)
  console.log('output', outputPath)
  // return
  const files = await imagemin(isDir ? sourcePath : sourceFiles, {
    destination: outputPath,
    // glob,
    plugins: [
      imageminPngquant({
        quality: [0.6, 0.75],
        strip: true
      }),
      imageminJpegtran({
        arithmetic: true,
        progressive: true
      })
    ]
  })
  return files.map(file => {
    return {
      ...file,
      compressSize: byteSize(file.data.length).toString()
    }
  })
}

module.exports = {
  imageCompress
}