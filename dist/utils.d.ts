import { ShieldRule, ILogicRule, IRuleFieldMap, IRule } from './types'
/**
 *
 * @param x
 *
 * Makes sure that a certain field is a rule.
 *
 */
export declare function isRule(x: any): x is IRule
/**
 *
 * @param x
 *
 * Makes sure that a certain field is a logic rule.
 *
 */
export declare function isLogicRule(x: any): x is ILogicRule
/**
 *
 * @param x
 *
 * Makes sure that a certain field is a rule or a logic rule.
 *
 */
export declare function isRuleFunction(x: any): x is ShieldRule
/**
 *
 * @param x
 *
 * Determines whether a certain field is rule field map or not.
 *
 */
export declare function isRuleFieldMap(x: any): x is IRuleFieldMap
/**
 *
 * @param obj
 * @param func
 *
 * Flattens object of particular type by checking if the leaf
 * evaluates to true from particular function.
 *
 */
export declare function flattenObjectOf<edge>(
  obj: object,
  func: (x: any) => boolean,
): edge[]
/**
 *
 * Returns fallback is provided value is undefined
 *
 * @param fallback
 */
export declare function withDefault<T>(fallback: T): (value: T | undefined) => T
