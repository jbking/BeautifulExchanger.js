/**
 * @module BeautifulExchanger
 * @version 0.0.1
 * @author jbking
 * @copyright (c) 2013 jbking
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
;(function(module,moduleName,global){
  // in AMD
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    define(['BeautifulProperties'], function(BeautifulProperties) {
      return module(BeautifulProperties);
    });
  } else {
    // in a browser or Rhino
    global[moduleName] = module(BeautifulProperties);
  }
})((function(global, undefined) {
  return function (BeautifulProperties) {
    /**
     * @name BeautifulExchanger
     * @namespace
     * @alias module:BeautifulExchanger
     */
    var BeautifulExchanger = Object.create(null);

    /**
     * @name Registry
     * @namespace
     * @memberOf BeautifulExchanger
     */
    BeautifulExchanger.Registry = Object.create(null);
    (function (mod) {
      function IDIssuer() {
        this.c = 0;
      }
      (function (proto) {
        proto.issue = function IDIssuer_issue() {
          return this.c++;
        };
      })(IDIssuer.prototype);

      // For Registry.
      var issuer = new IDIssuer;

      // For now, support only one registry. But can be multiple registries.
      function Registry() {
        this.id = issuer.issue();
        // for Rule and Entity
        this.issuer = new IDIssuer;
        this.idKeyForRule = 'registry:' + this.id;
        this.rules = Object.create(null);
        this.receivers = Object.create(null);
        this.emitters = Object.create(null);
      }

      (function (proto) {
        proto.registerRule = function Registry_registerRule(rule) {
          var registry = this;
          var ruleId = registry.retrieveIDByRule(rule);
          if (ruleId !== undefined) {
            throw "The rule is already registered";
          }
          var key = registry.idKeyForRule;
          ruleId = registry.issuer.issue();
          rule[key] = ruleId;
          registry.rules[ruleId] = rule;
          return ruleId;
        };

        proto.unregisterRule = function Registry_unregisterRule(rule) {
          var registry = this;
          var ruleId = registry.retrieveIDByRule(rule);
          if (ruleId === undefined) {
            throw "The rule is not registered";
          }
          var key = registry.idKeyForRule;
          delete rule[key];
          delete registry.rules[ruleId];
        };

        proto.retrieveIDByRule = function Registry_retrieveIDByRule(rule) {
          var registry = this;
          return rule[registry.idKeyForRule];
        };

        proto.retrieveRuleByID = function Registry_retrieveRuleByID(ruleId) {
          var registry = this;
          return registry.rules[ruleId];
        };

        proto._registerEntity = function Registry__registerEntity(collection, entity, rules) {
          var registry = this;
          rules.forEach(function (rule) {
            var ruleId = registry.retrieveIDByRule(rule);
            var entityId = registry._retrieveIDByEntityUnderRule(entity, rule);
            if (entityId !== undefined) {
              return;
            }
            var key = registry.idKeyForRule + ':rule:' + ruleId;
            entityId = registry.issuer.issue();
            collection[entityId] = entity;
            entity[key] = entityId;
          });
        };

        proto._retrieveIDByEntityUnderRule = function Registry__retrieveIDByEntityUnderRule(entity, rule) {
          var registry = this;
          var ruleId = registry.retrieveIDByRule(rule);
          // Register un-registered rule at once?
          if (ruleId === undefined) {
            ruleId = registry.registerRule(rule);
          }
          var key = registry.idKeyForRule + ':rule:' + ruleId;
          return entity[key];
        };

        proto._retrieveRulesByEntity = function Registry__retrieveRulesByEntity(collection, entity) {
          var registry = this;
          var rules = [];
          var ruleId;
          for (ruleId in registry.rules) {
            var rule = registry.rules[ruleId];
            var entityId = registry._retrieveIDByEntityUnderRule(entity, rule);
            if (entityId !== undefined && collection[entityId] === entity && rules.indexOf(rule) === -1) {
              rules.push(rule);
            }
          }
          return rules;
        };

        proto.retrieveRulesByReceiver = function Registry_retrieveRulesByReceiver(receiver) {
          var registry = this;
          return registry._retrieveRulesByEntity(registry.receivers, receiver);
        };

        proto.retrieveRulesByEmitter = function Registry_retrieveRulesByEmitter(emitter) {
          var registry = this;
          return registry._retrieveRulesByEntity(registry.emitters, emitter);
        };

        proto.registerReceiver = function Registry_registerReceiver(receiver) {
          var rules = Array.prototype.slice.call(arguments, 1);
          this._registerEntity(this.receivers, receiver, rules);
        };

        proto.registerEmitter = function Registry_registerEmitter(emitter) {
          var rules = Array.prototype.slice.call(arguments, 1);
          this._registerEntity(this.emitters, emitter, rules);
        };

        proto._unregisterEntity = function Registry__unregisterEntity(collection, entity, rules) {
          var registry = this;
          // When no rule specified, use all related rules for the entity.
          if (rules.length === 0) {
            rules = registry._retrieveRulesByEntity(collection, entity);
          }
          rules.forEach(function (rule) {
            var entityId = registry._retrieveIDByEntityUnderRule(entity, rule);
            var ruleId = registry.retrieveIDByRule(rule);
            var key = registry.idKeyForRule + ':rule:' + ruleId;
            delete collection[entityId];
            delete entity[key];
          });
        };

        proto.unregisterReceiver = function Registry_unregisterReceiver(receiver) {
          var registry = this;
          var rules = Array.prototype.slice.call(arguments, 1);
          registry._unregisterEntity(registry.receivers, receiver, rules);
        };

        proto.unregisterEmitter = function Registry_unregisterEmitter(emitter) {
          var registry = this;
          var rules = Array.prototype.slice.call(arguments, 1);
          registry._unregisterEntity(registry.emitters, emitter, rules);
        };

        proto._retrieveEntities = function Registry__retrieveEntities(collection, rule) {
          var registry = this;
          var entityId;
          var entities = [];
          for (entityId in collection) {
            var entity = collection[entityId];
            if (registry._retrieveIDByEntityUnderRule(entity, rule) !== undefined && entities.indexOf(entity) === -1) {
              entities.push(entity);
            }
          }
          return entities;
        };

        proto.retrieveReceivers = function Registry_retrieveReceivers(rule) {
          var registry = this;
          return registry._retrieveEntities(registry.receivers, rule);
        };

        proto.retrieveEmitters = function Registry_retrieveEmitters(rule) {
          var registry = this;
          return registry._retrieveEntities(registry.emitters, rule);
        };

        proto.retrieveReceiversForEmitter = function Registry_retrieveReceiversForEmitter(emitter) {
          var registry = this;
          var l = [];
          registry.retrieveRulesByEmitter(emitter).forEach(function (rule) {
            if (rule.Event) {
              registry.retrieveReceivers(rule).forEach(function (receiver) {
                l.push([receiver, rule]);
              });
            }
          });
          return l;
        };
      })(Registry.prototype);

      mod.current = new Registry;
      Object.freeze(mod.current);
    })(BeautifulExchanger.Registry);

    /**
     * @name TranslatorBuilder
     * @namespace
     * @memberOf BeautifulExchanger
     */
    BeautifulExchanger.TranslatorBuilder = Object.create(null);
    (function (Registry, TranslatorBuilder) {
      var destroyKey = 'app/EventTranslator/TranslatorBuilder:destroy';

      TranslatorBuilder.create = function TranslatorBuilder_create(descriptions) {
        var proto = Object.create(null);
        BeautifulProperties.Events.provideMethods(proto);
        BeautifulProperties.Hookable.define(proto, 'emitter');
        BeautifulProperties.Observable.define(proto, 'emitter');

        proto.on('change:emitter', function (_ev, emitter, previous) {
          // When the emitter is set. It means their ancestor is replaced in past.
          // So, free that.
          if (previous) {
            BeautifulProperties.Events.Ancestor.setRetriever(previous, undefined);
          }
          if (emitter) {
            var context = this;
            var d = descriptions.slice();
            d.unshift(this);
            var next = d.reduce(function (next,desc) {
              var scopedContext = Object.create(context);
              desc.rule.enable(scopedContext, desc.option, context);
              if (desc.rule.Event) {
                Registry.current.registerEmitter(context, desc.rule);
              }
              context.on(destroyKey, function f() {
                Registry.current.unregisterEmitter(context, desc.rule);
                context.off(destroyKey, f);
                // Call the destructor if exists.
                if (typeof desc.rule.disable === 'function') {
                  desc.rule.disable(scopedContext, desc.option);
                }
                scopedContext.off();
              });
              BeautifulProperties.Events.Ancestor.setRetriever(scopedContext,function () {
                return next;
              });
              return scopedContext;
            });
            /*
             * XXX The only way to pass all events to other is ancestor relation for now.
             */
            BeautifulProperties.Events.Ancestor.setRetriever(emitter,function () {
              return next;
            });
          }
        });
        return proto;
      };

      TranslatorBuilder.destroy = function TranslatorBuilder_destroy(translator) {
        translator.trigger(destroyKey);
      };
    })(BeautifulExchanger.Registry, BeautifulExchanger.TranslatorBuilder);

    return BeautifulExchanger;
  };
})(this),'BeautifulExchanger',this);
