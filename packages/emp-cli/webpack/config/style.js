const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/
// const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const {getPaths} = require('../../helpers/paths')
// const {args} = require('commander')
// const paths = getPaths()
module.exports = (env, config, args) => {
  const isDev = env === 'development'
  const localIdentName = isDev ? '[path][name]-[local]-[hash:base64:5]' : '_[hash:base64:7]' //正式环境 _ 解决大部分命名冲突问题
  //
  const getStyleLoader = (modules = false, preProcessor = {}) => {
    //
    // let publicPath = config.output.get('publicPath')
    // publicPath = publicPath !== 'auto' ? publicPath : '/'
    // const styleloaderOption = isDev ? {} : {publicPath} // 解决 MiniCssExtractPlugin 对 webpack 5 pulblicPath=auto 导致的冲突问题
    //
    return {
      style: {
        // loader: require.resolve('style-loader'),//
        // loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
        loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        // options: styleloaderOption,
        /* options: {
          publicPath: (resourcePath, context) => {
            const rl = path.relative(path.dirname(resourcePath), context)
            return path.relative(path.dirname(resourcePath), context) + '/'
          },
        }, */
        options: {},
      },
      css: {
        loader: 'css-loader',
        options: {
          modules: modules ? {localIdentName} : modules,
        },
      },
      postcss: {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            hideNothingWarning: true,
            /* plugins: [
              [
                require('cssnano'),
                {
                  preset: [
                    'default',
                    {
                      discardComments: {
                        removeAll: true,
                      },
                    },
                  ],
                },
              ],
            ], */
          },
        },
      },
      ...preProcessor,
    }
  }
  const conf = {
    module: {
      rule: {
        css: {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: {
            ...getStyleLoader(),
          },
        },
        cssModule: {
          test: cssModuleRegex,
          // exclude: cssRegex,
          use: {
            ...getStyleLoader(true),
          },
        },
        sassModule: {
          test: sassModuleRegex,
          // exclude: sassRegex,
          use: {
            ...getStyleLoader(true, {
              sass: {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                  sourceMap: env === 'development',
                },
              },
            }),
          },
        },
        sass: {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: {
            ...getStyleLoader(false, {
              sass: {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                  sourceMap: env === 'development',
                },
              },
            }),
          },
        },
        less: {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: {
            ...getStyleLoader(false, {
              less: {
                loader: 'less-loader',
                options: {
                  lessOptions: {javascriptEnabled: true},
                },
              },
            }),
          },
        },
        lessModule: {
          test: lessModuleRegex,
          // exclude: lessRegex,
          use: {
            ...getStyleLoader(true, {
              less: {
                loader: 'less-loader',
                /* options: {
                lessOptions: {javascriptEnabled: true},
              }, */
              },
            }),
          },
        },
      },
    },
  }
  //=============== css min
  if (!isDev) {
    if (args.minify === true) {
      config.optimization.minimizer('CssMinimizerPlugin').use(CssMinimizerPlugin, [
        {
          parallel: true,
          // sourceMap: false,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: {removeAll: true},
              },
            ],
          },
        },
      ])
    }
    config.plugin('MiniCssExtractPlugin').use(MiniCssExtractPlugin, [
      {
        ignoreOrder: true,
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        /**
          experimentalUseImportModule
          https://github.com/webpack-contrib/mini-css-extract-plugin#experimentalUseImportModule
          Use an experimental webpack API to execute modules instead of child compilers.
          This improves performance and memory usage a lot, but isn't as stable as the normal approach.
          When combined with experiments.layers, this adds a layer option to the loader options to specify the layer of the css execution.
          You need to have at least webpack 5.33.2.
         */
        // experimentalUseImportModule: true,
      },
    ])
  }
  //===============
  config.merge(conf)
}
