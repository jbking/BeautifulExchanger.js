define(
  'rule/FSM',
  [
    'BeautifulFSM',
    'BeautifulExchanger'
  ],
  function (BeautifulFSM,
            BeautifulExchanger) {
    "use strict";
    var FSM = Object.create(null);
    FSM.label = "FSM";

    BeautifulExchanger.Registry.current.registerRule(FSM);

    FSM.enable = function FSM_enable(context, options) {
      BeautifulFSM.StateMachine.create(context, options.definition);
    };

    FSM.disable = function FSM_disable(context) {
      BeautifulFSM.StateMachine.destroy(context);
    };
    Object.freeze(FSM);

    return FSM;
  }
);
