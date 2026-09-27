const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

/**
 * AST Safety Engine
 * Parses LLM-generated React component code into an Abstract Syntax Tree (AST),
 * validates it against security policies, sanitizes dangerous nodes,
 * and outputs compiled safe code string.
 */

const FORBIDDEN_IDENTIFIERS = new Set([
  'eval',
  'Function',
  'document',
  'window',
  'localStorage',
  'sessionStorage',
  'cookie',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'Worker',
  'process',
  'require'
]);

const ALLOWED_IMPORTS = new Set([
  'react',
  'lucide-react',
  'framer-motion'
]);

function inspectAndSanitizeAST(codeString) {
  const startTime = Date.now();
  let safe = true;
  const violations = [];
  let nodesAnalyzed = 0;

  let ast;
  try {
    ast = parser.parse(codeString, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
  } catch (parseError) {
    return {
      safe: false,
      code: null,
      error: `AST Parsing Failed: ${parseError.message}`,
      violations: [`Syntax error at line ${parseError.loc?.line || 1}: ${parseError.message}`],
      metrics: { executionTimeMs: Date.now() - startTime, nodesAnalyzed: 0 }
    };
  }

  // Traversal & Security Validation
  traverse(ast, {
    enter(path) {
      nodesAnalyzed++;
    },
    // Block dangerous global calls or variable references
    Identifier(path) {
      const { name } = path.node;
      if (FORBIDDEN_IDENTIFIERS.has(name)) {
        // Allow if it's a component property name like item.cookie or state identifier scoped
        const isProperty = path.parent.type === 'MemberExpression' && path.parent.property === path.node && !path.parent.computed;
        const isObjectKey = path.parent.type === 'ObjectProperty' && path.parent.key === path.node;
        
        if (!isProperty && !isObjectKey) {
          safe = false;
          violations.push(`Forbidden security token detected: '${name}' at line ${path.node.loc?.start.line}`);
        }
      }
    },
    // Block dangerous function calls
    CallExpression(path) {
      const callee = path.node.callee;
      if (callee.type === 'Identifier' && FORBIDDEN_IDENTIFIERS.has(callee.name)) {
        safe = false;
        violations.push(`Forbidden call expression '${callee.name}()' at line ${path.node.loc?.start.line}`);
      }
    },
    // Block import of non-approved modules
    ImportDeclaration(path) {
      const source = path.node.source.value;
      if (!ALLOWED_IMPORTS.has(source) && !source.startsWith('.')) {
        safe = false;
        violations.push(`Forbidden package import '${source}' at line ${path.node.loc?.start.line}`);
      }
    },
    // Prevent dynamic imports
    Import(path) {
      safe = false;
      violations.push(`Dynamic import() is strictly forbidden for security reasons`);
    }
  });

  if (!safe) {
    return {
      safe: false,
      code: null,
      error: `Security Validation Failed: ${violations.join('; ')}`,
      violations,
      metrics: { executionTimeMs: Date.now() - startTime, nodesAnalyzed }
    };
  }

  // Generate verified clean code
  const output = generator(ast, { retainLines: true }, codeString);

  return {
    safe: true,
    code: output.code,
    error: null,
    violations: [],
    metrics: {
      executionTimeMs: Date.now() - startTime,
      nodesAnalyzed,
      securityChecksPassed: true
    }
  };
}

module.exports = {
  inspectAndSanitizeAST
};
