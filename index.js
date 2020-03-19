const { program } = require('commander')
const path = require('path')
const { imageCompress } = require('./lib/image-compress')
const package = require('./package.json')
const VERSION = package.version

async function main () {
  program
    .version(VERSION, '-v, --version', '版本号')
    .description('这是一个简单的图片压缩工具，支持 jpg、png、jpeg等多种图片格式压缩')
    .option('-s, --source <source>', '需要压缩等图片所在文件夹等路径')
    .option('-o, --output <output>', '压缩后输出的文件夹路径')
    .helpOption('-h , --help', '帮助')
    .action(
      args => {
        let source = path.resolve(__dirname, args.source)
        
        let output = args.output ? path.resolve(__dirname, args.output) : source
        
        imageCompress(source, output)
      }
    )
    .parse(process.argv)
}

main()

