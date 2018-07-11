import { join } from "path";

const include = join(__dirname, "src");

export default {
  entry: "./src/index",
  output: {
    path: join(__dirname, "dist"),
    libraryTarget: "umd",
    library: "sweetlyHotCartoon"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
