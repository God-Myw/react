import React from 'react';
import { Col, Form, Input, Icon, Row, Button, Card, Table, Select, Upload } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import commonCss from '../../Common/css/CommonCss.less';
import '@wangeditor/editor/dist/css/style.css';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '../../../components/WangEditor';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import { getRequest, postRequest } from '@/utils/request';
import { HandleBeforeUpload } from '@/utils/validator';
import { isNil, forEach } from 'lodash';
import { PicList, StoreList, ShipSparePartsViewFormProps } from './ShipSparePartsForminterface';
import { FormattedMessage } from 'umi-plugin-locale';
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">
      <FormattedMessage id="ShipownerShipTrade-ShipownerShipTradeAddForSale.upload" />
    </div>
  </div>
);
const defaultContent = [{ type: 'paragraph', children: [{ text: '' }] }];

class ShipSparePartsView extends React.Component<ShipSparePartsViewFormProps> {
  private storeColumns: ColumnProps<StoreList>[] = [
    {
      title: '型号图片',
      dataIndex: 'imgUrl',
      align: 'center',
    },
    {
      title: '型号',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '库存',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '',
      align: 'center',
      dataIndex: 'index',
      // width: '3%',
      render: (v: any) => (
        <span style={{ cursor: 'pointer' }} onClick={() => this.storeListSub(v)}>
          <DeleteFilled style={{ fontSize: '20px', marginBottom: '30px' }} />
        </span>
      ),
    },
  ];
  state = {
    defaultContent: [],
    addName: '新增商品',
    storeCount: 1,
    guid: '',
    checkFile: [],
    checkFileList: [],
    editor: null,
    storeColumns: this.storeColumns,
    storeData: [],
    checkflag: true,
    brand: '',
    createDate: '',
    creater: '',
    deleteFlag: '',
    details: '',
    model: '',
    money: null,
    number: '',
    partExplain: [],
    picList: [],
    TwoLevelAll: [],
    oneLeave: '',
    twoLeave: '',
    placeOf: '',
    spartParts: [
      {
        index: 0,
        partPicList: [],
        model: '',
        spartMoney: '',
        quantity: '',
      },
    ],
    tradeName: '',
    updateDate: '',
    updater: '',
    views: 0,
  };

  //初期化事件
  componentDidMount() {
    this.setState({
      editor: null,
    });
    this.initData();
  }

