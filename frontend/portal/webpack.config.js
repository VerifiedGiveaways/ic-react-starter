const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const backendFolder = "Backend-mo";

function getCanisterEnvVariables(projectPath) {
  let localCanisters, prodCanisters;

  try {
    localCanisters = require(path.resolve(
      ...projectPath,
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve(...projectPath, "canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  return Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    if (canisterName !== "__Candid_UI") {
      prev[canisterName.toUpperCase() + "_CANISTER_ID"] =
        canisterDetails[network];
    }
    return prev;
  }, {});
}

function initCanisterEnv() {
  let projectPaths = [
    [""], //current project
    ["..", "..", "frontend", "public"],
    ["..", "..", backendFolder, "accounts"],
    ["..", "..", backendFolder, "content"],
  ];

  const result = Object.assign(
    ...projectPaths.flatMap((p) => getCanisterEnvVariables(p))
  );
  console.log("CANISTER ENV VARIABLES", result);
  return result;
}

const canisterEnvVariables = initCanisterEnv();

const isDevelopment = process.env.NODE_ENV !== "production";

const asset_entry = path.join("src", "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    // The frontend.entrypoint points to the HTML file for this build, so we need
    // to replace the extension to `.tsx`.
    index: path.join(__dirname, asset_entry).replace(/\.html$/, ".tsx"),
  },
  devtool: isDevelopment ? "source-map" : false,
  // optimization: {
  //   minimize: !isDevelopment,
  //   minimizer: [new TerserPlugin()],
  // },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },

  module: {
    rules: [
      { test: /\.(js|ts)x?$/i, loader: "ts-loader" },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          //resolve background-image urls
          {
            loader: "resolve-url-loader",
            options: { sourceMap: true },
          },
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: "asset",
      },
    ],
  },

  plugins: [
    new Dotenv({
      path: `./.env${isDevelopment ? ".local" : ""}`,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, asset_entry),
      cache: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "assets"),
          to: path.join(__dirname, "dist"),
        },
      ],
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      ...canisterEnvVariables,
    }),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
  ],

  // proxy /api to port 8000 during development
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    hot: true,
    watchFiles: [path.resolve(__dirname, "src")],
    liveReload: true,
    historyApiFallback: true,
  },
};
