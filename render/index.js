const { ipcRenderer, remote } = require('electron')
const { Menu, MenuItem } = remote
const byteSize = require('byte-size')
let container = document.getElementById('container')

container.addEventListener('dragover', (event) => {
    event.preventDefault()
})

container.addEventListener('drop', event => {
    event.preventDefault();
    const files = event.dataTransfer.files
    let fileArr = Array.from(files)
    ipcRenderer.send('compress', fileArr.map(f => {
        return {
            path: f.path,
            size: byteSize(f.size).toString()
        }
    }))
})
function $(selector) {
    return document.querySelector(selector)
}
let files = []
let items = $('#items')
let dropTip = $('#drop-tip')
let itemsContainer = $('#items-container')
ipcRenderer.on('compress-success', (e, fs) => {
    files = files.concat(fs)
    dropTip.style.display = 'none'
    itemsContainer.style.display = 'block'
    console.log(fs)
    renderFiles(fs)
})

function renderFiles (files) {
    let fragment = document.createDocumentFragment()
    files.forEach(file => {
        let li = document.createElement('li')
        li.classList.add('item')
        li.innerHTML = `
            <p class="item-content">${file.sourcePath}</p>
            <p class="item-size">${file.size}</p>
            <p class="item-compress-size">${file.compressSize}</p>
        `

        fragment.appendChild(li)
    })
    items.appendChild(fragment)
}

let menu = new Menu()
let sourcePath = ''
menu.append(new MenuItem({
    label: '打开所在文件夹',
    click: (e) => {
        if (sourcePath) {
            ipcRenderer.send('open-folder', sourcePath)
        }
    }
}))
items.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(remote.getCurrentWindow())
    let target = e.target
    while(true) {
        if (target.classList.contains('item')) {
            sourcePath = target.querySelector('.item-content').innerText
            console.log('sourcePath', sourcePath)
            break
        } else {
            target = target.parentNode
        }
    }
}, false)