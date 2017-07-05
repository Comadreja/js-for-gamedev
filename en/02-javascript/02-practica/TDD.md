# TDD: Test-driven development

By practicing TDD, we will get to write code so that it passes tests. These tests are already there, but disabled. The [practice guide](./GUIDE.md) recommends an optimal order we can enable the tests in, so as to gradually fulfill the practice.

### Tests and suites

Throughout this practice, we shall use [**Jasmine**](http://jasmine.github.io) as a test framework. We write suites and tests in Jasmine. Suites can be nested and they can also include initialization code. The Jasmine API is generally crystal clear, and does not need much more in the way of explanation. In any case, here goes an example:

```js
describe('Suites in Jasmine', function () {

  describe('can be nested', function () {

    it('and enclose tests with expectations', function () {
      expect(2 + 2).toBe(4);
    });

  });

});
```

We call 'test' a code fragment that checks for a specific functionality. The test can pass or fail. In case of failure, the console will show the reason it did so by means of a trace:

```js
15.2) Expected 'b' to be 'c'.
    Error: Expected 'b' to be 'c'.
        at stack (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1640:17)
        at buildExpectationResult (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1610:14)
        at Spec.expectationResultFactory (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:655:18)
        at Spec.addExpectationResult (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:342:34)
        at Expectation.addExpectationResult (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:599:21)
        at Expectation.toBe (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1564:12)
        at Object.<anonymous> (/Users/salva/workspace/pvli2017-rpg-battle/spec/TurnList.js:39:36)
        at attemptSync (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1950:24)
        at QueueRunner.run (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1938:9)
        at QueueRunner.execute (/Users/salva/workspace/pvli2017-rpg-battle/node_modules/jasmine-core/lib/jasmine-core/jasmine.js:1923:10)
```

The trace contains both the failure and where it happened in the set of calls, from the most recent to the earliest. Failures are sometimes a consequence of implementations not fulfilling expectations, some other times they will be due to runtime errors, and on yet other occasions they will be the product of syntax errors.

Get used to failing, as well as searching the trace for the exact point in the code that is up for you to fix. In order to do this, look for the `spec` and `src` folders in the trace. The first number after the path will be the line that contains the failure.

### Enabling and disabling tests

Tests and suites can be disabled by adding the prefix, `x`. For instance:

```js
describe('Suites in Jasmine', function () {

  describe('can be nested', function () {

    it('and enclose tests with expectations', function () {
      expect(2 + 2).toBe(4);
    });

    xit('this test is disabled', function () {

    });

  });

  xdescribe('the suite and all of its tests are disabled.', function () {

  });

});
```

Disabled tests will not check for expectations, but Jasmine will report that they are disabled.

### The development cycle

Whenever you are developing, it is best for you to run the tests often for two reasons:

- To check whether you are advancing.
- To check whether you have broken anything.

To do this, you can run the command:

```
$ npm run-script watch
```

This task monitors changes in the files within the `spec` and `src` folders, and will launch all of the tests when it detects a change.

Sometimes, an error is catastrophic enough that it will break the monitoring. Should that happen, you will have to manually reenter the command.

Make a new commit anytime you make a modification and it passes the tests.

### Debugging asynchronous tests

Some tests are asynchronous and can cause _timeouts_. Generally speaking, a _timeout_ is not a desirable outcome. The problem with _timeouts_ is that they can slow the whole suite down, so the recommended course of action in these cases is to tackle them one by one, by disabling the rest and enabling them gradually.

You will recognize asynchronous tests because they have a `done` parameter, as in the example:

```js
var EventEmitter = require('events').EventEmitter;

describe('EventEmitter', function () {

  it('emits arbitrary events', function (done) {
    var ee = new EventEmitter();
    ee.on('turn', function(turn) {
      expect(turn.number).toBe(1);
      done();
    });
    ee.emit('turn', { number: 1 });
  });

});
```

## General debugging strategy

It is very recommendable for you to keep a stable branch where all tests pass, and those which do not are disabled. Whenever you embark on the task of making a test pass, create a branch for that task, and merge it with the stable branch when it is done.

Whenever you find an error, try to follow these steps:
  1. Disable the asynchronous tests that are taking too long. **You need a fast development cycle.**
  2. **Read the error!!**
  3. Search the trace for the place where the error is originated:
    1. If it is a failed expectation, locate the entry point in your code.
    2. Keep traces with `console.log()` inspecting your objects' state.
  4. Save and reload the tests often.
