module.exports = function(w) {
  return {
    files: [
      'src/**/*.ts',
      'test/mocks/*.ts',
    ],

    tests: [
      'test/all/*.ts'
    ],
    env: {
      type: 'node'
    },
    compilers: {
      '**/*.ts': w.compilers.typeScript({ module: 'commonjs' })
    }
  };
};
