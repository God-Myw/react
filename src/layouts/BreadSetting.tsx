import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { formatMessage } from 'umi-plugin-react/locale';

/**
 * 编辑面包屑
 * @param pathname
 * @param routes
 */
export const editBread = (pathname: string, routes: Route[]) => {
  /**公共部分开始 */

  //资料认证面包屑
  if (pathname.startsWith('/profile_certification')) {
    //资料认证面包屑
    routes.push({
      path: '/profile_certification',
      breadcrumbName: formatMessage({ id: 'BreadSetting-data.authentication' }),
    });
  }

  //账号管理面包屑
  if (pathname.startsWith('/account_manager')) {
    //账号管理面包屑
    routes.push({
      path: '/account_manager/view',
      breadcrumbName: formatMessage({ id: 'BreadSetting-account.management' }),
    });
    //修改密码面包屑
    if (pathname.startsWith('/account_manager/modiPw')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-change.password' }),
      });
    }
    //修改手机号码面包屑
    if (pathname.startsWith('/account_manager/sendOldPhone')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-change.yourPhoneNumber' }),
      });
    }
    //修改手机号码面包屑
    if (pathname.startsWith('/account_manager/sendNewPhone')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-change.yourPhoneNumber' }),
      });
    }
    //修改手机号码面包屑
    if (pathname.startsWith('/account_manager/newPhoneSuccess')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-change.yourPhoneNumber' }),
      });
    }
    //修改手机号码面包屑
    if (pathname.startsWith('/account_manager/newPhoneNumber')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-change.yourPhoneNumber' }),
      });
    }
    //修改绑定邮箱面包屑
    if (pathname.startsWith('/account_manager/sendNewEmail')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-modify.boundMailbox' }),
      });
    }
    //修改绑定邮箱面包屑
    if (pathname.startsWith('/account_manager/newEmailSuccess')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-modify.boundMailbox' }),
      });
    }
  }

  /**公共部分结束 */

  /**船东开始*/

  /**船东货盘动态，货主货盘发布开始*/

  //船东货盘动态面包屑
  if (pathname.startsWith('/palletdynamics')) {
    routes.push({
      //货盘发布面包屑
      path: '/palletdynamics/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Pallet.dynamics' }),
    });
    if (pathname.startsWith('/palletdynamics/view')) {
      //查看货盘面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Check.pallets' }),
      });
    }
  }
  //货主货盘发布面包屑
  else if (pathname.startsWith('/pallet')) {
    //货盘发布面包屑
    routes.push({
      path: '/pallet/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Pallet.release' }),
    });
    //货盘新增面包屑
    if (pathname.startsWith('/pallet/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-New.pallet' }),
      });
    }
    //货盘修改面包屑
    if (pathname.startsWith('/pallet/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Modify.pallet' }),
      });
    }
    //货盘查看面包屑
    if (pathname.startsWith('/pallet/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Check.pallets' }),
      });
    }
  }

  /**船东货盘动态，货主货盘发布结束*/

  /**船东我的收藏开始*/
  //船东我的收藏面包屑
  if (pathname.startsWith('/mycollect')) {
    routes.push({
      //我的收藏面包屑
      path: '/mycollect/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-my.collect' }),
    });
    if (pathname.startsWith('/mycollect/view')) {
      //查看收藏面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-check.collect' }),
      });
    }
  }
  /**船东我的收藏结束*/

  /**船东紧急需求，货主紧需求开始*/

  //船东紧急需求面包屑
  if (pathname.startsWith('/emergencyowner')) {
    //紧急需求面包屑
    routes.push({
      path: '/emergencyowner/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Urgent.need' }),
    });
    //紧急需求发布面包屑
    if (pathname.startsWith('/emergencyowner/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.demandRelease' }),
      });
    }
    //紧急需求修改面包屑
    if (pathname.startsWith('/emergencyowner/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.needsModification' }),
      });
    }
    //紧急需求查看面包屑
    if (pathname.startsWith('/emergencyowner/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.needsView' }),
      });
    }
  }

  //货主紧急需求面包屑
  else if (pathname.startsWith('/emergency')) {
    //紧急需求面包屑
    routes.push({
      path: '/emergency/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Urgent.need' }),
    });
    //紧急需求发布面包屑
    if (pathname.startsWith('/emergency/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.demandRelease' }),
      });
    }
    //紧急需求修改面包屑
    if (pathname.startsWith('/emergency/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.needsModification' }),
      });
    }
    //紧急需求查看面包屑
    if (pathname.startsWith('/emergency/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.needsView' }),
      });
    }
  }

  /**船东紧急需求，货主紧需求结束*/
  /**船东船舶交易查询，船东船舶交易开始*/

  //船东船舶交易查询面包屑
  if (pathname.startsWith('/ShipownerShipTradeQuery')) {
    //船舶交易查询面包屑
    routes.push({
      path: '/ShipownerShipTradeQuery/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-transaction.enquiry' }),
    });
    //查看船舶交易信息面包屑
    if (pathname.startsWith('/ShipownerShipTradeQuery/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-viewShip.transactionInformation' }),
      });
    }
  }

  //船东船舶交易面包屑
  else if (pathname.startsWith('/ShipownerShipTrade')) {
    //船舶交易面包屑
    routes.push({
      path: '/ShipownerShipTrade/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-ship.trading' }),
    });
    //新增船舶交易信息面包屑
    if (pathname.startsWith('/ShipownerShipTrade/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-newShip.transactionInformation' }),
      });
    }
    //修改船舶交易信息面包屑
    if (pathname.startsWith('/ShipownerShipTrade/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({
          id: 'BreadSetting-modificationOfShip.transactionInformation',
        }),
      });
    }
    //查看船舶交易信息面包屑
    if (pathname.startsWith('/ShipownerShipTrade/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-viewShip.transactionInformation' }),
      });
    }
  }
  /**船东船舶交易查询，船东船舶交易结束*/

  //船东在线投保面包屑
  if (pathname.startsWith('/insurance_shipOwner')) {
    //在线投保面包屑
    routes.push({
      path: '/insurance_shipOwner/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-online.insure' }),
    });
    //新增投保面包屑
    if (pathname.startsWith('/insurance_shipOwner/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-new.insure' }),
      });
    }
    //修改投保面包屑
    if (pathname.startsWith('/insurance_shipOwner/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-modify.insure' }),
      });
    }
    //查看投保面包屑
    if (pathname.startsWith('/insurance_shipOwner/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-check.insure' }),
      });
    }
  }

  //船东我的船舶面包屑
  if (pathname.startsWith('/myship')) {
    //我的船舶面包屑
    routes.push({
      path: '/myship/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-my.ship' }),
    });
    //新增船舶面包屑
    if (pathname.startsWith('/myship/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-the.newShip' }),
      });
    }
    //修改船舶面包屑
    if (pathname.startsWith('/myship/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-theModify.ship' }),
      });
    }
    //查看船舶面包屑
    if (pathname.startsWith('/myship/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-toCheck.theShip' }),
      });
    }
  }

  /**船东保证金,货主保证金面包屑开始*/
  //船东保证金面包屑
  if (pathname.startsWith('/depositpaymentowner')) {
    //保证金面包屑
    routes.push({
      path: '/depositpaymentowner/page',
      breadcrumbName: formatMessage({ id: 'BreadSetting-cash.deposit' }),
    });
  }
  //货主保证金面包屑
  else if (pathname.startsWith('/depositpayment')) {
    //保证金面包屑
    routes.push({
      path: '/depositpayment/page',
      breadcrumbName: formatMessage({ id: 'BreadSetting-cash.deposit' }),
    });
  }
  /**船东保证金,货主保证金面包屑结束*/

  /**船东结束*/

  /**货主开始*/

  //货主在线投保面包屑
  if (pathname.startsWith('/insurance_shipper')) {
    //在线投保面包屑
    routes.push({
      path: '/insurance_shipper/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-online.insure' }),
    });
    //新增投保面包屑
    if (pathname.startsWith('/insurance_shipper/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-new.insure' }),
      });
    }
    //修改投保面包屑
    if (pathname.startsWith('/insurance_shipper/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-modify.insure' }),
      });
    }
    //查看投保面包屑
    if (pathname.startsWith('/insurance_shipper/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-check.insure' }),
      });
    }
  }

  /**货主船舶交易查询，货主船舶交易开始*/

  //货主船舶交易查询面包屑
  if (pathname.startsWith('/shiptradequery')) {
    //船舶交易查询面包屑
    routes.push({
      path: '/shiptradequery/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Ship.transactionEnquiry' }),
    });
    //查看船舶交易信息面包屑
    if (pathname.startsWith('/shiptradequery/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-viewShip.transactionInformation' }),
      });
    }
  }

  //货主船舶交易面包屑
  else if (pathname.startsWith('/shipTrade')) {
    //船舶交易面包屑
    routes.push({
      path: '/shipTrade/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-ship.trading' }),
    });
    //新增船舶交易信息面包屑
    if (pathname.startsWith('/shipTrade/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-newShip.transactionInformation' }),
      });
    }
    //修改船舶交易信息面包屑
    if (pathname.startsWith('/shipTrade/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({
          id: 'BreadSetting-modificationOfShip.transactionInformation',
        }),
      });
    }
    //查看船舶交易信息面包屑
    if (pathname.startsWith('/shipTrade/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-viewShip.transactionInformation' }),
      });
    }
  }

  /**货主船舶交易查询，货主船舶交易结束*/
  /**船东我的订单, 货主我的订单，审核客服订单管理开始*/

  // 船东我的订单面包屑
  if (pathname.startsWith('/orderManagementowner')) {
    routes.push({
      path: '/orderManagementowner/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-my.order' }),
      //我的订单
    });
  }
  // 结算详情页面包屑
  else if (pathname.startsWith('/orderManagementExamine/settlement')) {
    routes.push({
      path: '',
      breadcrumbName: formatMessage({ id: 'BreadSetting-management.settlement' }),
      //我的订单
    });
  }

  // 审核客服订单管理面包屑
  else if (pathname.startsWith('/orderManagementExamine')) {
    routes.push({
      path: '/orderManagementExamine/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-management.order' }),
      //订单管理
    });
  }

  // 线下客服订单管理面包屑
  else if (pathname.startsWith('/orderManagementOff')) {
    routes.push({
      path: '/orderManagementOff/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-management.order' }),
      //订单管理
    });
    if (pathname.startsWith('/orderManagementOff/view/')) {
      routes.push({
        path: '/orderManagementOff/view/',
        breadcrumbName: formatMessage({ id: 'BreadSetting-PromotionOrder.vieworder' }),
      });
    }
  }

  // 线上客服订单管理面包屑
  else if (pathname.startsWith('/orderManagementON')) {
    routes.push({
      path: '/orderManagementON/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-management.order' }),
      //订单管理
    });
  }

  // 货主我的订单面包屑
  else if (pathname.startsWith('/orderManagement')) {
    routes.push({
      path: '/orderManagement/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-my.order' }),
      //我的订单
    });
  }

  /**船东我的订单, 货主我的订单，审核客服订单管理结束 */
  /**货主结束*/

  /**线下客服开始*/

  //线下客服新订单

  if (pathname.startsWith('/newOrder')) {
    //线下客服新订单面包屑
    routes.push({
      path: '/newOrder/list',
      breadcrumbName: formatMessage({ id: '新订单列表' }),
    }); //审核客服开票信息查看面包屑
    //   //审核客服推广审核查看面包屑
    //   if (pathname.startsWith('/newOrder/list')) {
    //     routes.push({
    //       path: '/newOrder/list',
    //       breadcrumbName: formatMessage({ id: '新订单列表' }),
    //     });
    //   }
    if (pathname.startsWith('/newOrder/view/')) {
      routes.push({
        path: '/newOrder/view/',
        breadcrumbName: formatMessage({ id: '新订单详情' }),
      });
    }
  }

  //线下客服卡车运输面包屑
  if (pathname.startsWith('/truckTransportation')) {
    //线下客服卡车运输面包屑
    routes.push({
      path: '/truckTransportation/list',
      breadcrumbName: formatMessage({ id: '卡车运输' }),
    }); //卡车运输查看面包屑

    if (pathname.startsWith('/truckTransportation/view/')) {
      routes.push({
        path: '/truckTransportation/view/',
        breadcrumbName: formatMessage({ id: '卡车运输详情' }),
      });
    }
  }

  //线下客服预订单面包屑
  if (pathname.startsWith('/advanceorder')) {
    //预订单面包屑
    routes.push({
      path: '/advanceorder/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-advance.order' }),
    });
    //合同页面面包屑
    if (pathname.startsWith('/advanceorder/contract')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-the.contractPage' }),
      });
    }
    //查看审核面包屑
    if (pathname.startsWith('/advanceorder/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-view.audit' }),
      });
    }
    if (pathname.startsWith('/advanceorder/check')) {
      //申请审核面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-application.audit' }),
      });
    }
  }

  //线下客服提单面包屑
  if (pathname.startsWith('/submission')) {
    //提单面包屑
    routes.push({
      path: '/submission/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-bill.ofLading' }),
    });
    //提单详情面包屑
    if (pathname.startsWith('/submission/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-detailsOfThe.ofLading' }),
      });
    }
    //提单详情面包屑
    if (pathname.startsWith('/submission/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-detailsOfThe.ofLading' }),
      });
    }
  }
  //线下客服船舶交易面包屑
  if (pathname.startsWith('/ShipTrading')) {
    //提单面包屑
    routes.push({
      path: '/ShipTrading/list',
      breadcrumbName: formatMessage({ id: 'ShipTrade-ShipTradeList.shipTrade' }),
    });
    //提单详情面包屑
    if (pathname.startsWith('/ShipTrading/view')) {
      routes.push({
        path: '',
        breadcrumbName: '船舶挂牌',
      });
    }
    //提单详情面包屑
    if (pathname.startsWith('/ShipTrading/aucTionView')) {
      routes.push({
        path: '',
        breadcrumbName: '买船',
      });
    }
  }
  //线下客服订舱面包屑
  if (pathname.startsWith('/linerBooking')) {
    //订舱面包屑
    routes.push({
      path: '/linerBooking/list',
      breadcrumbName: '订舱',
    });
    //订舱新增面包屑
    if (pathname.startsWith('/linerBooking/add')) {
      routes.push({
        path: '',
        breadcrumbName: '订舱新增',
      });
    }
    //订舱详情面包屑
    if (pathname.startsWith('/linerBooking/view/')) {
      routes.push({
        path: '',
        breadcrumbName: '订舱详情',
      });
    }
    if (pathname.startsWith('/linerBooking/editBia/')) {
      routes.push({
        path: '',
        breadcrumbName: '订舱详情',
      });
    }
  }
  //线下客服集装箱面包屑
  if (pathname.startsWith('/containerTrading')) {
    //买卖面包屑
    routes.push({
      path: '/containerTrading/list',
      breadcrumbName: '集装箱买卖',
    });
    //买卖新增面包屑
    if (pathname.startsWith('/containerTrading/add')) {
      routes.push({
        path: '',
        breadcrumbName: '集装箱新增',
      });
    }
    //买卖详情面包屑
    if (pathname.startsWith('/containerTrading/view/')) {
      routes.push({
        path: '',
        breadcrumbName: '集装箱详情',
      });
    }
    if (pathname.startsWith('/containerTrading/editBia/')) {
      routes.push({
        path: '',
        breadcrumbName: '集装箱详情',
      });
    }
  }

  //线下客服车型新增面包屑
  if (pathname.startsWith('/carType')) {
    //线下客服车型新增面包屑
    routes.push({
      path: '/carType/list',
      breadcrumbName: formatMessage({ id: '车船新增' }),
    });
    //   //线下客服车型新增面包屑
    //   if (pathname.startsWith('/carType/view/')) {
    //     routes.push({
    //       path: '/carType/view/',
    //       breadcrumbName: formatMessage({ id: '卡车运输详情' }),
    //     });
    //   }
  }
  //线下客服特种车船供应商管理面包屑
  if (pathname.startsWith('/specialShip')) {
    //线下客服特种车船供应商管理面包屑
    routes.push({
      path: '/specialShip/list',
      breadcrumbName: formatMessage({ id: '特种车船供应商管理' }),
    }); //特种车船供应商管理查看面包屑

    if (pathname.startsWith('/specialShip/view/')) {
      routes.push({
        path: '/specialShip/view/',
        breadcrumbName: formatMessage({ id: '特种车船供应商管理详情' }),
      });
    }
  }

  //线下客服特种车商品管理面包屑
  if (pathname.startsWith('/specialCar')) {
    //线下客服特种车船供应商管理面包屑
    routes.push({
      path: '/specialCar/list',
      breadcrumbName: formatMessage({ id: '特种车商品管理' }),
    }); //特种车船供应商管理查看面包屑

    if (pathname.startsWith('/specialCar/view/')) {
      routes.push({
        path: '/specialCar/view/',
        breadcrumbName: formatMessage({ id: '卡车运输详情' }),
      });
    }
  }
  //线下招商信息面包屑
  if (pathname.startsWith('/attractInvestment')) {
    routes.push({
      path: '/attractInvestment/list',
      breadcrumbName: formatMessage({ id: '招商信息' }),
    });
  }

  //线下客服现舱竞拍
  if (pathname.startsWith('/AuctionCustomer')) {
    //买卖面包屑
    routes.push({
      path: '/AuctionCustomer/list',
      breadcrumbName: '现舱竞拍列表',
    });
    //买卖新增面包屑
    if (pathname.startsWith('/AuctionCustomer/edit')) {
      routes.push({
        path: '',
        breadcrumbName: '现舱竞拍',
      });
    }
    //买卖详情面包屑
    if (pathname.startsWith('/AuctionCustomer/view/')) {
      routes.push({
        path: '',
        breadcrumbName: '现舱竞拍详情',
      });
    }
    if (pathname.startsWith('/AuctionCustomer/editBia/')) {
      routes.push({
        path: '',
        breadcrumbName: '现舱竞拍详情',
      });
    }
  }

  //线下客服集装箱租赁面包屑
  if (pathname.startsWith('/containerOrder')) {
    //租赁面包屑
    routes.push({
      path: '/containerOrder/list',
      breadcrumbName: '集装箱租赁',
    });
    //租赁新增面包屑
    if (pathname.startsWith('/containerOrder/add')) {
      routes.push({
        path: '',
        breadcrumbName: '集装箱新增',
      });
    }
    //租赁详情面包屑
    if (pathname.startsWith('/containerOrder/view/')) {
      routes.push({
        path: '',
        breadcrumbName: '集装箱详情',
      });
    }
    if (pathname.startsWith('/containerOrder/editBia/')) {
      routes.push({
        path: '',
        breadcrumbName: '集装箱详情',
      });
    }
  }

  //线下客服集装箱租赁面包屑
  if (pathname.startsWith('/containerSpike')) {
    //租赁面包屑
    routes.push({
      path: '/containerSpike/list',
      breadcrumbName: '现舱秒杀列表',
    });
    //租赁新增面包屑
    if (pathname.startsWith('/containerSpike/edit')) {
      routes.push({
        path: '',
        breadcrumbName: '现舱秒杀',
      });
    }
    //租赁详情面包屑
    if (pathname.startsWith('/containerSpike/view/')) {
      routes.push({
        path: '',
        breadcrumbName: '现舱秒杀详情',
      });
    }
    if (pathname.startsWith('/containerSpike/editBia/')) {
      routes.push({
        path: '',
        breadcrumbName: '现舱秒杀详情',
      });
    }
  }
  //线下客服船舶备件面包屑
  if (pathname.startsWith('/spartPart')) {
    routes.push({
      path: '/spartPart/list',
      breadcrumbName: '船舶备件',
    });
    if (pathname.startsWith('/spartPart/view')) {
      routes.push({
        path: '',
        breadcrumbName: '备件编辑',
      });
    }
    if (pathname.startsWith('/spartPart/add')) {
      routes.push({
        path: '',
        breadcrumbName: '新增备件',
      });
    }
  }
  //线下客服船员培训面包屑
  if (pathname.startsWith('/CrewTraining')) {
    routes.push({
      path: '/CrewTraining',
      breadcrumbName: '船员培训报名列表',
    });
    if (pathname.startsWith('/CrewTraining/view')) {
      routes.push({
        path: '',
        breadcrumbName: '船员培训信息详情',
      });
    }
    if (pathname.startsWith('/CrewTraining/add')) {
      routes.push({
        path: '',
        breadcrumbName: '发布船员培训信息',
      });
    }
    if (pathname.startsWith('/CrewTraining/Train')) {
      routes.push({
        path: '/Train/list',
        breadcrumbName: '船员培训列表',
      });
      if (pathname.startsWith('/CrewTraining/Train/Edit')) {
        routes.push({
          path: '',
          breadcrumbName: '编辑培训信息',
        });
      }
      if (pathname.startsWith('/CrewTraining/Train/view')) {
        routes.push({
          path: '',
          breadcrumbName: '船员培训信息详情',
        });
      }
    }
  }
  //线下客服用户查询面包屑
  if (pathname.startsWith('/downusersearch')) {
    //用户查询面包屑
    routes.push({
      path: '/downusersearch/usersearch',
      breadcrumbName: formatMessage({ id: 'BreadSetting-user.query' }),
    });
  }

  /**线下客服结束*/

  /**线上客服开始*/

  //BUG
  // 线上客服供需匹配面包屑
  if (pathname.startsWith('/sudeMatch')) {
    //供需匹配面包屑
    routes.push({
      path: '/sudeMatch/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-matcheSupply.demand' }),
    });
    //匹配面包屑
    if (pathname.startsWith('/sudeMatch/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-matching' }),
      });
    }
    //匹配面包屑
    if (pathname.startsWith('/sudeMatch/detail')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-matching' }),
      });
      //查看货盘面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Check.pallets' }),
      });
    }
  }

  //线上客服用户查询面包屑
  if (pathname.startsWith('/usersearch')) {
    //用户查询面包屑
    routes.push({
      path: '/usersearch/usersearch',
      breadcrumbName: formatMessage({ id: 'BreadSetting-user.query' }),
    });
  }

  //线上客服保险管理面包屑
  if (pathname.startsWith('/insuranceCompanyList')) {
    //保险管理面包屑
    routes.push({
      path: '',
      breadcrumbName: formatMessage({ id: 'BreadSetting-insuranceCompanyList.list' }),
    });
  }

  /**线上客服结束*/

  /**审核客服开始*/

  //审核客服认证审核面包屑
  if (pathname.startsWith('/usercertification')) {
    //认证审核面包屑
    routes.push({
      path: '/usercertification/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-certification.audit' }),
    });
    //资料认证面包屑
    if (pathname.startsWith('/usercertification/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-data.authentication' }),
      });
    }
  }

  //审核客服船舶审核面包屑
  if (pathname.startsWith('/shipcertification')) {
    //船舶认证面包屑
    routes.push({
      path: '/shipcertification/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-ship.certification' }),
    });
    //船舶信息面包屑
    if (pathname.startsWith('/shipcertification/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-ship.information' }),
      });
    }
  }

  //审核客服预订单审核面包屑
  if (pathname.startsWith('/ceradvanceorder')) {
    //预订单审核面包屑
    routes.push({
      path: '/ceradvanceorder/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-book.approval' }),
    });
    //申请审核面包屑
    if (pathname.startsWith('/ceradvanceorder/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-toAapply forReview' }),
      });
    }
  }

  //审核客服保险需求面包屑
  if (pathname.startsWith('/insuranceonline')) {
    //保险需求面包屑
    routes.push({
      path: '/insuranceonline/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-insurance.demand' }),
    });
    //货主查询面包屑
    if (pathname.startsWith('/insuranceonline/shipperview')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-view.insuranceInformation' }),
      });
    }
    //船东查询面包屑
    if (pathname.startsWith('/insuranceonline/shipownerview')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-view.insuranceInformation' }),
      });
    }
  }

  //审核客服船舶需求面包屑
  if (pathname.startsWith('/shipneeds')) {
    //船舶需求面包屑
    routes.push({
      path: '/shipneeds/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-shipping.requirements' }),
    });
    //查看船舶交易信息面包屑
    if (pathname.startsWith('/shipneeds/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-viewShip.transactionInformation' }),
      });
    }
  }

  //审核客服紧急需求面包屑
  if (pathname.startsWith('/checkemergency')) {
    routes.push({
      path: '/checkemergency/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Urgent.need' }),
    });
    //紧急需求面包屑
    if (pathname.startsWith('/checkemergency/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.demandRelease' }),
      });
    }
    //紧急需求修改面包屑
    if (pathname.startsWith('/checkemergency/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.needsModification' }),
      });
    }
    //紧急需求查看面包屑
    if (pathname.startsWith('/checkemergency/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Emergency.needsView' }),
      });
    }
  }

  //审核客服用户查询面包屑
  if (pathname.startsWith('/checkusersearch')) {
    //用户查询面包屑
    routes.push({
      path: '/checkusersearch/usersearch',
      breadcrumbName: formatMessage({ id: 'BreadSetting-user.query' }),
    });
  }

  //审核客服保险管理面包屑
  if (pathname.startsWith('/checkInsureCompany')) {
    //保险管理面包屑
    routes.push({
      path: '/checkInsureCompany',
      breadcrumbName: formatMessage({ id: 'BreadSetting-insurance.management' }),
    });
  }

  //审核客服货盘查询面包屑
  if (pathname.startsWith('/customerpalletdynamics')) {
    //货盘动态面包屑
    routes.push({
      path: '/customerpalletdynamics/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-Pallet.dynamics' }),
    });
    if (pathname.startsWith('/customerpalletdynamics/view')) {
      //查看货盘面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-Check.pallets' }),
      });
    }
  }

  //审核客服航次查询面包屑
  if (pathname.startsWith('/customervoyagedynamics')) {
    //航次动态面包屑
    routes.push({
      path: '/customervoyagedynamics/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.dynamic' }),
    });
    //航次查看面包屑
    if (pathname.startsWith('/customervoyagedynamics/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.toView' }),
      });
    }
  }

  //审核客服航线配置面包屑
  if (pathname.startsWith('/customervoyageLine')) {
    //航线配置面包屑
    routes.push({
      path: '/customervoyageLine/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.line' }),
    });
    //航线配置查看面包屑
    if (pathname.startsWith('/customervoyageLine/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-check.voyageline' }),
      });
    }
  }

  //审核客服推广审核配置面包屑
  if (pathname.startsWith('/promotionaudit')) {
    //航线配置面包屑
    routes.push({
      path: '/promotionaudit/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-ToPromoteAudit.list' }),
    });
    //审核客服推广审核查看面包屑
    if (pathname.startsWith('/promotionaudit/view')) {
      routes.push({
        path: 'promotionaudit/view',
        breadcrumbName: formatMessage({ id: 'BreadSetting-ToPromoteAudit.view' }),
      });
    }
  }

  //审核客服推广订单审核面包屑
  if (pathname.startsWith('/adsOrder')) {
    //航线配置面包屑
    routes.push({
      path: '/adsOrder/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-PromotionOrder.list' }),
    });
    //审核客服推广审核查看面包屑
    if (pathname.startsWith('/adsOrder/view')) {
      routes.push({
        path: 'adsOrder/view',
        breadcrumbName: formatMessage({ id: 'BreadSetting-PromotionOrder.view' }),
      });
    }
  }

  //审核客服消息推送面包屑
  if (pathname.startsWith('/manualMessage')) {
    //航线配置面包屑
    routes.push({
      path: '/manualMessage/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-manualMessage.list' }),
    });
    //审核客服消息推送查看面包屑
    if (pathname.startsWith('/manualMessage/view')) {
      routes.push({
        path: '/manualMessage/view',
        breadcrumbName: formatMessage({ id: 'BreadSetting-manualMessage.view' }),
      });
    }
  }

  //审核客服订单流水审核面包屑
  if (pathname.startsWith('/orderFlow')) {
    //航线配置面包屑
    routes.push({
      path: '/orderFlow/list',
      breadcrumbName: formatMessage({ id: '订单流水审核' }),
    }); //审核客服推广审核查看面包屑
    if (pathname.startsWith('/orderFlow/view')) {
      routes.push({
        path: 'orderFlow/view',
        breadcrumbName: formatMessage({ id: '订单流水审核详情' }),
      });
    } //审核客服开票信息查看面包屑
    if (pathname.startsWith('/orderFlow/make')) {
      routes.push({
        path: 'orderFlow/make',
        breadcrumbName: formatMessage({ id: '查看开票信息' }),
      });
    }
  }

  /**审核客服结束*/

  /**管理员开始*/

  //管理员基础信息字典类型面包屑
  if (pathname.startsWith('/dicttype')) {
    //基础信息面包屑
    routes.push({
      path: '/dicttype/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-basic.information' }),
    });
    //字典类型面包屑
    if (pathname.startsWith('/dicttype/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-adictionary.type' }),
      });
    }
    //字典类型面包屑
    if (pathname.startsWith('/dicttype/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-adictionary.type' }),
      });
    }
  }

  //管理员基础信息字典类型面包屑
  if (pathname.startsWith('/dictconfig')) {
    //基础信息面包屑
    routes.push({
      path: '/dictconfig/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-basic.information' }),
    });
    //字典配置面包屑
    if (pathname.startsWith('/dictconfig/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-thedictionary.configuration' }),
      });
    }
    //字典配置面包屑
    if (pathname.startsWith('/dictconfig/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-thedictionary.configuration' }),
      });
    }
  }

  //管理员权限管理客服管理面包屑
  if (pathname.startsWith('/customerManage')) {
    //权限管理面包屑
    routes.push({
      path: '/customerManage/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-activity.management' }),
    });
    //客服管理面包屑
    if (pathname.startsWith('/customerManage/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-theCustomer.serviceManaging' }),
      });
    }
  }

  //管理员权限管理客服管理面包屑
  if (pathname.startsWith('/rolemanage')) {
    //权限管理面包屑
    routes.push({
      path: '/rolemanage/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-activity.management' }),
    });
    //角色管理面包屑
    if (pathname.startsWith('/rolemanage/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-role.management' }),
      });
    }
    //角色管理面包屑
    if (pathname.startsWith('/rolemanage/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-role.management' }),
      });
      //查看角色信息面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-view.roleInformation' }),
      });
    }
  }

  //货主航次动态面包屑
  if (pathname.startsWith('/voyagedynamics')) {
    //航次动态面包屑
    routes.push({
      path: '/voyagedynamics/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.dynamic' }),
    });
    //航次查看面包屑
    if (pathname.startsWith('/voyagedynamics/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.toView' }),
      });
    }
  }

  // //管理员港口管理航线信息维护面包屑
  // else if (pathname.startsWith('/voyageline')) {
  //   //港口管理面包屑
  //   routes.push({
  //     path: '/voyageline/list',
  //     breadcrumbName: formatMessage({ id: 'BreadSetting-port.management' }),
  //   });
  //   //航线信息维护面包屑
  //   if (pathname.startsWith('/voyageline/list')) {
  //     routes.push({
  //       path: '',
  //       breadcrumbName: formatMessage({ id: 'BreadSetting-route.informationMaintenance' }),
  //     });
  //   }
  //   //配置面包屑
  //   routes.push({
  //     path: '',
  //     breadcrumbName: formatMessage({ id: 'BreadSetting-configuration' }),
  //   });
  // }

  //船东航次配置面包屑
  else if (pathname.startsWith('/voyageline')) {
    //航次配置面包屑
    routes.push({
      path: '/voyageline/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.allocation' }),
    });
  }

  //船东航次发布面包屑
  else if (pathname.startsWith('/voyage')) {
    //航次发布面包屑
    routes.push({
      path: '/voyage/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.toRelease' }),
    });
    //航次新增面包屑
    if (pathname.startsWith('/voyage/add')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.toNew' }),
      });
    }
    //航次修改面包屑
    if (pathname.startsWith('/voyage/edit')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.toModify' }),
      });
    }
    //航次查看面包屑
    if (pathname.startsWith('/voyage/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-voyage.toView' }),
      });
    }
  }

  //管理员港口管理港口信息维护面包屑
  if (pathname.startsWith('/port')) {
    //港口管理面包屑
    routes.push({
      path: '/port/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-port.management' }),
    });
    //港口信息维护面包屑
    if (pathname.startsWith('/port/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-port.informationMaintenance' }),
      });
    }
  }

  //管理员站内信息站内信息维护面包屑
  if (pathname.startsWith('/message')) {
    //站内信息面包屑
    routes.push({
      path: '/message/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-message.center' }),
    });
    //站内信息维护面包屑
    if (pathname.startsWith('/message/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-station.informationMaintenance' }),
      });
    }
    //站内信息维护面包屑
    if (pathname.startsWith('/message/detail')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-station.informationMaintenance' }),
      });
    }
  }

  // 管理员保险管理保险公司维护面包屑
  if (pathname.startsWith('/insureCompany')) {
    //保险管理面包屑
    routes.push({
      path: '/insureCompany/list',
      breadcrumbName: formatMessage({ id: 'BreadSetting-insurance.management' }),
    });
    //保险公司维护面包屑
    if (pathname.startsWith('/insureCompany/list')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-insurance.companyMaintenance' }),
      });
    }
    //保险公司维护面包屑
    if (pathname.startsWith('/insureCompany/view')) {
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-insurance.companyMaintenance' }),
      });
      //查看保险信息面包屑
      routes.push({
        path: '',
        breadcrumbName: formatMessage({ id: 'BreadSetting-view.insuranceInformation' }),
      });
    }
  }
  /**管理员结束*/
  return routes;
};
