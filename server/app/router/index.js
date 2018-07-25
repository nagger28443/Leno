const Router = require('koa-router')
const blogService = require('../service/blogService')
const draftService = require('../service/draftService')
const adminService = require('../service/adminService')
const statisticsService = require('../service/statisticsService')
const labelService = require('../service/labelService')
const archiveService = require('../service/archiveService')
const categoryService = require('../service/categoryService')

const router = new Router()

router.options('/*', async (ctx) => {
  const { headers } = ctx.request
  ctx.set('Access-Control-Allow-Methods', headers['access-control-request-method'])
  ctx.set('Access-Control-Allow-Origin', headers.origin)
  ctx.set('Access-Control-Allow-Headers', '*')
  ctx.status = 204
})

// 获取博客列表
router.get('/blog/list', blogService.getBlogList)
// 获取博客
router.get('/blog', blogService.getBlog)
// 添加博客
router.post('/blog', blogService.addBlog)
// 修改博客
router.put('/blog', blogService.updateBlog)
// 删除博客
router.del('/blog', blogService.deleteBlog)


// 获取草稿列表
router.get('/draft/list', draftService.getDraftList)
// 添加草稿
router.get('/draft', draftService.getDraft)
// 获取草稿
router.post('/draft', draftService.addDraft)
// 修改草稿
router.put('/draft', draftService.updateDraft)
// 删除草稿
router.del('/draft', draftService.deleteDraft)

// 获取回收站文章列表
router.get('/recycle')

// 获取分类列表
router.get('/category/list', categoryService.getCategoryList)
// 修改分类名称
router.put('/category', categoryService.updateCategory)

// 获取归档列表
router.get('/archive/list', archiveService.getArchiveList)

// 获取标签列表
router.get('/label/list', labelService.getLabelList)

// 获取统计信息
router.get('/statistics', statisticsService.getHomeStatistics)

// 登录
router.post('/admin/login', adminService.login)

module.exports = router
