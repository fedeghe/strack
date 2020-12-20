
function Queuer() {
    if (this.constructor.instance)
        return this.constructor.instance;
    this.constructor.instance = this;
    this.queue = [];
    this.endpoint = null;
}
Queuer.prototype.add = function (payload) {
    console.log('argument payload: ', payload)
    this.queue.push(payload);
};

Queuer.prototype.flush = function () {
    console.log('Flushing')

    console.log('posting:')
    console.log({
        queue: this.queue
        
    })

    // console.log(this.queue)
    this.queue = [];
    console.log('----')
    console.log('')
};

Queuer.prototype.setup = function (payload) {
    console.log('setup', payload)
    this.endpoint = payload
};


onmessage = function(e) {
    var data = JSON.parse(e.data),
        queuer = new Queuer();
    console.log('Message received from main script', data);
    if (data.action && data.action in queuer) {
        console.log(`Posting message back to main script (${data.action})`);
        queuer[data.action](data.payload || [])
    }
    
}