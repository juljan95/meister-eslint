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

        // Ternary should not force any linebreaks
        "test = (Test.is().this().a().error()) ? nope : itShouldNot;",
        "test = Test.is().this().a().error() ? nope : itShouldNot;",
        "test = nope ? Test.is().this().a().error() : itShouldNot;",
        "test = nope ? itShouldNot  : Test.is().this().a().error();",


        // If conditions as well
        "if(Test.am().i().an().error()){ console.log(test)}",
        "if(top.test().map().isJust()){ something} else if(top.test().map().isJust()){}"

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "Test.map().filter().value()",
            output: "Test\n.map()\n.filter()\n.value()",
            errors: [{
                messageId: "expected",
                data: {
                    callText: "map()",
                    chainings: 3,
                    nodeCode: "Test.map().filter().value()"
                }
            },
            {
                messageId: "expected",
                data: {
                    callText: "filter()",
                    chainings: 3,
                    nodeCode: "Test.map().filter().value()"
                }
            },
            {
                messageId: "expected",
                data: {
                    callText: "value()",
                    chainings: 3,
                    nodeCode: "Test.map().filter().value()"
                }
            }]
        },
        {
            code: "Test.map.filter().value().log()",
            output: "Test.map\n.filter()\n.value()\n.log()",
            errors: [{
                messageId: "expected",
                data: {
                    callText: "filter()",
                    chainings: 3,
                    nodeCode: "Test.map.filter().value().log()"
                }
            }, {
                messageId: "expected",
                data: {
                    callText: "value()",
                    chainings: 3,
                    nodeCode: "Test.map.filter().value().log()"
                }
            },
            {
                messageId: "expected",
                data: {
                    callText: "log()",
                    chainings: 3,
                    nodeCode: "Test.map.filter().value().log()"
                }
            }]
        },
        {
            code: "Test\n.map().filter().value()",
            output: "Test\n.map()\n.filter()\n.value()",
            errors: [{
                messageId: "expected",
                data: {
                    callText: "filter()",
                    chainings: 3,
                    nodeCode: "Test\n.map().filter().value()"
                }
            },
            {
                messageId: "expected",
                data: {
                    callText: "value()",
                    chainings: 3,
                    nodeCode: "Test\n.map().filter().value()"
                }
            }]
        },
        {
            code: "Test\n.map().filter()\n.value()",
            output: "Test\n.map()\n.filter()\n.value()",
            errors: [
                {
                    messageId: "expected",
                    data: {
                        callText: "filter()",
                        chainings: 3,
                        nodeCode: "Test\n.map().filter()\n.value()"
                    }
                }]
        },
        {
            code: "if(test){Test\n.map().filter()\n.value()}",
            output: "if(test){Test\n.map()\n.filter()\n.value()}",
            errors: [
                {
                    messageId: "expected",
                    data: {
                        callText: "filter()",
                        chainings: 3,
                        nodeCode: "Test\n.map().filter()\n.value()"
                    }
                }]
        }
    ]
});
