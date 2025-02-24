'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const graphql_1 = require('graphql')
const utils_1 = require('./utils')
const validation_1 = require('./validation')
/**
 *
 * @param options
 *
 * Generates a middleware function from a given rule and
 * initializes the cache object in context.
 *
 */
function generateFieldMiddlewareFromRule(rule, options) {
  async function middleware(resolve, parent, args, ctx, info) {
    // Cache
    if (!ctx) {
      ctx = {}
    }
    if (!ctx._shield) {
      ctx._shield = {
        cache: {},
        hashFunction: options.hashFunction,
      }
    }
    // Execution
    try {
      const res = await rule.resolve(parent, args, ctx, info, options)
      if (res === true) {
        return resolve(parent, args, ctx, info)
      } else if (res === false) {
        return options.fallbackError
      } else {
        return res
      }
    } catch (err) {
      if (options.debug) {
        throw err
      } else if (options.allowExternalErrors) {
        return err
      } else {
        return options.fallbackError
      }
    }
  }
  if (utils_1.isRule(rule) && rule.extractFragment()) {
    return {
      fragment: rule.extractFragment(),
      resolve: middleware,
    }
  }
  if (utils_1.isLogicRule(rule)) {
    return {
      fragments: rule.extractFragments(),
      resolve: middleware,
    }
  }
  return middleware
}
/**
 *
 * @param type
 * @param rules
 * @param options
 *
 * Generates middleware from rule for a particular type.
 *
 */
function applyRuleToType(type, rules, options) {
  if (utils_1.isRuleFunction(rules)) {
    /* Apply defined rule function to every field */
    const fieldMap = type.getFields()
    const middleware = Object.keys(fieldMap).reduce((middleware, field) => {
      return Object.assign({}, middleware, {
        [field]: generateFieldMiddlewareFromRule(rules, options),
      })
    }, {})
    return middleware
  } else if (utils_1.isRuleFieldMap(rules)) {
    /* Apply rules assigned to each field to each field */
    const fieldMap = type.getFields()
    /* Extract default type wildcard if any and remove it for validation */
    const defaultTypeRule = rules['*']
    delete rules['*']
    /* Validation */
    const fieldErrors = Object.keys(rules)
      .filter(type => !Object.prototype.hasOwnProperty.call(fieldMap, type))
      .map(field => `${type.name}.${field}`)
      .join(', ')
    if (fieldErrors.length > 0) {
      throw new validation_1.ValidationError(
        `It seems like you have applied rules to ${fieldErrors} fields but Shield cannot find them in your schema.`,
      )
    }
    /* Generation */
    const middleware = Object.keys(fieldMap).reduce(
      (middleware, field) =>
        Object.assign({}, middleware, {
          [field]: generateFieldMiddlewareFromRule(
            utils_1.withDefault(defaultTypeRule || options.fallbackRule)(
              rules[field],
            ),
            options,
          ),
        }),
      {},
    )
    return middleware
  } else {
    /* Apply fallbackRule to type with no defined rule */
    const fieldMap = type.getFields()
    const middleware = Object.keys(fieldMap).reduce(
      (middleware, field) =>
        Object.assign({}, middleware, {
          [field]: generateFieldMiddlewareFromRule(
            options.fallbackRule,
            options,
          ),
        }),
      {},
    )
    return middleware
  }
}
/**
 *
 * @param schema
 * @param rule
 * @param options
 *
 * Applies the same rule over entire schema.
 *
 */
function applyRuleToSchema(schema, rule, options) {
  const typeMap = schema.getTypeMap()
  const middleware = Object.keys(typeMap)
    .filter(type => !graphql_1.isIntrospectionType(typeMap[type]))
    .reduce((middleware, typeName) => {
      const type = typeMap[typeName]
      if (graphql_1.isObjectType(type)) {
        return Object.assign({}, middleware, {
          [typeName]: applyRuleToType(type, rule, options),
        })
      } else {
        return middleware
      }
    }, {})
  return middleware
}
/**
 *
 * @param rules
 * @param wrapper
 *
 * Converts rule tree to middleware.
 *
 */
function generateMiddlewareFromSchemaAndRuleTree(schema, rules, options) {
  if (utils_1.isRuleFunction(rules)) {
    /* Applies rule to entire schema. */
    return applyRuleToSchema(schema, rules, options)
  } else {
    /**
     * Checks type map and field map and applies rules
     * to particular fields.
     */
    const typeMap = schema.getTypeMap()
    /* Validation */
    const typeErrors = Object.keys(rules)
      .filter(type => !Object.prototype.hasOwnProperty.call(typeMap, type))
      .join(', ')
    if (typeErrors.length > 0) {
      throw new validation_1.ValidationError(
        `It seems like you have applied rules to ${typeErrors} types but Shield cannot find them in your schema.`,
      )
    }
    // Generation
    const middleware = Object.keys(typeMap)
      .filter(type => !graphql_1.isIntrospectionType(typeMap[type]))
      .reduce((middleware, typeName) => {
        const type = typeMap[typeName]
        if (graphql_1.isObjectType(type)) {
          return Object.assign({}, middleware, {
            [typeName]: applyRuleToType(type, rules[typeName], options),
          })
        } else {
          return middleware
        }
      }, {})
    return middleware
  }
}
/**
 *
 * @param ruleTree
 * @param options
 *
 * Generates middleware from given rules.
 *
 */
function generateMiddlewareGeneratorFromRuleTree(ruleTree, options) {
  const generator = schema => {
    const middleware = generateMiddlewareFromSchemaAndRuleTree(
      schema,
      ruleTree,
      options,
    )
    return middleware
  }
  return generator
}
exports.generateMiddlewareGeneratorFromRuleTree = generateMiddlewareGeneratorFromRuleTree
//# sourceMappingURL=generator.js.map
