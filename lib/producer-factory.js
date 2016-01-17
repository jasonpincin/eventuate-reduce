var isPromise = require('is-promise'),
    copy      = require('clone')

module.exports = producerFactory

function producerFactory (options, reducer, init) {
    this.lastValue = getLastValue
    this.reset = reset

    var lastValue = copy(init)

    return function each (value) {
        var self = this

        if (typeof lastValue === 'undefined')
            lastValue = copy(value)
        else if (reducer.length === 3)
            reducer(lastValue, value, cb)
        else {
            var result = reducer(lastValue, value)
            if (isPromise(result)) result.then(produce, error)
            else produce(result)
        }

        function produce (reducedValue) {
            lastValue = copy(reducedValue)
            self.produce(reducedValue).finish()
        }

        function error (err) {
            self.produceError(err).finish()
        }

        function cb (err, reducedValue) {
            if (err) error(err)
            else produce(reducedValue)
        }
    }

    function getLastValue () {
        return copy(lastValue)
    }

    function reset (v) {
        lastValue = copy(v)
    }
}
