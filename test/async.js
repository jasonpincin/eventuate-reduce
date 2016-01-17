var test      = require('tape'),
    eventuate = require('eventuate-core'),
    reduce    = require('..')(eventuate),
    Promise   = require('promise-polyfill')

test('supports async callbacks', function (t) {
    t.plan(1)

    var event = eventuate()
    var sum = reduce(event, function (p, n, done) {
        setImmediate(done, null, p + n)
    })

    sum.consume(function (v) {
        t.equal(v, 4)
    })

    event.produce(2)
    event.produce(2)
})

test('supports promises', function (t) {
    t.plan(1)

    var event = eventuate()
    var sum = reduce(event, function (p, n) {
        return new Promise(function (resolve) {
            setImmediate(resolve, p + n)
        })
    }, 2)

    sum.consume(function (v) {
        t.equal(v, 4)
    })

    event.produce(2)
})

test('produces error on callback errors', function (t) {
    t.plan(1)

    var event = eventuate()
    var sum = reduce(event, function (p, n, done) {
        setImmediate(done, new Error('boom'))
    }, 2)

    sum.consume(function (v) {
        t.fail('should not produce data')
    }, function (err) {
        t.ok(err instanceof Error, 'is an error')
    })

    event.produce(2)
})

test('produces error on promise rejection', function (t) {
    t.plan(1)

    var event = eventuate()
    var sum = reduce(event, function (v) {
        return new Promise(function (resolve, reject) {
            setImmediate(reject, new Error('boom'))
        })
    }, 2)

    sum.consume(function (v) {
        t.fail('should not produce data')
    }, function (err) {
        t.ok(err instanceof Error, 'is an error')
    })

    event.produce(2)
})
