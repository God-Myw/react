/**
 * 文件上传Type一览
 */
export const fileType = {
    pallet_shipper_authentication: 'user', // 营业执照	货主-船东-资料认证
    pallet_add: 'pallet', // 货物清单	货主-新增货盘
    ship_certificate_registry: 'ship', // 船舶登记证书	船舶-新增船舶
    ship_compliance_certificate: 'user', // 船公司安全管理符合证明 DOC 船东-资料认证
    ship_safety_management_certificate: 'shiptrade', // 船舶安全管理证书 SMC	船东-资料认证
    ship_load_line_certificate: 'user', // 载重线证书	船东-货主-船舶交易
    ship_charter_party: 'ship', // 租船合同	船舶-我的船舶
    ship_pANDi_certificate: 'ship', // P&I证书 船东-新增船舶
    ship_agreement: 'order', // 协议上传	线下客服-申请审核
    ship_document: 'order', // 单证上传	线下客服-申请审核
    ship_picture: 'shiptrade', // 船舶照片	船东-货主-船舶交易
    ship_front_payment_slip: 'order', // 定金流水单	货主-支付定金
    ship_final_payment_slip: 'order', // 尾款流水单	货主-支付尾款
    ship_lading_bill: 'order', // 提单	线下客服-上传提单
    ship_inspection_certificate: 'shiptrade', // 船舶检验证书	船东-货主-船舶交易
    ship_ownership_certificate: 'shiptrade', // 船舶所有权证书	船东-货主-船舶交易
    ship_code_certificate: 'shiptrade', // 船舶规范证书	船东-货主-船舶交易
    ship_seaworthiness_certificate: 'shiptrade', // 船舶适航证书	船东-货主-船舶交易
    ship_settle: 'order', // 结算	审核客服-结算详情
    ship_deposit_slip: 'user', // 保证金流水单	船东-货主-支付保证金
    ship_photo: 'ship',//船舶照片  船东-新增船舶
    ship_spare: 'spart',//商品轮播图  新增船舶供应
}