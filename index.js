var chainable = require('eventuate-chainable'),
    producerFactory = require('./lib/producer-factory')

module.exports = eventuateReduceFactory
function eventuateReduceFactory (Super) {
    var EventuateReduce = chainable(Super, producerFactory)

    function eventuateReduce (upstream, options, reducer, init) {
        return new EventuateReduce(upstream, options, reducer, init)
    }
    eventuateReduce.constructor = EventuateReduce
    return eventuateReduce
}
