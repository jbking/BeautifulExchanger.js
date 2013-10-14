"use strict";

describe("A generated Translator", function () {
  var translator;

  var AtoB = Object.create(null);
  AtoB.enable = function (context) {
    context.on('a', function () {
      context.trigger('b');
    })
  };

  var BtoC = Object.create(null);
  BtoC.enable = function (context) {
    context.on('b', function () {
      context.trigger('c');
    })
  };

  var emitter = Object.create(null);
  var translator;
  BeautifulProperties.Events.provideMethods(emitter);

  beforeEach(function () {
    BeautifulExchanger.Registry.current.registerRule(AtoB);
    BeautifulExchanger.Registry.current.registerRule(BtoC);

    var Translator = BeautifulExchanger.TranslatorBuilder.create([
      {rule: BtoC},
      {rule: AtoB}
    ]);
    var f = function () {};
    f.prototype = Translator;
    translator = new f;
    translator.emitter = emitter;
  });

  it("be initialized.", function () {
    expect(translator).not.toBeNull();
  });

  it("be work.", function () {
    var called = false;
    translator.on('c', function () {
      called = true;
    });
    emitter.trigger('a');
    expect(called).toBe(true);
  });

  afterEach(function () {
    BeautifulExchanger.Registry.current.unregisterRule(AtoB);
    BeautifulExchanger.Registry.current.unregisterRule(BtoC);
    emitter.off();
  });
});
