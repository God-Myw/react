import { Col, Form, Input, Row } from 'antd';
import React from 'react';
import AdvanceorderFormProps, { Pallet } from './AdvanceorderFormInterface';
import { getTableEnumText } from '@/utils/utils';
import moment from 'moment';
import { isNil } from 'lodash';

interface IProp {
  pallet: Pallet
}

class GoodsList extends React.Component<IProp, AdvanceorderFormProps> {
  constructor(props: IProp) {
    super(props);
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
    const { pallet } = this.props;
    // console.log(pallet)
    if (pallet == null) {
      return null;
    } else {
      return (
        <div>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="货物名称">
                <Input
                  disabled
                  value={pallet.titleCnPallet}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="货物类型">
                <Input
                  disabled
                  value={pallet.titleCnType}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="货物存放位置">
                <Input
                  disabled
                  value={pallet.location == 0?'舱内':'甲板'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="货物性质">
                <Input
                  disabled
                  value={pallet.titleCNProperty}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="货物重量">
                <Input
                  disabled
                  className="OnlyRead"
                  suffix="吨"
                  value={pallet.goodsWeight}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="体积">
                <Input
                  disabled
                  className="OnlyRead"
                  suffix="m³"
                  value={pallet.goodsVolume}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="货物件数">
                <Input
                  disabled
                  suffix="件"
                  value={pallet.goodsCount}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="是否可叠加">
                <Input
                  disabled
                  value={ pallet.isSuperposition == 1 ? '可以' : '不可以'}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="起运港">
                <Input
                  disabled
                  value={pallet.titleCnStart}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="目的港">
                <Input
                  disabled
                  className="OnlyRead"
                  value={pallet.titleCnDes}
                />
              </Form.Item>
            </Col>
          </Row>
          {(!isNil(pallet) && String(pallet.goodsProperty) === '3') ?
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="卸货天数">
                <Input
                  disabled
                  className="OnlyRead"
                  suffix="天"
                  value={pallet.unloadingDays}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="装卸货量">
                <Input
                  disabled
                  className="OnlyRead"
                  suffix="%"
                  value={pallet.loadingUnloadingVolume}
                />
              </Form.Item>
            </Col>
          </Row>
          : null}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item required {...formlayout} label="受载日期">
                <Input
                  disabled
                  className="OnlyRead"
                  value={new Date(pallet.loadDate).getFullYear() + '-' + (new Date(pallet.loadDate).getMonth() + 1) + '-' + new Date(pallet.loadDate).getDate()}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item required {...formlayout} label="截止日期">
                <Input
                  disabled
                  className="OnlyRead"
                  value={new Date(pallet.endDate).getFullYear() + '-' + (new Date(pallet.endDate).getMonth() + 1) + '-' + new Date(pallet.endDate).getDate()}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
          <Col span={12}>
              <Form.Item required {...formlayout} label="联系人">
                <Input
                  disabled
                  className="OnlyRead"
                  value={pallet.contacter}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
                  <Form.Item required {...formlayout} label="联系方式">
                  <Input
                    disabled
                    placeholder="+86"
                    style={{ width: '15%' }}
                    value={pallet.phoneCode}
                  />
                  <Input
                    disabled
                    style={{ width: '85%' }}
                    value={pallet.contactPhone}
                  />
                  </Form.Item>
                </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item required {...formlayout} label="是否为重大件">
                <Input
                  disabled
                  className="OnlyRead"
                  style={{ marginLeft: '-1%' }}
                  value={pallet.majorParts === 0 ? '否' : '是'}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }
  }
}

const GoodsListForm = Form.create({ name: 'GoodsListForm' })(GoodsList);

export default GoodsListForm;
