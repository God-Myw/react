import { getRequest } from '@/utils/request';
import { getTableEnumText } from '@/utils/utils';
import { Col, Form, Input, Row } from 'antd';
import { isNil } from 'lodash';
import moment from 'moment';
import React from 'react';
import AdvanceorderFormProps from './AdvanceorderFormInterface';

class AdvanceorderAdd extends React.Component<AdvanceorderFormProps, AdvanceorderFormProps> {
    certification = '';
    constructor(props: AdvanceorderFormProps) {
        super(props);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState(
            {
                previewVisible: false,
                previewImage: '',
            },
            () => {
                let uid = this.props.match.params['guid'] ? this.props.match.params['guid'] : '';
                if (uid) {
                    let param: Map<string, string> = new Map();
                    param.set('type', '1');
                    getRequest('/business/order/' + uid, param, (response: any) => {
                        if (response.status === 200) {
                            if (!isNil(response.data)) {
                                //  if (response.data.userDataChecks.guid === id) {
                                this.setState({
                                    voyage: response.data.orderVoyage.voyage,//航次对象
                                    voyagePort: response.data.orderVoyage.voyagePort,//航线途径港
                                    pallet: response.data.orderPallet.pallet,//货盘对象
                                    order: response.data.order,//订单对象
                                    ship: response.data.orderVoyage.ship,//船舶对象
                                    voyageLineName: response.data.orderVoyage.voyageLineName,
                                    attachments: response.data.attachments,//附件
                                    checkRemark: response.data.checkRemark ? response.data.checkRemark : '',
                                    bigEvent: response.data.orderPallet.pallet.majorParts === 1 ? '是' : '否',
                                });
                            }
                        }
                    });
                }
            },
        );
    }

    render() {
        const formlayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const smallFormItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const smallerFormItemLayout = {
            labelCol: { span: 18 },
            wrapperCol: { span: 6 },
        };
        return (
            <div>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item {...formlayout} label="货物名称">
                            <Input
                                disabled
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.goodsLevel)
                                        ? ''
                                        : getTableEnumText('goods_name', this.state.pallet.goodsLevel)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item {...formlayout} label="货物类型">
                            <Input
                                disabled
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.goodsType)
                                        ? ''
                                        : getTableEnumText('goods_type', this.state.pallet.goodsType)
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item {...formlayout} label="货物存放位置">
                            <Input
                                disabled
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.location)
                                        ? ''
                                        : getTableEnumText('cargo_save_location', this.state.pallet.location)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item {...formlayout} label="货物性质">
                            <Input
                                disabled
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.goodsProperty)
                                        ? ''
                                        : getTableEnumText('goods_property', this.state.pallet.goodsProperty)
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item {...formlayout} label="货物重量">
                            <Input
                                disabled
                                className="OnlyRead"
                                suffix="吨"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.goodsWeight)
                                        ? ''
                                        : this.state.pallet.goodsWeight
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="体积">
                            <Input
                                disabled
                                className="OnlyRead"
                                suffix="m³"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.goodsVolume)
                                        ? ''
                                        : this.state.pallet.goodsVolume
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="货物件数">
                            <Input
                                disabled
                                suffix="件"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.goodsCount)
                                        ? ''
                                        : this.state.pallet.goodsCount
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="是否可叠加">
                            <Input
                                disabled
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.isSuperposition)
                                        ? ''
                                        : getTableEnumText('is_superposition', this.state.pallet.isSuperposition)
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="起运港">
                            <Input
                                disabled
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.startPort)
                                        ? ''
                                        : getTableEnumText('port', this.state.pallet.startPort)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="目的港">
                            <Input
                                disabled
                                className="OnlyRead"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.destinationPort)
                                        ? ''
                                        : getTableEnumText('port', this.state.pallet.destinationPort)
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {(!isNil(this.state) && !isNil(this.state.pallet) && String(this.state.pallet.goodsProperty) === '3') ?
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item  {...formlayout} label="卸货天数">
                                <Input
                                    disabled
                                    className="OnlyRead"
                                    suffix="天"
                                    value={
                                        isNil(this.state) ||
                                            isNil(this.state.pallet) ||
                                            isNil(this.state.pallet.unloadingDays)
                                            ? ''
                                            : this.state.pallet.unloadingDays
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item  {...formlayout} label="装卸货量">
                                <Input
                                    disabled
                                    className="OnlyRead"
                                    suffix="%"
                                    value={
                                        isNil(this.state) ||
                                            isNil(this.state.pallet) ||
                                            isNil(this.state.pallet.loadingUnloadingVolume)
                                            ? ''
                                            : this.state.pallet.loadingUnloadingVolume
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    : null}
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="受载日期">
                            <Input
                                disabled
                                className="OnlyRead"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.loadDate)
                                        ? ''
                                        : moment(Number(this.state.pallet.loadDate)).format('YYYY/MM/DD')
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="截止日期">
                            <Input
                                disabled
                                className="OnlyRead"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.endDate)
                                        ? ''
                                        : moment(Number(this.state.pallet.endDate)).format('YYYY/MM/DD')
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="联系人">
                            <Input
                                disabled
                                className="OnlyRead"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.pallet) ||
                                        isNil(this.state.pallet.contacter)
                                        ? ''
                                        : this.state.pallet.contacter
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item {...formlayout} label="联系方式">
                            <Input
                                disabled
                                placeholder="+86"
                                style={{ width: '15%' }}
                                value={isNil(this.state) ||
                                    isNil(this.state.pallet) ||
                                    isNil(this.state.pallet.phoneCode)
                                    ? ''
                                    : this.state.pallet.phoneCode
                                }
                            />
                            <Input
                                disabled
                                style={{ width: '85%' }}
                                value={isNil(this.state) ||
                                    isNil(this.state.pallet) ||
                                    isNil(this.state.pallet.contactPhone)
                                    ? ''
                                    : this.state.pallet.contactPhone}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item  {...formlayout} label="是否为重大件">
                            <Input
                                disabled
                                className="OnlyRead"
                                value={
                                    isNil(this.state) ||
                                        isNil(this.state.bigEvent)
                                        ? ''
                                        : this.state.bigEvent
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    }
}

const GoodsListForm = Form.create({ name: 'GoodsListForm' })(AdvanceorderAdd);

export default GoodsListForm;
