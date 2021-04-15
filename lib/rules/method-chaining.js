/* eslint-disable internal-rules/consistent-docs-url */
/**
 * @fileoverview Enforces Meisterlabs special newline rules for Method-Chaining
 * @author Julian Janisch
 */
"use strict";


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",
        docs: {
            description: "enforce - Enforces our special newline rules for Method-Chaining",
            category: "Fill me in",
            recommended: false
        },
        fixable: "whitespace", // or "code" or "whitespace"
        schema: [

            // fill in your schema
        ],
        messages: {
            expected: "'.{{callText}}' is part of a {{chainings}} methods chain and should therefore be prepended by a newline ('{{nodeCode}}')."
        }
    },

    create(context) {

        const options = context.options[0] || {},
            ignoreChainWithDepth = options.ignoreChainWithDepth || 2;

        const sourceCode = context.getSourceCode();

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        /**
         * Gets arguments of a node.
         * @param {ASTNode} node A MemberExpression node to analyze
         * @returns {string} The prefix of the node.
         */
        function getCallArgumentsText(node) {
            if (node.type !== "CallExpression") {
                return null;
            }
            const args = [];

            node.arguments.forEach(element => {
                args.push(sourceCode.getText(element));
            });

            return args;
        }

        /**
         * Gets the text of a node
         * @param {ASTNode} node A MemberExpression node to analyze
         * @returns {string} The prefix of the node.
         */
        function getText(node) {
            const parent = node.parent;
            const property = node.type === "MemberExpression" ? node.property : node.callee.property;
            const text = sourceCode.getText(property);

            const args = getCallArgumentsText(parent);

            return parent.type !== "CallExpression" ? text : `${text}(${args})`;
        }

        /**
         * Verifies if MemberExpression node is a Call
         * @param {ASTNode} node MemberExpression node to analyze
         * @returns {boolean} if node is a call expression or not.
         */
        function isMethodCall(node) {
            return node.type === "MemberExpression" &&
                node.parent.type === "CallExpression" &&
                node.parent.callee === node &&
                node.property.type === "Identifier";
        }

        /**
         * Iterates Upwards in tree and checks for following function calls
         * @param {ASTNode} node node to check location
         * @returns {integer} number of calls following the node
         */
        function methodsAfter(node) {
            let current = node;
            let chainings = 0;

            while (isMethodCall(current)) {
                chainings += 1;
                current = current.parent.parent; // Skip EallExpression go directly to next MemberExpression
            }

            return { methodCallsAfter: chainings, topNode: current };
        }

        /**
         * Iterates Downwards in tree and checks for preceeding function calls
         * @param {ASTNode} node  node to check location
         * @returns {integer} number of calls following the node
         */
        function methodsBefore(node) {
            let current = node;
            let chainings = 0;

            while (isMethodCall(current) && current.object.type === "CallExpression") {
                chainings += 1;
                current = current.object.callee;
            }

            return { methodCallsBefore: chainings, bottomNode: current };
        }

        /**
         * Verifies if node is condition of an if statement, in which case we do not enforce
         * @param {ASTNode} node the node to inspect
         * @returns {boolean} is condition (true/false)
         */
        function isIfCondition(node) {
            if (!node.parent) {
                return false;
            }
            if (node.parent.type === "IfStatement" && node.parent.condition === node) {
                return true;
            }
            return false;
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            MemberExpression(node) {
                const {
                    methodCallsAfter,
                    topNode
                } = methodsAfter(node);

                const {
                    methodCallsBefore
                } = methodsBefore(node);

                const isInsideTernaryExpression = topNode.parent
                    ? topNode.parent.type === "ConditionalExpression"
                    : false;

                const isInsideIfCondition = isIfCondition(topNode);

                const totalChainings = methodCallsBefore + methodCallsAfter;

                if (totalChainings > ignoreChainWithDepth && !isInsideTernaryExpression && !isInsideIfCondition) {
                    const text = getText(node);
                    const firstToken = sourceCode.getTokenAfter(node.object);

                    context.report({
                        node,
                        messageId: "expected",
                        data: {
                            callText: text,
                            chainings: totalChainings,
                            nodeCode: sourceCode.getText(topNode)
                        },
                        type: "No Linebreak",
                        fix(fixer) {
                            return fixer.insertTextBefore(firstToken, "\n");
                        }
                    });
                }
            }
        };
    }
};
