import path from 'path';
import type { Configuration } from 'webpack';
import 'webpack-dev-server';
import Dotenv from 'dotenv-webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import type { RuntimeCacheRule } from 'workbox-webpack-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';

// @types/workbox-webpack-plugin の定義で関数が指定できないため型を無視させている
/* eslint-disable @typescript-eslint/ban-ts-comment */
// '/' アクセス時に index.html をキャッシュさせる設定
const indexHtmlCacheRuleExt: {
  urlPattern: (options: {
    url?: { origin: string; pathname: string };
  }) => boolean;
  handler: (options: { event?: unknown }) => unknown;
} = {
  urlPattern: ({ url }) => {
    // @ts-ignore
    if (!url || url.origin !== location.origin) {
      return false;
    }
    return url.pathname === '/';
  },
  handler: ({ event }) => {
    // @ts-expect-error
    // eslint-disable-next-line new-cap
    const strategy = new workbox_strategies_NetworkFirst();
    return strategy.handle({ request: '/index.html', event });
  },
};
// @ts-expect-error
const indexHtmlCacheRule = indexHtmlCacheRuleExt as RuntimeCacheRule;
/* eslint-enable @typescript-eslint/ban-ts-comment */

const isProduction: boolean = process.env.NODE_ENV === 'production';

const fileName = '[name].[hash]';

const distDir = path.resolve(__dirname, 'dist');

const appTitle = isProduction
  ? '三国志大戦デッキシミュレーター'
  : '三国志大戦デッキシミュレーター(local)';

const config: Configuration = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    deck: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: distDir,
    filename: `scripts/${fileName}.js`,
  },
  devtool: isProduction ? false : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            // ライセンスは別で出力しているためjsからは除去
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  plugins: [
    new Dotenv({ systemvars: true, defaults: true }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: isProduction
        ? [
            'scripts',
            'styles',
            'icons',
            'service-worker.js',
            'workbox-*.js',
            'manifest.webmanifest',
          ]
        : [],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/icons/'),
          to: 'icons/',
        },
        {
          from: path.resolve(__dirname, 'src/manifest.webmanifest'),
          to: '.',
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `styles/${fileName}.css`,
    }),
    new HtmlWebpackPlugin({
      title: appTitle,
      template: path.resolve(__dirname, 'src/index.html.ejs'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProduction,
        removeComments: isProduction,
      },
      // headに入れる予定だったがcssより前にjsが埋め込まれてしまうので一旦bodyに戻す
      inject: 'body',
      scriptLoading: 'defer',
    }),
    new GenerateSW({
      swDest: 'service-worker.js',
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      exclude: [/\.map$/i, /\.LICENSE\.txt$/i, 'index.html'],
      runtimeCaching: [
        {
          urlPattern: '/index.html',
          handler: 'NetworkFirst',
        },
        indexHtmlCacheRule,
        {
          urlPattern: /\.md5$/i,
          handler: 'NetworkFirst',
        },
        {
          urlPattern:
            /^data\/img\/(:?avatar|card_small|strat_range)\/.*\.(:?jpg|png|gif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'data/img',
            expiration: {
              maxAgeSeconds: 3 * 86400,
            },
          },
        },
        {
          urlPattern: /^https:\/\/3594t\.net\/img\/.*\.(:?jpg|png|gif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: '3594t.net/img',
            expiration: {
              maxAgeSeconds: 3 * 86400,
            },
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    static: {
      directory: path.resolve(__dirname, 'src'),
    },
  },
};

export default config;
