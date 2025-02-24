'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const Yup = require('yup')
const rules_1 = require('./rules')
/**
 *
 * @param name
 * @param options
 *
 * Wraps a function into a Rule class. This way we can identify rules
 * once we start generating middleware from our ruleTree.
 *
 * 1.
 * const auth = rule()(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 * 2.
 * const auth = rule('name')(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 * 3.
 * const auth = rule({
 *  name: 'name',
 *  fragment: 'string',
 *  cache: 'cache',
 * })(async (parent, args, ctx, info) => {
 *  return true
 * })
 *
 */
exports.rule = (name, options) => func => {
  if (typeof name === 'object') {
    options = name
    name = Math.random().toString()
  } else if (typeof name === 'string') {
    options = options || {}
  } else {
    name = Math.random().toString()
    options = {}
  }
  return new rules_1.Rule(name, func, {
    fragment: options.fragment,
    cache: options.cache,
  })
}
/**
 *
 * Constructs a new InputRule based on the schema.
 *
 * @param schema
 */
exports.inputRule = (name, schema) => {
  if (typeof name === 'string') {
    return new rules_1.InputRule(name, schema(Yup))
  } else {
    return new rules_1.InputRule(Math.random().toString(), name(Yup))
  }
}
/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for and operation.
 *
 */
exports.and = (...rules) => {
  return new rules_1.RuleAnd(rules)
}
/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for and operation.
 *
 */
exports.chain = (...rules) => {
  return new rules_1.RuleChain(rules)
}
/**
 *
 * @param rules
 *
 * Logical operator or serves as a wrapper for or operation.
 *
 */
exports.or = (...rules) => {
  return new rules_1.RuleOr(rules)
}
/**
 *
 * @param rule
 *
 * Logical operator not serves as a wrapper for not operation.
 *
 */
exports.not = rule => {
  return new rules_1.RuleNot(rule)
}
/**
 *
 * Allow queries.
 *
 */
exports.allow = new rules_1.RuleTrue()
/**
 *
 * Deny queries.
 *
 */
exports.deny = new rules_1.RuleFalse()
//# sourceMappingURL=constructors.js.map
