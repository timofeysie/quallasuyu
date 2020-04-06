module.exports = {
  name: 'customer-portal',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/customer-portal/',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