  initData() {
    // 所有二级分类
    let params: Map<string, any> = new Map();
    getRequest('/business/spartLevel/getSpartTwoLevelAll', params, (response: any) => {
      let TwoLevelAll = response.data.map((item: any) => {
        return <Select.Option value={item.twoLevelName}>{item.twoLevelName}</Select.Option>;
      });
      this.setState({ TwoLevelAll: TwoLevelAll });
    });
    this.getShipSparePartsView(this.props.match.params.guid);
  }
  //模拟数据
  getShipSparePartsView = (guid: any) => {
    let params: Map<string, string> = new Map();
    params.set('guid', guid || '');
    getRequest('/business/spart/getSpartById', params, response => {
      if (response.status === 200 && !isNil(response)) {
        let data = response.data;
        let storeData: any = [];
        if (data.spartParts) {
          data.spartParts.map((v: any, i: any) => {
            const storeObj: {
              index?: String;
              imgUrl?: any;
              type?: any;
              price?: any;
              count?: any;
            } = {
              index: i,
              imgUrl: (
                <Upload
                  action={'/api/sys/file/upLoadFuJian/' + fileType.ship_spare}
                  listType="picture-card"
                  accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                  beforeUpload={HandleBeforeUpload.bind(this)}
                  headers={{ token: String(localStorage.getItem('token')) }}
                  // defaultFileList={[...v.partPicList] || ''}
                  onRemove={this.onRemoveCheck}
                  onPreview={this.handlePreview}
                  onChange={(info: any) => {
                    const dataSource = [];
                    if (!isNil(info.file.status) && info.file.status === 'done') {
                      let fileLists: PicList = {};
                      fileLists.fileName = info.file.response.data.fileName;
                      fileLists.type = fileType.ship_spare;
                      fileLists.fileLog = 49;
                      dataSource.push(fileLists);
                    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
                      this.setState({ checkflag: true });
                    }
                    const spartParts: any = [...this.state.spartParts];
                    const spartParts2: any = this.state.spartParts.filter(
                      (item: any, i: any) => i == i,
                    );
                    const spartPartsInit: {
                      index?: any;
                      partPicList?: any;
                      model: any;
                      spartMoney: any;
                      quantity: any;
                    } = {
                      index: i,
                      partPicList: dataSource,
                      model: spartParts2[0].model,
                      spartMoney: spartParts2[0].spartMoney,
                      quantity: spartParts2[0].quantity,
                    };
                    spartParts.splice(storeObj.index, 1, spartPartsInit);
                    this.setState({
                      spartParts: spartParts,
                    });
                  }}
                >
                  {isNil(this.state) ||
                  isNil(this.state.checkFile) ||
                  this.state.checkFile.length < 1
                    ? uploadButton
                    : null}
                </Upload>
              ),
              type: (
                <Form.Item required>
                  <Input
                    defaultValue={v.model}
                    onChange={e => {
                      this.storeListChange(storeObj.index, 'model', e.target.value);
                    }}
                  ></Input>
                </Form.Item>
              ),
              price: (
                <Form.Item required>
                  <Input
                    defaultValue={v.spartMoney}
                    onChange={e => {
                      this.storeListChange(storeObj.index, 'spartMoney', e.target.value);
                    }}
                  ></Input>
                </Form.Item>
              ),
              count: (
                <Form.Item required>
                  <Input
                    defaultValue={v.quantity}
                    onChange={e => {
                      this.storeListChange(storeObj.index, 'quantity', e.target.value);
                    }}
                  ></Input>
                </Form.Item>
              ),
            };
            storeObj.index = i;
            storeData.push(storeObj);
          });
        }
        this.setState(
          {
            guid: data.guid || '',
            checkflag: data.checkflag || '',
            brand: data.brand || '',
            createDate: data.createDate || '',
            creater: data.creater || '',
            deleteFlag: data.deleteFlag || '',
            details: data.details || '',
            model: data.model || '',
            money: data.money || '',
            number: data.number || '',
            partExplain:
              this.partExplain([...new Set(data.partExplain.split('/'))].join('/')) || '',
            picList: data.picList || [],
            placeOf: data.placeOf || '',
            oneLevel: data.oneLevelId || '',
            twoLevel: data.twoLevelId || '',
            spartParts: data.spartParts || '',
            tradeName: data.tradeName || '',
            updateDate: data.updateDate || '',
            updater: data.updater || '',
            views: data.views || '',
            storeData: storeData || '',
            storeCount: storeData.length - 1 || 0,
          },
          () => {
            if (this.state.editor) {
              this.state.editor.setHtml(data.details);
            }
          },
        );
      }
    });
  };
  //商品图片
  handleChangeCheck = (info: any) => {
    let count = 0;
    const dataSource: {}[] = [];
    if (info.file.status === 'done' || info.file.status === 'removed') {
      const fileLists: PicList = {};
      forEach(info.fileList, (item: any) => {
        fileLists.fileName = item.response.data.fileName;
        fileLists.type = fileType.ship_spare;
        fileLists.fileLog = 48;
        dataSource.push(fileLists);
      });
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ checkflag: true });
    }
    this.setState({
      picList: dataSource,
      checkFileList: info.fileList,
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++;
      }
    });
    if (count === info.fileList.length) {
      this.setState({ checkflag: false });
    }
  };
  //商品型号价格库存
  storeListChange = (index: any, type: string, value: any) => {
    const spartParts: {
      index?: number;
      partPicList: any;
      model?: any;
      spartMoney?: any;
      quantity?: any;
    }[] = [...this.state.spartParts];
    spartParts[index][type] = value;
    this.setState({ spartParts: spartParts });
  };
  storeListSub = (index: number) => {
    let i = this.state.storeCount - 1;
    let storeList = this.state.storeData;
    let spartPartsList = this.state.spartParts;
    storeList = storeList.filter((item: any) => item.index !== index);
    spartPartsList = spartPartsList.filter((item: any, i: any) => i !== index);
    this.setState({
      editor: null,
      storeData: storeList,
      spartParts: spartPartsList,
      storeCount: i,
    });
  };
  storeListAdd = () => {
    let index = this.state.storeCount + 1;
    const spartPartsList: {}[] = [...this.state.spartParts];
    const spartParts: {
      index?: number;
      partPicList: any;
      model?: any;
      spartMoney?: any;
      quantity?: any;
    }[] = [
      {
        index: index,
        partPicList: [],
        model: '',
        spartMoney: '',
        quantity: '',
      },
    ];
    spartPartsList.push(...spartParts);
    const storeList: {}[] = [...this.state.storeData];
    const obj = {
      index: index,
      imgUrl: (
        <Upload
          action={'/api/sys/file/upLoadFuJian/' + fileType.ship_spare}
          listType="picture-card"
          accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
          beforeUpload={HandleBeforeUpload.bind(this)}
          headers={{ token: String(localStorage.getItem('token')) }}
          showUploadList={{
            showPreviewIcon: true,
            showDownloadIcon: false,
            showRemoveIcon: true,
          }}
          onChange={(info: any) => {
            const dataSource = [];
            if (!isNil(info.file.status) && info.file.status === 'done') {
              let fileLists: PicList = {};
              fileLists.fileName = info.file.response.data.fileName;
              fileLists.type = fileType.ship_spare;
              fileLists.fileLog = 49;
              dataSource.push(fileLists);
            } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
              this.setState({ checkflag: true });
            }
            const spartParts: any[] = [...this.state.spartParts];
            const spartParts2: any[] = this.state.spartParts.filter(
              (item: any, i: any) => i == index,
            );
            let spartPartsInit: {
              index?: any;
              partPicList?: any;
              model: any;
              spartMoney: any;
              quantity: any;
            } = {
              index: index,
              partPicList: dataSource,
              model: spartParts2[0].model,
              spartMoney: spartParts2[0].spartMoney,
              quantity: spartParts2[0].quantity,
            };
            // spartParts.push(spartPartsInit)
            spartParts.splice(index, 1, spartPartsInit);
            this.setState({
              spartParts: spartParts,
            });
          }}
        >
          {isNil(this.state) || isNil(this.state.checkFile) || this.state.checkFile.length < 3
            ? uploadButton
            : null}
        </Upload>
      ),
      type: (
        <Form.Item required>
          <Input
            onChange={e => {
              this.storeListChange(obj.index, 'model', e.target.value);
            }}
          />
        </Form.Item>
      ),
      price: (
        <Form.Item required>
          <Input
            onChange={e => {
              this.storeListChange(obj.index, 'spartMoney', e.target.value);
            }}
          />
        </Form.Item>
      ),
      count: (
        <Form.Item required>
          <Input
            onChange={e => {
              this.storeListChange(obj.index, 'quantity', e.target.value);
            }}
          />
        </Form.Item>
      ),
    };
    storeList.push(obj);
    this.setState({
      storeCount: index,
      storeData: storeList,
      spartParts: spartPartsList,
    });
  };
  //说明
  partExplain = (e: any) => {
    return e
      .split('/')
      .filter(Boolean)
      .map((v: any, i: number) => {
        return (
          <Input
            key={i}
            defaultValue={v}
            onBlur={e => {
              let explainArr = this.state.partExplain.map((item: any) => {
                return item.props.defaultValue;
              });
              explainArr[i] = e.target.value;
              this.setState({
                partExplain: this.partExplain(explainArr.join('/')),
              });
            }}
            style={{ width: '50%' }}
          />
        );
      });
  };
  getShipSparePartsEdit = () => {
    let partExplain: any = [
      ...new Set(
        this.state.partExplain.map((item: any) => {
          return item.props.defaultValue;
        }),
      ),
    ].join('/');
    let requestData = {
      guid: this.state.guid || '',
      tradeName: this.state.tradeName || '',
      brand: this.state.brand || '',
      placeOf: this.state.placeOf || '',
      picList: this.state.picList || '',
      spartParts: this.state.spartParts || '',
      partExplain: partExplain || '',
      details: this.state.details || '',
    };
    // 等编辑接口
    postRequest('/business/spart/saveSpart', JSON.stringify(requestData), response => {
      if (response.code === '0000' && response.status === 200) {
        this.props.history.push('/spartPart');
      }
    });
  };
  onRemoveCheck = () => {};
  handlePreview = () => {};
  render() {
    const formlayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    };
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const toolbarConfig = {
      excludeKeys: ['fullScreen'],
    };
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '请输入内容...',
      readOnly: false,
      onCreated: (editor: IDomEditor) => {
        this.setState({ editor });
      },
      onChange: (editor: IDomEditor) => {
        this.setState({ details: editor.getHtml() });
      },
      MENU_CONF: {
        uploadImage: {
          server: '/api/sys/file/upLoadFuJian/' + fileType.ship_spare,
          // timeout: 5 * 1000, // 5s
          fieldName: 'file',
          headers: {
            // accept: '.gif,.bmp,.png,.img,.jpeg,.jpg,.tiff',
            token: String(localStorage.getItem('token')),
          },

          // maxFileSize: 10 * 1024 * 1024, // 10M

          // base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb
          customInsert(res: any, insertFn: Function) {
            // res 即服务端的返回结果
            let url = `http://58.33.34.10:10443/images/spart/${res.data.fileName}`;
            let alt = '';
            let href = '';
            // 从 res 中找到 url alt href ，然后插入图片
            insertFn(url, alt, href);
          },
          onBeforeUpload(file: any) {
            return file;
          },
          onSuccess(file: any, res: any) {
            console.log('onSuccess', file, res);
          },
        },
      },
    };
    return (
      <div className="clearfix">
        <div className={commonCss.container}>
          <LabelTitleComponent
            text={this.state.addName}
            event={() => {
              this.props.history.push('/index_menu');
            }}
          />
          <Card bordered={false}>
            <Form labelAlign="left">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="一级分类">
                    <Select
                      // disabled
                      allowClear={true}
                      onSelect={(v: any) => {
                        this.setState({ oneLeave: v.target.value });
                      }}
                      placeholder="请选择一级分类"
                      style={{ width: '73%' }}
                    >
                      <Select.Option value={'热销备件'}>热销备件</Select.Option>
                      <Select.Option value={'最新备件'}>最新备件</Select.Option>
                      <Select.Option value={'二手备件'}>二手备件</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="二级分类">
                    <Select
                      // disabled
                      allowClear={true}
                      onSelect={(v: any) => {
                        this.setState({ twoLeave: v.target.value });
                      }}
                      placeholder="请选择备件类型"
                      style={{ width: '73%' }}
                    >
                      {forEach(this.state.TwoLevelAll, (element: any) => {
                        {
                          element;
                        }
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="商品名称">
                    <Input
                      style={{ width: '73%' }}
                      value={this.state.tradeName}
                      onChange={e => {
                        this.setState({ tradeName: e.target.value });
                      }}
                    ></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="商品品牌">
                    <Input
                      value={this.state.brand}
                      onChange={(e: any) => {
                        this.setState({ brand: e.target.value });
                      }}
                      style={{ width: '73%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {/* 商品轮播图 */}
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="商品轮播图">
                    <Input
                      style={{ width: '73%' }}
                      defaultValue={'请选择上传图片'}
                      disabled
                    ></Input>
                  </Form.Item>
                  <Upload
                    action={'/api/sys/file/upLoadFuJian/' + fileType.ship_spare}
                    listType="picture-card"
                    accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                    beforeUpload={HandleBeforeUpload.bind(this)}
                    headers={{ token: String(localStorage.getItem('token')) }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: false,
                      showRemoveIcon: true,
                    }}
                    // [{ thumbUrl: `http://58.33.34.10:10443/images/spart/${info.file.response.data.fileName}` }]
                    defaultFileList={[...this.state.picList] || []}
                    onRemove={this.onRemoveCheck}
                    onPreview={this.handlePreview}
                    onChange={this.handleChangeCheck}
                  >
                    {isNil(this.state) || isNil(this.state.picList) || this.state.picList.length < 5
                      ? uploadButton
                      : null}
                  </Upload>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={15}>
                  <Form.Item
                    style={{ textAlign: 'center' }}
                    required
                    {...formlayout}
                    label="商品型号/价格"
                  >
                    <Table
                      className="ShipSparePartsAddTable"
                      rowKey={(record: any) => record.index || ''}
                      // size=''
                      columns={this.state.storeColumns}
                      dataSource={this.state.storeData}
                      pagination={false}
                    />
                    <Button
                      icon="plus"
                      style={{
                        width: '40px',
                        backgroundColor: '#FFFFFF',
                        marginTop: '20px',
                        color: '#B3B3B3',
                        lineHeight: '20px',
                        fontSize: '20px',
                      }}
                      onClick={this.storeListAdd}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item {...formlayout} label="说明">
                    {forEach(this.state.partExplain, v => {
                      {
                        v;
                      }
                    })}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label="商品详情描述">
                    <div
                      data-testid="editor-container"
                      style={{ border: '1px solid #ccc', marginTop: '10px' }}
                    >
                      <Toolbar
                        editor={this.state.editor}
                        defaultConfig={toolbarConfig}
                        style={{ borderBottom: '1px solid #ccc' }}
                      />
                      <Editor
                        defaultConfig={editorConfig}
                        defaultContent={defaultContent}
                        // defaultHtml={defaultHtml}
                        mode="default"
                        style={{ height: '500px' }}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Card bordered={false}>
                <Row className={commonCss.rowTop}>
                  <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                    <ButtonOptionComponent
                      disabled={false}
                      type="Save"
                      text={'取消'}
                      event={() => {
                        this.props.history.push('/spartPart');
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <ButtonOptionComponent
                      disabled={false}
                      type="CloseButton"
                      text={'确认提交'}
                      event={this.getShipSparePartsEdit}
                    />
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}
const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(
  ShipSparePartsView,
);

export default MPCertificationList_Form;
