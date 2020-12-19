document.body.addEventListener('click', function (e) {
    console.log('+++++++++++')
    console.log(e)
    console.log(e.target)
    console.log('-----------\n\n')
}, {capture: true})


document.getElementById('xxx').addEventListener('click', function (e) {
    console.log('xxxxxxx')
    e.stopPropagation()
})
