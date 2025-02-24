import * as Yup from 'yup'
import { IRuleFunction, IRuleConstructorOptions, ShieldRule } from './types'
import {
  Rule,
  RuleAnd,
  RuleOr,
  RuleNot,
  RuleTrue,
  RuleFalse,
  InputRule,
  RuleChain,
} from './rules'
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
export declare const rule: (
  name?: string | IRuleConstructorOptions,
  options?: IRuleConstructorOptions,
) => (func: IRuleFunction) => Rule
/**
 *
 * Constructs a new InputRule based on the schema.
 *
 * @param schema
 */
export declare const inputRule: <T>(
  name: string | ((yup: typeof Yup) => Yup.Schema<T>),
  schema?: (yup: typeof Yup) => Yup.Schema<T>,
) => InputRule<T>
/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for and operation.
 *
 */
export declare const and: (...rules: ShieldRule[]) => RuleAnd
/**
 *
 * @param rules
 *
 * Logical operator and serves as a wrapper for and operation.
 *
 */
export declare const chain: (...rules: ShieldRule[]) => RuleChain
/**
 *
 * @param rules
 *
 * Logical operator or serves as a wrapper for or operation.
 *
 */
export declare const or: (...rules: ShieldRule[]) => RuleOr
/**
 *
 * @param rule
 *
 * Logical operator not serves as a wrapper for not operation.
 *
 */
export declare const not: (rule: ShieldRule) => RuleNot
/**
 *
 * Allow queries.
 *
 */
export declare const allow: RuleTrue
/**
 *
 * Deny queries.
 *
 */
export declare const deny: RuleFalse
