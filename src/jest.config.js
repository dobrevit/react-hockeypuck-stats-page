export const transform = {
  '^.+\\.(js|jsx)$': 'babel-jest',
};
export const transformIgnorePatterns = ['/node_modules/(?!axios)'];
  