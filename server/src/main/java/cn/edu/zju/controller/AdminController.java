package cn.edu.zju.controller;

import cn.edu.zju.common.constant.Resources;
import cn.edu.zju.controller.vo.BaseResult;
import cn.edu.zju.dal.entity.others.AdminEntity;
import cn.edu.zju.interceptor.auth.Authority;
import cn.edu.zju.service.AdminService;
import cn.edu.zju.service.InvAccountService;
import cn.hyperchain.common.log.LogInterceptor;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.edu.zju.common.constant.RoleType.ADMIN;
import static cn.edu.zju.common.constant.RoleType.SUPER_ADMIN;

/**
 * Created with IntelliJ IDEA.
 *
 * @author lyl
 * Date: 2017/12/13
 * <p>
 * <p>
 * 如果是普通管理员，注意校验token中的公钥
 */
@SuppressWarnings({"JavaDoc", "SpringAutowiredFieldsWarningInspection"})
@Api(value = "Admin", description = "管理员账户管理", position = 81)
@Controller
@RequestMapping("/v1/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @LogInterceptor
    @ApiOperation(value = "添加管理员账户",
            notes = "同时分配管理员权限<br>" +
                    "权限要求:超级管理员;<br>" +
                    "返回内容:data为空<br>" +
                    "创建失败返回错误代码, 账户名不合法ACCOUNT_NAME_ILLEGAL,密码不合法PASSWORD_ILLEGAL,账户已存在ACCOUNT_ALREADY_EXIST<br>" +
                    "角色码已存在ROLE_CODE_ALREADY_EXIST,角色名已存在ROLE_NAME_ALREADY_EXIST,资源不存在RESOURCE_NOT_EXIST")
    @ResponseBody
    @RequestMapping(value = "", method = RequestMethod.POST)
    @Authority(role = SUPER_ADMIN)
    public BaseResult<Object> addAccount(
            @ApiParam(value = "token", required = true) @RequestParam("token") String token,
            @ApiParam(value = "用户名", required = true) @RequestParam("accountName") String accountName,
            @ApiParam(value = "密码", required = true) @RequestParam("password") String password,
            @ApiParam(value = "使用者姓名", required = true) @RequestParam("userName") String userName,
            @ApiParam(value = "使用者联系方式", required = true) @RequestParam("userContact") String userContact,
            @ApiParam(value = "用户角色码", required = true) @RequestParam("roleCode") int roleCode,
            @ApiParam(value = "用户角色名", required = true) @RequestParam("roleName") String roleName,
            @ApiParam(value = "权限", required = true) @RequestParam(value = "resources") String[] resources
    ) throws Exception {
        return adminService.addAccount(accountName, password, userName, userContact, roleCode, roleName, resources);

    }

    @Transactional
    @LogInterceptor
    @ApiOperation(value = "查看管理员列表",
            notes = "查看管理员列表<br>" +
                    "权限要求:超级管理员;<br>" +
                    "返回内容:data为List(AdminEntity)<br>" +
                    "页码不能小于1,PAGE_NO_ILLEGAL")
    @ResponseBody
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @Authority(role = SUPER_ADMIN)
    public BaseResult<List<AdminEntity>> getAccountList(
            @ApiParam(value = "token", required = true) @RequestParam("token") String token,
            @ApiParam(value = "页码", defaultValue = "1")
            @RequestParam(value = "pageNo", required = false, defaultValue = "1") Integer pageNo,
            @ApiParam(value = "账户状态") @RequestParam(value = "status", required = false, defaultValue = "0") Integer status
    ) {
        return adminService.getAccountList(pageNo, status);
    }

    @LogInterceptor
    @ApiOperation(value = "查看管理员信息",
            notes = "查看管理员信息;<br>" +
                    "权限要求:管理员;<br>" +
                    "返回内容:data为adminEntity对象;<br>" +
                    "INVALID_USER")
    @ResponseBody
    @RequestMapping(value = "", method = RequestMethod.GET)
    @Authority(role = ADMIN, resource = Resources.NONE, description = Resources.Description.PASS)
    public BaseResult<AdminEntity> getAccountById(
            @ApiParam(value = "token", required = true) @RequestParam("token") String token,
            @ApiParam(value = "管理员id", required = true) @RequestParam("id") Integer id) {
        return adminService.getAccountById(id);
    }

    @LogInterceptor
    @ApiOperation(value = "超级管理员删除管理员信息", notes = "超级管理员删除管理员信息<br>" +
            "权限要求:超级管理员;<br>" +
            "返回内容:data空;<br>" +
            "INVALID_USER")
    @ResponseBody
    @RequestMapping(value = "", method = RequestMethod.DELETE)
    @Authority(role = SUPER_ADMIN)
    public BaseResult<Object> deleteAccount(
            @ApiParam(value = "token", required = true) @RequestParam("token") String token,
            @ApiParam(value = "管理员id", required = true) @RequestParam("id") Integer id) {
        return adminService.deleteAccount(id);
    }


    @LogInterceptor
    @ApiOperation(value = "修改管理员角色和权限", notes = "修改管理员角色和权限<br>" +
            "权限要求:超级管理员;<br>" +
            "返回内容:data空;<br>" +
            "INVALID_USER")
    @ResponseBody
    @RequestMapping(value = "/resource", method = RequestMethod.PUT)
    @Authority(role = SUPER_ADMIN)
    public BaseResult<Object> modifyAccountInfo(
            @ApiParam(value = "token", required = true) @RequestParam("token") String token,
            @ApiParam(value = "管理员id", required = true) @RequestParam("id") Integer id,
            @ApiParam(value = "用户角色码", required = true) @RequestParam("roleCode") int roleCode,
            @ApiParam(value = "用户角色名", required = true) @RequestParam("roleName") String roleName,
            @ApiParam(value = "权限", required = true) @RequestParam("resources") String[] resources) {
        return adminService.modifyAccountInfo(id, roleCode, roleName, resources);
    }

    @LogInterceptor
    @ApiOperation(value = "修改管理员基本信息", notes = "修改管理员基本信息<br>" +
            "权限要求:管理员;<br>" +
            "返回内容:data空;<br>" +
            "INVALID_USER,密码不合法PASSWORD_ILLEGAL")
    @ResponseBody
    @RequestMapping(value = "/account", method = RequestMethod.PUT)
    @Authority(role = ADMIN, resource = Resources.NONE, description = Resources.Description.PASS)
    public BaseResult<Object> modifyAccountInfo(
            @ApiParam(value = "token", required = true) @RequestParam("token") String token,
            @ApiParam(value = "管理员id", required = true) @RequestParam("id") Integer id,
            @ApiParam(value = "密码") @RequestParam(value = "password", required = false) String password,
            @ApiParam(value = "使用者姓名", required = true) @RequestParam("userName") String userName,
            @ApiParam(value = "使用者联系方式", required = true) @RequestParam("userContact") String userContact) {
        return adminService.modifyAccountInfo(id, password, userName, userContact);
    }

    @LogInterceptor
    @ApiOperation(value = "管理员登录", notes = "管理员登录<br>" +
            "权限要求:管理员;<br>" +
            "返回内容:data空<br>" +
            "INVALID_USER,ERROR_PASSWORD,PASSWORD_ERROR_TIME_OVER,ACCOUNT_STILL_LOCK")
    @ResponseBody
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public BaseResult<Object> login(
            @ApiParam(value = "用户名") @RequestParam(value = "accountName", required = false) String accountName,
            @ApiParam(value = "密码") @RequestParam(value = "password", required = false) String password) {
        return adminService.login(accountName, password);
    }


}
