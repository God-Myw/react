export const router = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        // 船东货主login页面
        name: 'login',
        path: '/user/login',
        component: './Index/Login',
      },
      {
        // 客服login页面
        name: 'login_customer',
        path: '/user/service/login',
        component: './Index/LoginCustomer',
      },
      {
        // 管理员login页面
        name: 'login_customer',
        path: '/user/admin/login',
        component: './Index/LoginCustomer',
      },
      {
        //注册页面
        name: 'register',
        path: '/user/register',
        component: './Index/Register',
      },
      {
        //找回密码
        name: 'find_pass',
        path: '/user/findPass',
        component: './Index/FindPass',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/index_menu',
          },
          {
            path: '/index',
            redirect: '/index_menu',
          },
          {
            path: '/index_menu',
            component: './Index/UserMenu',
          },
          {
            path: '/manager_menu',
            component: './Index/ManagerMenu',
          },
          {
            path: '/account_manager',
            icon: 'user',
            component: './FuncModel/AccountManagement/AccountView',
          },
          {
            path: '/profile_certification/:change',
            icon: 'profile',
            component: './FuncModel/CertificationReview/CertificationIndex',
          },
          //资料认证审核页面
          {
            path: '/profile_certification_process/:id/:selstatus',
            component: './FuncModel/CertificationReview/CertificationProcess',
          },
          {
            path: '/international',
            icon: 'global',
            component: './TestPage',
          },
          {
            path: '/online_business',
            icon: 'global',
            component: './FuncModel/OnlineBusiness/OnlineBusiess',
          },

          {
            path: '/reset_password',
            icon: 'global',
            component: './TestPage',
          },
          //-----------------------------------船东
          //船东---航次发布
          {
            path: '/voyage',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/voyage',
                redirect: '/voyage/list',
              },
              {
                path: '/voyage/list',
                component: './FuncModel/Voyage/VoyageList',
              },
              {
                path: '/voyage/add',
                component: './FuncModel/Voyage/VoyageAdd',
              },
              {
                path: '/voyage/edit/:guid',
                component: './FuncModel/Voyage/VoyageAdd',
              },
              {
                path: '/voyage/view/:guid',
                component: './FuncModel/Voyage/VoyageView',
              },
            ],
          },
          //船东---在线投保
          {
            path: '/insurance_shipOwner',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/insurance_shipOwner',
                redirect: '/insurance_shipOwner/list',
              },
              {
                path: '/insurance_shipOwner/list',
                component: './FuncModel/Insurance/InsuranceForShipowner/InsuranceList',
              },
              {
                path: '/insurance_shipOwner/add',
                component: './FuncModel/Insurance/InsuranceForShipowner/InsuranceAdd',
              },
              {
                path: '/insurance_shipOwner/edit/:guid',
                component: './FuncModel/Insurance/InsuranceForShipowner/InsuranceAdd',
              },
              {
                path: '/insurance_shipOwner/view/:guid',
                component: './FuncModel/Insurance/InsuranceForShipowner/InsuranceView',
              },
            ],
          },
          //船东---我的船舶
          {
            path: '/myship',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/myship',
                redirect: '/myship/list',
              },
              {
                path: '/myship/list',
                component: './FuncModel/MyShip/MyShipList',
              },
              {
                path: '/myship/add',
                component: './FuncModel/MyShip/MyShipAdd',
              },
              {
                path: '/myship/edit/:guid/:status',
                component: './FuncModel/MyShip/MyShipAdd',
              },
              {
                path: '/myship/view/:guid/:status',
                component: './FuncModel/MyShip/MyShipView',
              },
              {
                path: '/myship/list/:status',
                component: './FuncModel/MyShip/MyShipList',
              },
            ],
          },
          //船东---船舶交易发布
          {
            path: '/ShipownerShipTrade',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/ShipownerShipTrade',
                redirect: '/ShipownerShipTrade/list',
              },
              //船舶交易一览
              {
                path: '/ShipownerShipTrade/list',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeList',
              },
              //船舶交易新增（买方）
              {
                path: '/ShipownerShipTrade/addForBuy',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeAdd',
              },
              //船舶交易新增（卖方）
              {
                path: '/ShipownerShipTrade/addForSale',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeAddForSale',
              },
              //船舶交易修改（买方）
              {
                path: '/ShipownerShipTrade/editForBuy/:guid',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeAdd',
              },
              //船舶交易修改（卖方）
              {
                path: '/ShipownerShipTrade/editForSale/:guid',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeAddForSale',
              },
              //船舶交易查看（买方）
              {
                path: '/ShipownerShipTrade/viewForBuy/:guid',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeView',
              },
              //船舶交易查看（卖方）
              {
                path: '/ShipownerShipTrade/viewForSale/:guid',
                component: './FuncModel/ShipownerShipTrade/ShipownerShipTradeViewForSale',
              },
            ],
          },
          //船东---备件交易
          {
            path: '/part',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/part',
                redirect: '/part/list',
              },
              //备件交易一览
              {
                path: '/part/list',
                component: './FuncModel/part/partList',
              },
              //备件交易新增
              {
                path: '/part/add',
                component: './FuncModel/part/partAdd',
              },
              //备件交易修改
              {
                path: '/part/edit/:guid',
                component: './FuncModel/part/partAdd',
              },
              //备件交易查看
              {
                path: '/part/view/:guid',
                component: './FuncModel/part/partView',
              },
            ],
          },
          //船东---紧急需求
          {
            path: '/emergencyowner',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/emergencyowner',
                redirect: '/emergencyowner/list',
              },
              {
                path: '/emergencyowner/list',
                component: './FuncModel/Emergency/EmergencyList',
              },
              {
                path: '/emergencyowner/add',
                component: './FuncModel/Emergency/EmergencyAdd',
              },
              {
                path: '/emergencyowner/edit/:guid',
                component: './FuncModel/Emergency/EmergencyAdd',
              },
              //紧急需求查看
              {
                path: '/emergencyowner/view/:guid',
                component: './FuncModel/Emergency/EmergencyView',
              },
            ],
          },
          //船东---保证金
          {
            path: '/depositpaymentowner',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/depositpaymentowner',
                redirect: '/depositpaymentowner/page',
              },
              {
                path: '/depositpaymentowner/page',
                component: './FuncModel/Depositpayment/DepositpaymentPage',
              },
            ],
          },
          //船东---货盘动态
          {
            path: '/palletdynamics',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/palletdynamics',
                redirect: '/palletdynamics/list',
              },
              // 货盘动态列表
              {
                path: '/palletdynamics/list',
                component: './FuncModel/PalletDynamics/PalletDynamicsList',
              },
              //货盘查看
              {
                path: '/palletdynamics/view/:guid',
                component: './FuncModel/PalletDynamics/PalletDynamicsView',
              },
            ],
          },
          //船东---我的收藏
          {
            path: '/mycollect',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/mycollect',
                redirect: '/mycollect/list',
              },
              // 货盘动态列表
              {
                path: '/mycollect/list',
                component: './FuncModel/MyCollect/MyCollectList',
              },
              //货盘查看
              {
                path: '/mycollect/view/:guid',
                component: './FuncModel/MyCollect/MyCollectView',
              },
            ],
          },
          //船东---航次配置
          {
            path: '/voyageline',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/voyageline',
                redirect: '/voyageline/list',
              },
              {
                path: '/voyageline/list',
                component: './FuncModel/port/voyageLineList',
              },
            ],
          },
          //船东---订单管理
          {
            path: '/orderManagementowner',
            userType: 5,
            authStatus: 2,
            routes: [
              {
                path: '/orderManagementowner',
                redirect: '/orderManagementowner/list',
              },
              {
                path: '/orderManagementowner/list',
                component: './FuncModel/OrderManagement/OrderManagement/OrderManagementList',
              },
              {
                path: '/orderManagementowner/view/:guid/:payStatus/:deliverStatus/:orderStatus',
                component: './FuncModel/orderManagement/OrderManagement/MyOrderView',
              },
            ],
          },
          //船东船舶交易查询
          {
            path: '/ShipownerShipTradeQuery',
            userType: 5,
            routes: [
              {
                path: '/ShipownerShipTradeQuery',
                redirect: '/ShipownerShipTradeQuery/list',
              },
              //船东船舶交易一览
              {
                path: '/ShipownerShipTradeQuery/list',
                component: './FuncModel/ShipownerShiptradeQuery/ShipownerShiptradeQueryList',
              },
              //船东船舶交易查看
              {
                path: '/ShipownerShipTradeQuery/view/:guid',
                component: './FuncModel/ShipownerShiptradeQuery/ShipownerShiptradeQueryView',
              },
            ],
          },
          //站内消息
          {
            path: '/message',
            routes: [
              {
                path: '/message',
                redirect: '/message/list',
              },
              {
                path: '/message/list',
                component: './FuncModel/MessageMaintenance/MessageMaintenanceList',
              },
              {
                path: '/message/detail/:onlineId/:serviceId',
                component: './FuncModel/MessageMaintenance/MessageDetail',
              },
            ],
          },
          //账户管理
          {
            path: '/account_manager',
            routes: [
              {
                path: '/account_manager',
                redirect: '/account_manager/view',
              },
              {
                path: '/account_manager/view',
                component: './FuncModel/AccountManagement/AccountView',
              },
              {
                path: '/account_manager/modiPw/:guid',
                component: './FuncModel/AccountManagement/ModifyPassword',
              },
              {
                path: '/account_manager/sendOldPhone/:guid/:num/:code',
                component: './FuncModel/AccountManagement/SendOldPhoneMessage',
              },
              {
                path: '/account_manager/newPhoneNumber/:guid',
                component: './FuncModel/AccountManagement/NewPhoneNumber',
              },
              {
                path: '/account_manager/sendNewPhone/:guid/:num/:code',
                component: './FuncModel/AccountManagement/SendNewPhoneMessage',
              },
              {
                path: '/account_manager/newPhoneSuccess',
                component: './FuncModel/AccountManagement/NewPhoneSuccess',
              },
              {
                path: '/account_manager/sendNewEmail/:guid/:address',
                component: './FuncModel/AccountManagement/SendNewEmailMessage',
              },
              {
                path: '/account_manager/newEmailSuccess',
                component: './FuncModel/AccountManagement/NewEmailSuccess',
              },
              {
                path: '/account_manager/sendOldEmail/:guid/:address',
                component: './FuncModel/AccountManagement/SendOldEmailMessage',
              },
              {
                path: '/account_manager/newEmailAddress/:guid',
                component: './FuncModel/AccountManagement/NewEmailAddress',
              },
            ],
          },
          //-----------------------------------货主
          //货主---货盘模块
          {
            path: '/pallet',
            userType: 4,
            routes: [
              {
                path: '/pallet',
                redirect: '/pallet/list',
              },
              {
                path: '/pallet/list',
                component: './FuncModel/Pallet/PalletList',
              },
              {
                path: '/pallet/add',
                component: './FuncModel/Pallet/PalletAdd',
              },
              {
                path: '/pallet/edit/:guid',
                component: './FuncModel/Pallet/PalletAdd',
              },
              //货盘查看
              {
                path: '/pallet/view/:guid',
                component: './FuncModel/Pallet/XQ',
              },
            ],
          },
          //货主---在线投保
          {
            path: '/insurance_shipper',
            userType: 4,
            authStatus: 2,
            routes: [
              {
                path: '/insurance_shipper',
                redirect: '/insurance_shipper/list',
              },
              {
                path: '/insurance_shipper/list',
                component: './FuncModel/Insurance/InsuranceForShipper/InsuranceList',
              },
              {
                path: '/insurance_shipper/add/:rate',
                component: './FuncModel/Insurance/InsuranceForShipper/InsuranceAdd',
              },
              {
                path: '/insurance_shipper/edit/:guid/:rate',
                component: './FuncModel/Insurance/InsuranceForShipper/InsuranceAdd',
              },
              {
                path: '/insurance_shipper/view/:guid',
                component: './FuncModel/Insurance/InsuranceForShipper/InsuranceView',
              },
            ],
          },
          //货主---紧急需求
          {
            path: '/emergency',
            userType: 4,
            authStatus: 2,
            routes: [
              {
                path: '/emergency',
                redirect: '/emergency/list',
              },
              {
                path: '/emergency/list',
                component: './FuncModel/Emergency/EmergencyList',
              },
              {
                path: '/emergency/add',
                component: './FuncModel/Emergency/EmergencyAdd',
              },
              {
                path: '/emergency/edit/:guid',
                component: './FuncModel/Emergency/EmergencyAdd',
              },
              {
                path: '/emergency/view/:guid',
                component: './FuncModel/Emergency/EmergencyView',
              },
            ],
          },
          //货主---船舶交易发布
          {
            path: '/shipTrade',
            userType: 4,
            authStatus: 2,
            routes: [
              {
                path: '/shipTrade',
                redirect: '/shipTrade/list',
              },
              //船舶交易一览
              {
                path: '/shipTrade/list',
                component: './FuncModel/ShipTrade/ShipTradeList',
              },
              //船舶交易新增(买方)
              {
                path: '/shipTrade/add',
                component: './FuncModel/ShipTrade/ShipTradeAdd',
              },
              //船舶交易新增(卖方)
              {
                path: '/shipTrade/addForSale',
                component: './FuncModel/ShipTrade/ShipTradeAddForSale',
              },
              //船舶交易修改(买方)
              {
                path: '/shipTrade/edit/:guid',
                component: './FuncModel/ShipTrade/ShipTradeAdd',
              },
              //船舶交易修改(卖方)
              {
                path: '/shipTrade/editForSale/:guid',
                component: './FuncModel/ShipTrade/ShipTradeAddForSale',
              },
              //船舶交易查看(买方)
              {
                path: '/shipTrade/view/:guid',
                component: './FuncModel/ShipTrade/ShipTradeView',
              },
              //船舶交易查看(卖方)
              {
                path: '/shipTrade/viewForSale/:guid',
                component: './FuncModel/ShipTrade/ShipTradeViewForSale',
              },
            ],
          },

          //货主---保证金
          {
            path: '/depositpayment',
            userType: 4,
            authStatus: 2,
            routes: [
              {
                path: '/depositpayment',
                redirect: '/depositpayment/page',
              },
              {
                path: '/depositpayment/page',
                component: './FuncModel/Depositpayment/DepositpaymentPage',
              },
            ],
          },
          //货主--航次动态
          {
            path: '/voyagedynamics',
            userType: 4,
            authStatus: 2,
            routes: [
              {
                path: '/voyagedynamics',
                redirect: '/voyagedynamics/list',
              },
              {
                path: '/voyagedynamics/list',
                component: './FuncModel/VoyageDynamicsForShipOwner/VoyageDynamicsForShipOwnerList',
              },
              {
                path: '/voyagedynamics/view/:guid',
                component: './FuncModel/VoyageDynamicsForShipOwner/VoyageDynamicsForShipOwnerView',
              },
            ],
          },
          //货主---订单管理
          {
            path: '/orderManagement',
            userType: 4,
            authStatus: 2,
            routes: [
              {
                path: '/orderManagement',
                redirect: '/orderManagement/list',
              },
              {
                path: '/orderManagement/list',
                component: './FuncModel/OrderManagement/OrderManagement/OrderManagementList',
              },
              {
                path: '/orderManagement/view/:guid/:payStatus/:deliverStatus/:orderStatus',
                component: './FuncModel/orderManagement/OrderManagement/MyOrderView',
              },
            ],
          },
          //货主船舶交易查询
          {
            path: '/shiptradequery',
            routes: [
              {
                path: '/shiptradequery',
                redirect: '/shiptradequery/list',
              },
              // 船舶动态列表
              {
                path: '/shiptradequery/list',
                component: './FuncModel/ShipperShiptrade/ShipperShiptradeList',
              },
              // 船舶查看
              {
                path: '/shiptradequery/view/:guid',
                component: './FuncModel/ShipperShiptrade/ShipperShiptradeView',
              },
            ],
          },
          //===================================管理员
          //管理员-字典类型
          {
            path: '/dicttype',
            userType: 0,
            routes: [
              {
                path: '/dicttype',
                redirect: '/dicttype/list',
              },
              {
                path: '/dicttype/list',
                component: './FuncModel/dict/dictType/dictTypeList',
              },
              {
                path: '/dictType/view/:guid',
                component: './FuncModel/dict/dictType/dictTypeView',
              },
            ],
          },
          //管理员-字典配置
          {
            path: '/dictconfig',
            userType: 0,
            routes: [
              {
                path: '/dictconfig',
                redirect: '/dictconfig/list',
              },
              {
                path: '/dictconfig/list',
                component: './FuncModel/dict/dictConfig/dictList',
              },
              {
                path: '/dictconfig/view/:guid/:parentId',
                component: './FuncModel/dict/dictConfig/dictView',
              },
            ],
          },
          //管理员-客服管理
          {
            path: '/customerManage',
            routes: [
              {
                path: '/customerManage',
                redirect: '/customerManage/list',
              },
              {
                path: '/customerManage/list',
                component: './FuncModel/Administrator/service/customerList',
              },
            ],
          },
          //角色管理
          {
            path: '/rolemanage',
            userType: 0,
            routes: [
              {
                path: '/rolemanage',
                redirect: '/rolemanage/list',
              },
              {
                path: '/rolemanage/list',
                component: './FuncModel/Role/RoleList',
              },
              {
                path: '/rolemanage/view/:guid',
                component: './FuncModel/Role/RoleView',
              },
            ],
          },
          //管理员-港口配置
          {
            path: '/port',
            userType: 0,
            routes: [
              {
                path: '/port',
                redirect: '/port/list',
              },
              {
                path: '/port/list',
                component: './FuncModel/port/portList',
              },
            ],
          },
          //管理员-航线配置
          // {
          //   path: '/voyageline',
          //   userType: 0,
          //   routes: [
          //     {
          //       path: '/voyageline',
          //       redirect: '/voyageline/list',
          //     },
          //     {
          //       path: '/voyageline/list',
          //       component: './FuncModel/port/voyageLineList',
          //     },
          //   ],
          // },
          //管理员-站内消息
          {
            path: '/message',
            userType: 0,
            routes: [
              {
                path: '/message',
                redirect: '/message/list',
              },
              {
                path: '/message/list',
                component: './FuncModel/MessageMaintenance/MessageMaintenanceList',
              },
              {
                path: '/message/detail/:userId',
                component: './FuncModel/MessageMaintenance/MessageDetail',
              },
            ],
          },
          //管理员-保险管理
          {
            path: '/insureCompany',
            userType: 0,
            routes: [
              {
                path: '/insureCompany',
                redirect: '/insureCompany/list',
              },
              //保险公司维护一览
              {
                path: '/insureCompany/list',
                component: './FuncModel/insureCompany/InsureCompanyList',
              },
              //保险公司维护查看
              {
                path: '/insureCompany/view/:guid',
                component: './FuncModel/insureCompany/InsureCompanyView',
              },
            ],
          },
          //===================================线下客服
          //线下客服---预订单
          {
            path: '/advanceorder',
            userType: 2,
            routes: [
              {
                path: '/advanceorder',
                redirect: '/advanceorder/list',
              },
              {
                path: '/advanceorder/list',
                component: './FuncModel/Advanceorder/AdvanceorderList',
              },
              {
                path: '/advanceorder/contract/:orderNumber/:status',
                component: './FuncModel/Advanceorder/AdvanceorderContract',
              },
              {
                path: '/advanceorder/view/:guid/:status',
                component: './FuncModel/Advanceorder/AdvanceorderView',
              },
              {
                path: '/advanceorder/check/:guid/:status',
                component: './FuncModel/Advanceorder/AdvanceorderCheck',
              },
              {
                path: '/advanceorder/list/:status',
                component: './FuncModel/Advanceorder/AdvanceorderList',
              },
            ],
          },
          //线下客服---提单
          {
            path: '/submission',
            userType: 2,
            routes: [
              {
                path: '/submission',
                redirect: '/submission/list',
              },
              {
                path: '/submission/list',
                component: './FuncModel/Submission/SubmissionList',
              },
              {
                path: '/submission/view/:orderNumber/:guid',
                component: './FuncModel/Submission/SubmissionView',
              },
              {
                path: '/submission/edit/:orderNumber/:guid',
                component: './FuncModel/Submission/SubmissionAdd',
              },
            ],
          },
          //线下客服===用户查询
          {
            path: '/downusersearch',
            userType: 2,
            routes: [
              {
                path: '/downusersearch',
                redirect: '/downusersearch/usersearch',
              },
              {
                path: '/downusersearch/usersearch',
                component: './FuncModel/UserSearch/userlist',
              },
            ],
          },
          //线下客服===订舱
          {
            path: '/linerBooking',
            userType: 2,
            routes: [
              {
                path: '/linerBooking',
                redirect: '/linerBooking/list',
              },
              {
                path: '/linerBooking/list',
                component: './FuncModel/linerBooking/PalletList',
              },
              {
                path: '/linerBooking/add',
                component: './FuncModel/linerBooking/PalletAdd',
              },
              {
                path: '/linerBooking/edit',
                component: './FuncModel/linerBooking/PalletListbianji',
              },

              {
                path: '/linerBooking/editBia/:guid',
                component: './FuncModel/linerBooking/XQbianji',
              },
              {
                path: '/linerBooking/addBia/:guid',
                component: './FuncModel/linerBooking/PalletAddbianji',
              },
              {
                path: '/linerBooking/view/:guid',
                component: './FuncModel/linerBooking/XQ',
              },
            ],
          },
          //线下客服===集装箱租赁
          {
            path: '/containerOrder',
            userType: 2,
            routes: [
              {
                path: '/containerOrder',
                redirect: '/containerOrder/list',
              },
              {
                path: '/containerOrder/list',
                component: './FuncModel/containerOrder/PalletList',
              },
              {
                path: '/containerOrder/add',
                component: './FuncModel/containerOrder/PalletAdd',
              },
              {
                path: '/containerOrder/edit',
                component: './FuncModel/containerOrder/PalletListbianji',
              },

              {
                path: '/containerOrder/editBia/:guid',
                component: './FuncModel/containerOrder/XQbianji',
              },
              {
                path: '/containerOrder/addBia/:guid',
                component: './FuncModel/containerOrder/PalletAddbianji',
              },
              {
                path: '/containerOrder/view/:guid',
                component: './FuncModel/containerOrder/XQ',
              },
            ],
          },

          //线下客服===现舱竞拍
          {
            path: '/AuctionCustomer',
            userType: 2,
            routes: [
              {
                path: '/AuctionCustomer',
                redirect: '/AuctionCustomer/list',
              },
              {
                path: '/AuctionCustomer/list',
                component: './FuncModel/AuctionCustomer/PalletList',
              },
              {
                path: '/AuctionCustomer/add',
                component: './FuncModel/AuctionCustomer/PalletAdd',
              },
              {
                path: '/AuctionCustomer/edit',
                component: './FuncModel/AuctionCustomer/PalletListbianji',
              },

              {
                path: '/AuctionCustomer/editBia/:guid/:e',
                component: './FuncModel/AuctionCustomer/XQbianji',
              },
              {
                path: '/AuctionCustomer/addBia/:guid',
                component: './FuncModel/AuctionCustomer/PalletAddbianji',
              },
              {
                path: '/AuctionCustomer/view/:guid',
                component: './FuncModel/AuctionCustomer/XQ',
              },
            ],
          },

          //线下客服===现舱秒杀
          {
            path: '/containerSpike',
            userType: 2,
            routes: [
              {
                path: '/containerSpike',
                redirect: '/containerSpike/list',
              },
              {
                path: '/containerSpike/list',
                component: './FuncModel/containerSpike/PalletList',
              },
              {
                path: '/containerSpike/add',
                component: './FuncModel/containerSpike/PalletAdd',
              },
              {
                path: '/containerSpike/edit',
                component: './FuncModel/containerSpike/PalletListbianji',
              },

              {
                path: '/containerSpike/editBia/:guid/:e',
                component: './FuncModel/containerSpike/XQbianji',
              },
              {
                path: '/containerSpike/addBia/:guid',
                component: './FuncModel/containerSpike/PalletAddbianji',
              },
              {
                path: '/containerSpike/view/:guid',
                component: './FuncModel/containerSpike/XQ',
              },
            ],
          },

          //线下客服===订单管理——————旧

          {
            path: '/orderManagementOff',
            userType: 2,
            routes: [
              {
                path: '/orderManagementOff',
                redirect: '/orderManagementOff/list',
              },
              {
                path: '/orderManagementOff/list',
                component: './FuncModel/OrderManagement/OrderManagementLine/OrderManagementList',
              },
              {
                path: '/orderManagementOff/view/:guid',
                component: './FuncModel/orderManagement/OrderManagementLine/MyOrderView',
              },
              // {
              //   path: '/orderManagementOff/view/:guid/:payStatus/:deliverStatus/:orderStatus',
              //   component: './FuncModel/orderManagement/OrderManagementLine/MyOrderView',
              // },
            ],
          },
          //线下客服——————订单管理————新
          {
            path: '/newOrder',
            userType: 2,
            routes: [
              {
                path: '/newOrder',
                redirect: '/newOrder/list',
              },
              {
                path: '/newOrder/list',
                component: './FuncModel/NewOrder/OrderManagementList',
              },
              {
                path: '/newOrder/view/:guid/:orderTitleType/:checkStatus/:deliverStatus/:orderAllType',
                component: './FuncModel/NewOrder/newOrderView',
              },
            ],
          },

          //线下客服===卡车运输

          {
            path: '/truckTransportation',
            userType: 2,
            routes: [
              {
                path: '/truckTransportation',
                redirect: '/truckTransportation/list',
              },
              {
                path: '/truckTransportation/list',
                component: './FuncModel/truckTransportation/OrderManagementList',
              },
              {
                path: '/truckTransportation/view/:guid',
                component: './FuncModel/truckTransportation/newOrderView',
              },
            ],
          },

          //线下客服===特种车供应商管理
          {
            path: '/specialShip',
            userType: 2,
            routes: [
              {
                path: '/specialShip',
                redirect: '/specialShip/list',
              },
              {
                path: '/specialShip/list',
                component: './FuncModel/specialShip/OrderManagementList',
              },
              {
                path: '/specialShip/view/:guid',
                component: './FuncModel/specialShip/newOrderView',
              },
            ],
          },
          //线下客服===特种车商品管理
          {
            path: '/specialCar',
            userType: 2,
            routes: [
              {
                path: '/specialCar',
                redirect: '/specialCar/list',
              },
              {
                path: '/specialCar/list',
                component: './FuncModel/specialCar/OrderManagementList',
              },
              {
                path: '/specialCar/view/:guid',
                component: './FuncModel/specialCar/newOrderView',
              },
            ],
          },
          //线下客服===加油订单
          {
            path: '/promotion',
            userType: 2,
            routes: [
              {
                path: '/promotion',
                redirect: '/promotion/list',
              },
              {
                path: '/promotion/list',
                component: './FuncModel/promotion/OrderManagementList',
              },
              {
                path: '/promotion/listfan',
                component: './FuncModel/promotion/OrderManagementListfan',
              },
              {
                path: '/promotion/view/:guid',
                component: './FuncModel/promotion/newOrderView',
              },
            ],
          },
          //线下客服===集装箱
          {
            path: '/containerTrading',
            userType: 2,
            routes: [
              {
                path: '/containerTrading',
                redirect: '/containerTrading/list',
              },
              {
                path: '/containerTrading/list',
                component: './FuncModel/containerTrading/PalletList',
              },
              {
                path: '/containerTrading/add',
                component: './FuncModel/containerTrading/PalletAdd',
              },
              {
                path: '/containerTrading/edit',
                component: './FuncModel/containerTrading/PalletListbianji',
              },

              {
                path: '/containerTrading/editBia/:guid',
                component: './FuncModel/containerTrading/XQbianji',
              },
              {
                path: '/containerTrading/addBia/:guid',
                component: './FuncModel/containerTrading/PalletAddbianji',
              },
              {
                path: '/containerTrading/view/:guid',
                component: './FuncModel/containerTrading/XQ',
              },
            ],
          },
          //线下客服 == 车型管理
          {
            path: '/carType',
            userType: 2,
            routes: [
              {
                path: '/carType',
                redirect: '/carType/list',
              },
              {
                path: '/carType/list',
                component: './FuncModel/carType/TPAlist',
              },
              {
                path: '/carType/list/:status',
                component: './FuncModel/carType/TPAlist',
              },
              {
                path: '/carType/view/:guid/:status',
                component: './FuncModel/carType/TPAVIEW1',
              },
            ],
          },
          //线下客服===招商信息
          {
            path: '/attractInvestment',
            userType: 2,
            routes: [
              {
                path: '/attractInvestment',
                redirect: '/attractInvestment/list',
              },
              {
                path: '/attractInvestment/list',
                component: './FuncModel/attractInvestment/OrderManagementList',
              },
            ],
          },
          //线下客服===船舶供应
          {
            path: '/spartPart',
            userType: 2,
            routes: [
              {
                path: '/spartPart',
                redirect: '/spartPart/list',
              },
              {
                path: '/spartPart/list',
                component: './FuncModel/ShipSpareParts/ShipSparePartsList',
              },
              {
                path: '/spartPart/add',
                component: './FuncModel/ShipSpareParts/ShipSparePartsAdd',
              },
              {
                path: '/spartPart/view/:guid',
                component: './FuncModel/ShipSpareParts/ShipSparePartsView',
              },
              {
                path: '/spartPart/userList',
                component: './FuncModel/ShipSpareParts/SpartUserList',
              },
              {
                path: '/spartPart/orderList',
                component: './FuncModel/ShipSpareParts/ShipSparePartsOrderList',
              },
            ],
          },
          //线下客服===船员培训
          {
            path: '/userCultivate',
            userType: 2,
            routes: [
              {
                path: '/userCultivate',
                redirect: '/userCultivate/list',
              },
              {
                path: '/userCultivate/list',
                component: './FuncModel/CrewTraining/CrewTrainingList',
              },
              {
                path: '/userCultivate/add',
                component: './FuncModel/CrewTraining/CrewTrainingAdd',
              },
              {
                path: '/userCultivate/view/:guid',
                component: './FuncModel/CrewTraining/CrewTrainingView',
              },
              {
                path: '/userCultivate/Train/list',
                component: './FuncModel/CrewTraining/TrainList',
              },
              {
                path: '/userCultivate/Train/Edit',
                component: './FuncModel/CrewTraining/TrainEdit',
              },
              {
                path: '/userCultivate/Train/view/:guid',
                component: './FuncModel/CrewTraining/TrainView',
              },
            ],
          },

          //===================================线上客服
          //线上客服---保险公司一览（保险管理）
          {
            path: '/insuranceCompanyList',
            userType: 3,
            routes: [
              {
                path: '/insuranceCompanyList',
                component: './FuncModel/OnlineInsuranceManagement/InsuranceManagement',
              },
            ],
          },
          //线上客服===供需匹配
          {
            path: '/sudeMatch',
            userType: 1,
            routes: [
              {
                path: '/sudeMatch',
                redirect: '/sudeMatch/list',
              },
              {
                path: '/sudeMatch/list',
                component: './FuncModel/SupplierDemandMatch/SupplierDemandList',
              },
              {
                path: '/sudeMatch/view/:guid/:isChina',
                component: './FuncModel/SupplierDemandMatch/SupplierDemandView',
              },
              {
                path: '/sudeMatch/detail/:guid/:id',
                component: './FuncModel/SupplierDemandMatch/PalletDetail',
              },
            ],
          },
          //线上客服===用户查询
          {
            path: '/usersearch',
            userType: 1,
            routes: [
              {
                path: '/usersearch',
                redirect: '/usersearch/usersearch',
              },
              {
                path: '/usersearch/usersearch',
                component: './FuncModel/UserSearch/userlist',
              },
            ],
          },
          //线上客服---保险公司一览（保险管理）
          {
            path: '/insuranceCompanyList',
            userType: 3,
            routes: [
              {
                path: '/insuranceCompanyList',
                component: './FuncModel/OnlineInsuranceManagement/InsuranceManagement',
              },
            ],
          },

          //线上客服===订单管理
          {
            path: '/orderManagementON',
            userType: 1,
            routes: [
              {
                path: '/orderManagementON',
                redirect: '/orderManagementON/list',
              },
              {
                path: '/orderManagementON/list',
                component: './FuncModel/OrderManagement/OrderManagementLine/OrderManagementList',
              },
              {
                path: '/orderManagementON/view/:guid/:payStatus/:deliverStatus/:orderStatus',
                component: './FuncModel/orderManagement/OrderManagementLine/MyOrderView',
              },
            ],
          },

          //===================================审核客服
          //审核客服===认证审核
          {
            path: '/usercertification',
            userType: 3,
            routes: [
              {
                path: '/usercertification',
                redirect: '/usercertification/list',
              },
              {
                path: '/usercertification/list',
                component: './FuncModel/UserCertification/CertificationList',
              },
              {
                path: '/usercertification/view/:id/:selstatus',
                component: './FuncModel/CertificationReview/CertificationIndex',
              },
            ],
          },
          //审核客服===船舶审核
          {
            path: '/shipcertification',
            userType: 3,
            routes: [
              {
                path: '/shipcertification',
                redirect: '/shipcertification/list',
              },
              {
                path: '/shipcertification/list',
                component: './FuncModel/ShipCertification/ShipCertificationList',
              },
              {
                path: '/shipcertification/list/:status',
                component: './FuncModel/ShipCertification/ShipCertificationList',
              },
              {
                path: '/shipcertification/view/:guid/:status/:isChinaShip',
                component: './FuncModel/ShipCertification/ShipCertificationView',
              },
            ],
          },
          //审核客服===保险需求
          {
            path: '/insuranceonline',
            userType: 3,
            routes: [
              {
                path: '/insuranceonline',
                redirect: '/insuranceonline/list',
              },
              {
                path: '/insuranceonline/list',
                component: './FuncModel/Insurance/InsuranceOnLine/InsuranceOnLineList',
              },
              {
                path: '/insuranceonline/shipownerview/:guid',
                component: './FuncModel/Insurance/InsuranceOnLine/InsuranceShipownerView',
              },
              {
                path: '/insuranceonline/shipperview/:guid',
                component: './FuncModel/Insurance/InsuranceOnLine/InsuranceShipperView',
              },
            ],
          },
          //审核客服===船舶需求
          {
            path: '/shipneeds',
            userType: 3,
            routes: [
              {
                path: '/shipneeds',
                redirect: '/shipneeds/list',
              },
              {
                path: '/shipneeds/list',
                component: './FuncModel/ShipNeeds/ShipNeedsList',
              },
              {
                path: '/shipneeds/view/:guid',
                component: './FuncModel/ShipNeeds/ShipNeedsView',
              },
              {
                path: '/shipneeds/viewForSale/:guid',
                component: './FuncModel/ShipNeeds/ShipNeedsViewForSale',
              },
            ],
          },
          //审核客服===预订单审核
          {
            path: '/ceradvanceorder',
            userType: 3,
            routes: [
              {
                path: '/ceradvanceorder',
                redirect: '/ceradvanceorder/list',
              },
              {
                path: '/ceradvanceorder/list',
                component: './FuncModel/CerAdvandeorder/CerAdvandeorderList',
              },
              {
                path: '/ceradvanceorder/view/:guid/:status/:selectTab',
                component: './FuncModel/CerAdvandeorder/CerAdvandeorderView',
              },
            ],
          },
          //审核客服===用户查询
          {
            path: '/checkusersearch',
            userType: 3,
            routes: [
              {
                path: '/checkusersearch',
                redirect: '/checkusersearch/usersearch',
              },
              {
                path: '/checkusersearch/usersearch',
                component: './FuncModel/UserSearch/userlist',
              },
            ],
          },
          {
            path: '/checkInsureCompany',
            userType: 3,
            routes: [
              {
                path: '/checkInsureCompany',
                component: './FuncModel/OnlineInsuranceManagement/InsuranceManagement',
              },
            ],
          },
          //审核客服===紧急需求
          {
            path: '/checkemergency',
            userType: 3,
            routes: [
              {
                path: '/checkemergency',
                redirect: '/checkemergency/list',
              },
              {
                path: '/checkemergency/list',
                component: './FuncModel/Emergency/EmergencyListSupport',
              },
              {
                path: '/checkemergency/view/:guid',
                component: './FuncModel/Emergency/EmergencySupportView',
              },
            ],
          },
          //审核客服===订单管理
          {
            path: '/orderManagementExamine',
            userType: 3,
            routes: [
              {
                path: '/orderManagementExamine',
                redirect: '/orderManagementExamine/list',
              },
              {
                path: '/orderManagementExamine/list',
                component: './FuncModel/OrderManagement/OrderManagementLine/OrderManagementList',
              },
              {
                path: '/orderManagementExamine/view/:guid/:payStatus/:deliverStatus/:orderStatus',
                component: './FuncModel/orderManagement/OrderManagementLine/MyOrderView',
              },
              {
                path: '/orderManagementExamine/settlement/:guid',
                component: './FuncModel/orderManagement/OrderManagementLine/SettlementView',
              },
            ],
          },

          //审核客服===货盘动态
          {
            path: '/customerpalletdynamics',
            userType: 3,
            routes: [
              {
                path: '/customerpalletdynamics',
                redirect: '/customerpalletdynamics/list',
              },
              {
                path: '/customerpalletdynamics/list',
                component: './FuncModel/PalletDynamics/PalletDynamicsList',
              },
              {
                path: '/customerpalletdynamics/view/:guid',
                component: './FuncModel/PalletDynamics/PalletDynamicsView',
              },
            ],
          },

          //审核客服===航次动态
          {
            path: '/customervoyagedynamics',
            userType: 3,
            routes: [
              {
                path: '/customervoyagedynamics',
                redirect: '/customervoyagedynamics/list',
              },
              {
                path: '/customervoyagedynamics/list',
                component: './FuncModel/VoyageDynamics/VoyageDynamicsList',
              },
              {
                path: '/customervoyagedynamics/view/:guid',
                component: './FuncModel/VoyageDynamics/VoyageDynamicsView',
              },
            ],
          },
          //审核客服===航线配置
          {
            path: '/customervoyageLine',
            userType: 3,
            routes: [
              {
                path: '/customervoyageLine',
                redirect: '/customervoyageLine/list',
              },
              {
                path: '/customervoyageLine/list',
                component: './FuncModel/CustomerVoyageLine/CustomerVoyageLineList',
              },
              {
                path: '/customervoyageLine/view/:guid',
                component: './FuncModel/CustomerVoyageLine/CustomerVoyageLineView',
              },
            ],
          },

          //审核客服 === 订单流水审核
          {
            path: '/orderFlow',
            userType: 3,
            routes: [
              {
                path: '/orderFlow',
                redirect: '/orderFlow/list',
              },
              {
                path: '/orderFlow/list',
                component: './FuncModel/orderFlow/TPAlist',
              },
              {
                path: '/orderFlow/list/:status',
                component: './FuncModel/orderFlow/TPAlist',
              },
              {
                path: '/orderFlow/view/:guid/:attachId/:status',
                component: './FuncModel/orderFlow/TPAVIEW1',
              },
              {
                path: '/orderFlow/make/:guid/:attachId/:status',
                component: './FuncModel/orderFlow/TPAVIEW2',
              },
            ],
          },
          //审核客服 === 审核推广
          {
            path: '/promotionaudit',
            userType: 3,
            routes: [
              {
                path: '/promotionaudit',
                redirect: '/promotionaudit/list',
              },
              {
                path: '/promotionaudit/list',
                component: './FuncModel/ToPromoteAudit/TPAlist',
              },
              {
                path: '/promotionaudit/list/:status',
                component: './FuncModel/ToPromoteAudit/TPAlist',
              },
              {
                path: '/promotionaudit/view/:guid/:status',
                component: './FuncModel/ToPromoteAudit/TPAVIEW1',
              },
            ],
          },
          //在线查询===推广订单
          {
            path: '/adsOrder',
            userType: 3,
            routes: [
              {
                path: '/adsOrder',
                redirect: '/adsOrder/list',
              },
              {
                path: '/adsOrder/list',
                component: './FuncModel/PromotionOrder/POList',
              },
              {
                path: '/adsOrder/list/:status',
                component: './FuncModel/PromotionOrder/POList',
              },
              {
                path: '/adsOrder/view/:guid/:status',
                component: './FuncModel/PromotionOrder/POView',
              },
            ],
          },
          //消息推送
          {
            path: '/manualMessage',
            userType: 3,
            routes: [
              {
                path: '/manualMessage',
                redirect: '/manualMessage/list',
              },
              {
                path: '/manualMessage/list',
                component: './FuncModel/MessagePush/MPList',
              },
              {
                path: '/manualMessage/list/:status',
                component: './FuncModel/MessagePush/MPList',
              },
              {
                path: '/manualMessage/view/:guid',
                component: './FuncModel/MessagePush/MPView',
              },
              {
                path: '/manualMessage/Yong',
                component: './FuncModel/MessagePush/userlist',
              },
            ],
          },
          //二维码上传
          {
            path: '/qrCodeUpload',
            userType: 2,
            routes: [
              {
                path: '/qrCodeUpload',
                redirect: '/qrCodeUpload/list',
              },
              {
                path: '/qrCodeUpload/list',
                component: './FuncModel/QrCodeUP/MPList',
              },
              {
                path: '/qrCodeUpload/view/:guid',
                component: './FuncModel/QrCodeUP/MPView',
              },
            ],
          },

          //船舶交易
          {
            path: '/ShipTrading',
            userType: 2,
            routes: [
              {
                path: '/ShipTrading',
                redirect: '/ShipTrading/list',
              },
              {
                path: '/ShipTrading/list',
                component: './FuncModel/ShipTrading/ShipList',
              },
              {
                path: '/ShipTrading/view/:guid',
                component: './FuncModel/ShipTrading/ShipView',
              },
              {
                path: '/ShipTrading/aucTionView/:guid',
                component: './FuncModel/ShipTrading/AucTionView',
              }
            ],
          },
          {
            path: '/403',
            component: './403',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
