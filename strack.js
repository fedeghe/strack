// document.body.addEventListener('click', function (e) {
//     console.log('+++++++++++')
//     console.log(e)
//     console.log(e.target)
//     console.log('-----------\n\n')
// }, {capture: true})

// window.addEventListener('scroll', function (e) {
//     console.log('+++++++++++')
//     console.log(e)
//     console.log('-----------\n\n')
// }, {capture: true})


// document.getElementById('xxx').addEventListener('click', function (e) {
//     console.log('xxxxxxx')
//     e.stopPropagation()
// })


(function (config) {

    var body = document.body,
        capture = {capture: true},
        mustTrack = function (e) {
            return e.target !== body
        },
        loadTime = new Date,

        worker = new Worker('./worker.js'),
        distillEvent = function (e) {
            var base = {
                    tagName: e.target.tagName,
                    timestamp: new Date,
                    path : e.path
                        .reverse()
                        .slice(2)
                        .map(function (t) {return t.tagName})
                        .join(' > '),
                    session: {
                        pageLoad: loadTime,
                        pageUnload: new Date(),
                        language: window.navigator.language,
                        platform: window.navigator.platform,
                        port: window.location.port,
                        client: {
                            name: window.navigator.appVersion,
                            innerWidth: window.innerWidth,
                            innerHeight: window.innerHeight,
                            outerWidth: window.outerWidth,
                            outerHeight: window.outerHeight
                        },
                        page: {
                            pathname: window.location.pathname,
                            href: window.location.href,
                            search: window.location.search,
                            origin: window.location.origin,
                            title: document.title
                        },
                    }
                };
            [
                'clientX', 'clientY',
                'layerX', 'layerY',
                'offsetX', 'offsetY',
                'pageX', 'pageY',
                'screenX', 'screenY',
                'x', 'y',
                'type'
            ].forEach(function (el) {
                base[el] = e[el]
            })
            return base
        };

    worker.postMessage(JSON.stringify({
        action: 'setup',
        payload: config.endpoint
    }));

    var add = function (e) {
        worker.postMessage(JSON.stringify({
            action: 'add',
            payload: distillEvent(e)
        }));
    }
    worker.onmessage = function (mmm) {
        console.log('back from worker')
        console.log(mmm.data.hi)
    }

    document.body.addEventListener('click', function (e) {
        mustTrack(e) && add(e)
    }, capture)
    document.body.addEventListener('mouseover', function (e) {
        mustTrack(e) && add(e)
    }, capture)


    window.onbeforeunload = function (e) {
        worker.postMessage(JSON.stringify({
            action: 'flush'
        }))
    };

})(strackConfig)


