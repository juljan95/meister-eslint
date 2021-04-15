/* eslint-disable internal-rules/consistent-docs-url */
/**
 * @fileoverview just for practice
 * @author Julian
 */
"use strict";


//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow unnecessary semicolons",
            category: "Possible Errors",
            recommended: true
        },
        fixable: "code",
        schema: [{
            type: "object",
            properties: {
                ignoreChainWithDepth: {
                    type: "integer",
                    minimum: 1,
                    maximum: 10,
                    default: 2
                }
            }
        }],
        messages: {
            expected: "Expected a linebreak before `{{nodeName}}` expression.",
            unexpected: "Expected no linebreak before this expression."
        }
    },

    create(context) {
        // eslint-disable-next-line no-console
        // console.log(context);

        // variables should be defined here
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
         * Gets the text of a node
         * @param {ASTNode} node A MemberExpression node to analyze
         * @returns {ASTNode} The prefix of the node.
         */
        function getNonCallChild(node) {
            return node.object.type === "CallExpression" ? node.object.callee : node.object;
        }

        /**
         * Gets the chaining depth and parent node of the provided node
         * @param {ASTNode} node A MemberExpression node to analyze
         * @returns {Object} The prefix of the node.
         */
        function analyzeNode(node) {
            const lineBreak = node.loc.end
                .line !== node.object.loc
                .end
                .line;
            let depth = 0;
            let current = node;

            while (current && current.type === "MemberExpression") {
                depth++;

                current = getNonCallChild(current);
            }

            if (depth > ignoreChainWithDepth && !lineBreak) {
                const text = getText(node);
                const firstToken = sourceCode.getTokenAfter(node.object);

                context.report({
                    node,
                    messageId: "expected",
                    data: {
                        nodeName: text
                    },
                    type: "No Linebreak",
                    fix(fixer) {
                        return fixer.insertTextBefore(firstToken, "\n");
                    }
                });
            }

            return { current, depth };
        }

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            MemberExpression: analyzeNode

            // give me methods

        };
    }
};
