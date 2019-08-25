module.exports = {
  name: 'sunday',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/sunday/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
