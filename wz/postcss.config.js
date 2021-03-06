module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      rootValue: 20,
      propList: ['*'],
      selectorBlackList: ['.van-stepper__minus', '.van-stepper__input', '.van-stepper__plus'],
      minPixelValue: 0
    }
  }
}
