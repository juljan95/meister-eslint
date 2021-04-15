/**
 * @fileoverview just for practice
 * @author Julian
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/julian-method-member-chaining"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("julian-method-member-chaining", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "_\n.chain({}).memberexp.map(foo).filter(bar).value().log({title: 'test'});",
            errors: [{
                messageId: "expected",
                data: {
                    nodeName: "log({title: 'test'})"
                }
            }, {
                messageId: "expected",
                data: {
                    nodeName: "value()"
                }
            },
            {
                messageId: "expected",
                data: {
                    nodeName: "filter(bar)"
                }
            },
            {
                messageId: "expected",
                data: {
                    nodeName: "map(foo)"
                }
            }]
        }, {
            code: "_.test21({}).test22.test23(foo)\n.test24(bar)\n.test25();",
            errors: [{
                messageId: "expected",
                data: {
                    nodeName: "test23(foo)"
                }
            }]
        }

    ]
});
