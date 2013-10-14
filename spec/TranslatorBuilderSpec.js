"use strict";

//describe("A generated Translator", function () {
//  var obj;
//
//  beforeEach(function () {
//    function O() {}
//    BeautifulProperties.Events.provideMethods(O.prototype);
//
//    obj = new O();
//    BeautifulExchanger.TranslatorBuilder.create(obj, {
//      initial: 'foo',
//      events: [
//        // Don't enter to baz because of their predicate.
//        {name: 'ev', to: 'bar'},
//        {name: 'ev', to: 'baz'}
//      ]
//    });
//  });
//
//  it("be initialized.", function () {
//    expect(obj).not.toBeNull();
//    expect(obj.state.name).toEqual('foo');
//  });
//
//  it("do transit.", function () {
//    obj.trigger('ev');
//    expect(obj.state.name).toEqual('bar');
//  });
//
//  it("do emit transit events.", function () {
//    checkTransition(obj, 'foo', 'bar', 'ev');
//    checkCyclicTransition(obj, 'bar', 'ev');
//  });
//
//  it("do emit transit events to their prototype.", function () {
//    var foo_leave;
//    obj.constructor.prototype.on('fsm:foo:leave', function () { foo_leave = true; });
//    obj.trigger('ev');
//    expect(foo_leave).toBe(true);
//  });
//
//  it("each state knows context, predecessor and successor.", function () {
//    var context, foo_successor, bar_predecessor;
//    obj.foo = 'foo';
//    obj.on('fsm:foo:leave', function () { context = this; foo_successor = this.successor.name; });
//    obj.on('fsm:bar:enter', function () { bar_predecessor = this.predecessor.name; });
//    obj.trigger('ev');
//    expect(context.foo).toEqual('foo');
//    expect(foo_successor).toEqual('bar');
//    expect(bar_predecessor).toEqual('foo');
//  });
//
//  it("can destroy which disable their event dispatch.", function () {
//    var foo_leave;
//    obj.on('fsm:foo:leave', function () { foo_leave = true; });
//    BeautifulFSM.StateMachine.destroy(obj);
//    obj.trigger('ev');
//    expect(foo_leave).toBeUndefined();
//  });
//});
