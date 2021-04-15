/**
 * @fileoverview Enforces our special newline rules for Method-Chaining
 * @author Julian Janisch
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/method-chaining"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("method-chaining", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "Test.map().filter().value()",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
