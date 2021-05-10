module.exports = {
  devServer: {
    port: 9008,
    open: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    hotOnly: false,
    disableHostCheck: true,
    // // 关闭eslint
    // lintOnSave: false
    // headers: { "Access-Control-Allow-Origin": "*" },
    // hotOnly: false,
    // disableHostCheck: true,
    // 解决运行时控制台一直报【WDS】Disconnect
  }
};
