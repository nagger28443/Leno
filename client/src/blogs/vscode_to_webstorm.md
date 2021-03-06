# vscode转webstorm踩坑记

2018-07-20

## 由来
从写前端开始就接收了众网友的安利，一直在使用vscode作为编辑器。期间遇到很多问题，积累到尽头终于爆发了。万分怀念写Java时使用的Idea的美好体验，于是打开JetBrains家网站看他们有没有提供前端用的编辑器。WebsSorm，早就见人用过，没想到竟是JetBrains出品，决定试一试。

## vscode遇到的问题
总结一下这多半年来在vscode使用中遇到的最令人难受的问题：
- 跨文件重构：从最初完全不支持到后来支持了一些，但还是很难用
- 导入文件的bug：经常遇到有时导入文件敲错了路径，然后整个编辑器就罢工了，所有的智能提示全部瘫痪，不得不重启编辑器
- 连续使用一段时间（经常是几个小时）后就开始卡顿，以及eslint自动格式化失效，到智能提示失效，最终不得不重启编辑器
- 最近的一次更新还导致代码段无法折叠，把人急得直挠头

最让人感到烦躁就还是智能提示时不时失效导致必须重启，代码写到一半被这种事情打断实在糟心。

## vscode到WebStorm配置踩坑
### 主题
第一件事就是选一个合适的主题了，根据个人爱好，需要以下特点：黑色背景，关键字颜色区分，代码与背景之间的颜色有足够大差别。选来选去，最后主题选择Matarial Darker，再调整一下字体、行高和字号就好了。
## 代码格式化
前端需要根据eslint的规则格式化代码，这样就需要配置eslint，这点似乎比vscode要麻烦。尤其是在公司时不知怎么装了个eslint插件，而非使用的编辑器自带的eslint配置，导致配置更加麻烦，还需要手动选择eslint和node路径。
选择eslint路径时踩了两个坑：
- 不支持中文路径，以前使用Idea就踩过这个坑，可惜忘性大，又踩了一遍，路径怎么都配不对。
- eslint可能是全局安装，也可能是本地安装。如果选了全局安装的eslint就倒霉了，总提示eslint的各种配置文件不存在（react，airbnb等）。从node_modules下选择本地的就好了。这点说起来就必须抨击一下eslint这个第三方插件了，使用编辑器自带的插件会自动配置好路径，完全不用操心的！
###文件自动保存导致webpack-dev-server不停地自动构建
这件事本来是很简单的，只需要关掉自动保存就好了。但我在配置后总是无效，伤透了脑筋。最后呢，某次重启编辑器之后就好了，心疼哪些被浪费的事件。配置真是一门玄学。
### 杂项
- rainbow bracket插件
- 为选用文本后添加括号或引号
- 热键、代码缩写配置
- 选项卡高度、目录树缩进都可以方便地配置，为本来就不够大的屏幕腾出宝贵的空间

## 尚未解决的问题
- eslint的warning在terminal中刷屏。vscode可以直接筛选掉warning，但WebStorm还没找到好的办法。
- eslint报错后在vscode中可以直接点击错误信息跳转到报错的位置，WebStorm还没找到解决方案。
- WebStorm的git工具感觉还是没有vscode+gitlense来的方便，在习惯习惯看吧。
## 总结
总的来说，编辑器就是干活的工具，差别有限。目前就总结出了这些换编辑器之后需要注意一些的小问题，剩下的在以后的继续使用中感受吧。
选一个顺手的编辑器，抓紧时间去搬砖吧。: )
