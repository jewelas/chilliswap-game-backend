module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "globals": {
        "process": true,
        "Buffer": true,
        "__dirname": true
    },
    "rules": {
        "no-duplicate-imports": 2,
        "no-irregular-whitespace": 2,
        "no-self-assign": 2,
        "no-self-compare": 2,
        "no-unreachable-loop": 2,
        "no-unused-vars": 2,
        "use-isnan": 2,
        "class-methods-use-this": 2,
        "curly": 2,
        "default-case-last": 2,
        "eqeqeq": 2,
        "no-confusing-arrow": 2,
        "no-else-return": 2,
        "no-eq-null": 2,
        "no-extra-semi": 2,
        "no-lone-blocks": 2,
        "no-lonely-if": 2,
        "no-mixed-operators": 2,
        "no-return-await": 2,
        "no-sequences": 2,
        "no-undef-init": 2,
        "no-var": 2,
        "prefer-const": 2,
        "require-await": 2,
        "brace-style": 2,
        "keyword-spacing": 2,
        "no-dupe-else-if": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-import-assign": 2,
        "no-unreachable": 2,
        // "consistent-return":2,
        "block-spacing": 2,
        "key-spacing": 2,
        
    }
}
