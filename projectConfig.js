const projectConfig = {
  /**
   * 开发时客户端webpack-dev-server端口号
   */
  clientServerPort: '7777',
  /**
   * tomcat服务端端口号
   */
  serverPort: '8090',
  /**
   * 服务端主机地址 需要根据实际部署虚机的真实地址修改
   */
  serverHost: '127.0.0.1',
  /**
   * 如果没有直接进登录界面 而是因为没有登录
   * 从别的页面跳转进登录界面
   * 那么登录完成后会自动跳转到进入的页面
   * 下面这个配置 配置的是直接进入登录页面 登陆后默认跳转路由
   */
  defaultRouteOnLogin: '/admin',
  /**
   * 无需登录时 默认跳转路由
   */
  defaultRoute: '/',
  /* 项目名称 方便在tomcat目录下存放 */
  projectName: 'Leno',
}

module.exports = projectConfig
