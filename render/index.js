const { ipcRenderer } = require('electron')

let container = document.getElementById('container')

container.addEventListener('dragover', (event) => {
    event.preventDefault()
})

container.addEventListener('drop', event => {
    event.preventDefault();
    console.log(event)
    const files = event.dataTransfer.files
    let fileArr = Array.from(files)
    ipcRenderer.send('compress', fileArr.map(f => f.path))
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
            <p class="item-size">${file.compressSize}</p>
        `

        fragment.appendChild(li)
    })
    items.appendChild(fragment)
}