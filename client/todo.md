<!-- - 文章收起后滚动bug? -->
- labels与category一样提供列表
- 回收站编辑,恢复逻辑梳理
- promise.then->async
- 控制台博客管理,分页
- 各接口更新统计数据
- 防止重复请求
- context
- 启动时检查数据库的可用性
- snapshot?
- 原生js
- 关于width 100%
- history.replace,link
- 登录后重定向回原来的页面?
- sessionStorage跨标签
- text-overflow总结

- cookie跨域
- draft, is_deleted, stick_top, private

- 服务器部署踩坑, 跨域与代理
- 安全

- 图片上传?md
- 重温网页渲染过程, 重绘重排, css世界
- 原生的h5-history
-
- 文章内样式细节实现



 toBase64 = file => {
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      this.setState({ img: canvas.toDataURL('image/png') })
    }
  }
  handleImgChange = e => {
    this.toBase64(e.target.files[0])
  }

     <div
            style={{
              width: 200,
              height: 200,
              position: 'relative',
              border: '1px solid',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <img src={this.state.img} alt="" />
            <input
              onChange={this.handleImgChange}
              type="file"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                zIndex: 10,
              }}
            />
          </div>
