"use strict";

describe("A Registry", function () {
  it("be initialized.", function () {
    expect(BeautifulExchanger.Registry.current).not.toBeNull();
  });

  describe("with Rule", function () {
    var rule = Object.create(null);
    var exchangableRule = Object.create(null);
    exchangableRule.Event = {};

    beforeEach(function () {
      BeautifulExchanger.Registry.current.registerRule(rule);
      BeautifulExchanger.Registry.current.registerRule(exchangableRule);
    });

    it("has two rules.", function () {
      var ruleValues = _.values(BeautifulExchanger.Registry.current.rules);
      expect(ruleValues).toContain(rule);
      expect(ruleValues).toContain(exchangableRule);
    });

    describe("to relate an Emitter and Receivers", function () {
      var emitter = Object.create(null);
      var receiver1 = Object.create(null);
      var receiver2 = Object.create(null);

      beforeEach(function () {
        BeautifulExchanger.Registry.current.registerEmitter(emitter, exchangableRule, rule);
        BeautifulExchanger.Registry.current.registerReceiver(receiver1, exchangableRule);
        BeautifulExchanger.Registry.current.registerReceiver(receiver2, rule);
      });

      it("only return exchangable pair.", function () {
        var receiverPair = BeautifulExchanger.Registry.current.retrieveReceiversForEmitter(emitter);
        expect(receiverPair).toEqual([[receiver1, exchangableRule]]);
      });

      afterEach(function () {
        BeautifulExchanger.Registry.current.unregisterEmitter(emitter);
        BeautifulExchanger.Registry.current.unregisterReceiver(receiver1);
        BeautifulExchanger.Registry.current.unregisterReceiver(receiver2);

      });
    });
    afterEach(function () {
      BeautifulExchanger.Registry.current.unregisterRule(rule);
      BeautifulExchanger.Registry.current.unregisterRule(exchangableRule);
    });
  })
});
