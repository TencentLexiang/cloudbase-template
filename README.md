# 腾讯乐享第三方应用cloudbase开发框架
[腾讯乐享](https://lexiangla.com)提供[第三方应用开放平台](https://lexiangla.com/wiki/service/)，开发者/服务商可以基于该平台能力实现第三方应用，为乐享企业用户提供服务。
此开放框架基于cloudbase，使用云函数、数据库、静态资源托管等能力，对开放接口、回调事件、通讯录同步、授权登录等基础模块进行封装。开发者不需要关心开放平台的接口细节，也不需要关心框架与乐享怎样交互，只需要关注业务功能本身。

# 一键部署
## 第一步：在乐享创建第三方应用
![](https://lexiang4public-10029162.cos.ap-shanghai.myqcloud.com/wiki/api/cloudbase1.jpg)
记住**应用id**，**应用secret**，**接收乐享回调secret**三个字段值

## 第二步：点击一键部署按钮
[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2FTencentLexiang%2Fcloudbase-template&branch=master)

## 第三步：创建cloudbase环境
根据第一步获取的内容，填充必填字段，等待初始化完成即完成部署
![](https://lexiang4public-10029162.cos.ap-shanghai.myqcloud.com/wiki/api/cloudbase2.png)

# 开发
## 第一步：克隆代码到本地
## 第二步：创建.env文件，并填充内容
方式1：直接创建，并打开云开发环境，从云函数的环境变量中复制粘贴下来
```
ENV_ID=xx
LX_SUITE_ID=xx
LX_SUITE_SECRET=xx
LX_CALLBACK_SECRET=xx
LX_API_URL=https://lxapi.lexiangla.com/cgi-bin/
LX_AUTH_URL=https://lexiangla.com/connect/oauth2/authorize
PERSISTENCE=local
```
方式2：一键部署后，公司授权进入管理后台，可直接下载当前项目的环境变量文件，修改文件名为.env放在根目录即可
![](https://lexiang4public-10029162.cos.ap-shanghai.myqcloud.com/wiki/api/cloudbase3.png)
## 第三步：参考[云开发开发指南](https://cloud.tencent.com/document/product/876/46798)进行开发
## 第四步：参考[Cloudbase CLI说明](https://lexiang4public-10029162.cos.ap-shanghai.myqcloud.com/wiki/api/cloudbase3.png)，进行部署
