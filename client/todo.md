- 回收站逻辑梳理

- 调用子组件ref实现失败!

- 原生js
- 关于width 100%
- sessionStorage跨标签
- text-overflow总结

- cookie跨域

- 服务器部署踩坑, 跨域与代理
- 安全

- 图片上传?md
- 重温网页渲染过程, 重绘重排, css世界
- 原生的h5-history


- 登录后重定向回原来的页面?


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
