import React from 'react';
import { RouteComponentProps } from 'dva/router';
import { Col, Form, Input, Icon, Row, Button, Card, Table, Select, Upload, Modal } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import commonCss from '../../Common/css/CommonCss.less';
import '@wangeditor/editor/dist/css/style.css';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '../../../components/WangEditor';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import { postRequest, getRequest } from '@/utils/request';
import { isNil, forEach } from 'lodash';
import { PicList, StoreList } from './ShipSparePartsForminterface';
import { FormattedMessage } from 'umi-plugin-locale';
import { HandleBeforeUpload } from '@/utils/validator';
import 'cropperjs/dist/cropper.css';
// import Cropper from './Cropper'
import Cropper from 'cropperjs';
import { response } from 'express';
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">
      <FormattedMessage id="ShipownerShipTrade-ShipownerShipTradeAddForSale.upload" />
    </div>
  </div>
);
const image = new Image();

image.src = 'https://fengyuanchen.github.io/cropperjs/v2/picture.jpg';
image.alt = 'Picture';
class ShipSparePartsAdd extends React.Component<RouteComponentProps> {
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
    addName: '新增商品',
    storeCount: 0,
    image: '',
    cropData: '#',
    cropper: '',
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
    cropperVisible: false,
    partExplain: '',
    picList: [],
    storePicList: [],
    TwoLevelAll: [],
    oneLeave: '',
    twoLeave: '',
    placeOf: '',
    partExplainIndex: 0,
    ellist: [
      <Input
        key={0}
        onBlur={e => {
          let partExplain = this.state.partExplain + e.target.value + '/';
          this.setState({
            partExplain: partExplain,
          });
        }}
        style={{ width: '50%' }}
      ></Input>,
    ],
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
      storeData: [
        {
          index: 0,
          imgUrl: (
            <Upload
              action={'/api/sys/file/upLoadFuJian/' + fileType.ship_spare}
              listType="picture-card"
              accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
              beforeUpload={HandleBeforeUpload.bind(this)}
              headers={{ token: String(localStorage.getItem('token')) }}
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
                const spartParts: any[] = this.state.spartParts.filter(
                  (item: any) => item.index !== 0,
                );
                const spartParts2: any[] = this.state.spartParts.filter(
                  (item: any) => item.index == 0,
                );
                const spartPartsInit: {
                  index?: any;
                  partPicList?: any;
                  model: any;
                  spartMoney: any;
                  quantity: any;
                } = {
                  index: 0,
                  partPicList: dataSource,
                  model: spartParts2[0].model,
                  spartMoney: spartParts2[0].spartMoney,
                  quantity: spartParts2[0].quantity,
                };
                spartParts.push(spartPartsInit);
                this.setState({
                  spartParts: spartParts,
                });
              }}
            >
              {isNil(this.state) ||
              isNil(this.state.spartParts) ||
              this.state.spartParts[0]['partPicList']['length'] < 1
                ? uploadButton
                : null}
            </Upload>
          ),
          type: (
            <Form.Item required>
              <Input
                onChange={e => {
                  this.storeListChange(0, 'model', e.target.value);
                }}
              />
            </Form.Item>
          ),
          price: (
            <Form.Item required>
              <Input
                onChange={e => {
                  this.storeListChange(0, 'spartMoney', e.target.value);
                }}
              />
            </Form.Item>
          ),
          count: (
            <Form.Item required>
              <Input
                onChange={e => {
                  this.storeListChange(0, 'quantity', e.target.value);
                }}
              />
            </Form.Item>
          ),
        },
      ],
    });
    this.initData();
  }

  //模拟数据
  initData() {
    // 所有二级分类
    let params: Map<string, any> = new Map();
    getRequest('/business/spartLevel/getSpartTwoLevelAll', params, (response: any) => {
      let TwoLevelAll = response.data.map((item: any) => {
        return <Select.Option value={item.twoLevelName}>{item.twoLevelName}</Select.Option>;
      });
      this.setState({ TwoLevelAll: TwoLevelAll });
    });
  }
  onRemoveCheck = () => {};
  handlePreview = () => {};
  //图片上传
  handleChangeCheck = (info: any) => {
    // let p = new Cropper(image, {
    //   aspectRatio: 16 / 16,
    //   viewMode: 0,
    //   minContainerWidth: 500,
    //   minContainerHeight: 500,
    //   dragMode: 'move',
    // preview: [document.querySelector('.previewBox'),
    // document.querySelector('.previewBoxRound')]
    // })
    // console.log(new FileReader().readAsDataURL(info.files))
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
  // 商品型号/价格
  storeListChange = (index: any, type: string, value: any) => {
    const spartParts = [...this.state.spartParts];
    spartParts[index][type] = value;
    this.setState({ spartParts: spartParts });
  };
  storeListSub = (index: number) => {
    let storeList = [...this.state.storeData];
    let spartPartsList = [...this.state.spartParts];
    storeList = storeList.filter((item: any) => item.index !== index);
    spartPartsList = spartPartsList.filter((item: any, i: any) => i !== index);
    this.setState({
      addName: '新增商品',
      editor: null,
      storeData: storeList,
      spartParts: spartPartsList,
      storeCount: this.state.storeCount - 1,
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
            const spartParts: any[] = this.state.spartParts.filter(
              (item: any) => item.index !== index,
            );
            const spartParts2: any[] = this.state.spartParts.filter(
              (item: any) => item.index == index,
            );
            const spartPartsInit: {
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
            spartParts.push(spartPartsInit);
            this.setState({
              spartParts: spartParts,
            });
          }}
        >
          {isNil(this.state) ||
          isNil(this.state.spartParts[index]) ||
          this.state.spartParts[index]['partPicList']['length'] < 1
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
    this.setState({ storeData: storeList, storeCount: index, spartParts: spartPartsList });
  };
  handleCropper = (e: any) => {
    this.setState({ cropperVisible: false });
  };
  // 提交表单
  getShipSparePartsAdd = () => {
    let partExplain = [...new Set(this.state.partExplain)];
    let requestData = {
      tradeName: this.state.tradeName || '',
      brand: this.state.brand || '',
      placeOf: this.state.placeOf || '',
      picList: this.state.picList || '',
      spartParts: this.state.spartParts || '',
      partExplain: partExplain || '',
      details: this.state.details || '',
    };
    postRequest('/business/spart/saveSpart', JSON.stringify(requestData), response => {
      if (!isNil(response) && response.code === '0000' && response.status === 200) {
        this.props.history.push('/spartPart');
      }
    });
  };
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
        this.setState({ curContent: editor.children, details: editor.getHtml() });
      },
      MENU_CONF: {
        uploadImage: {
          server: '/api/sys/file/upLoadFuJian/' + fileType.ship_spare,
          // timeout: 5 * 1000, // 5s
          fieldName: 'file',
          // meta: { token: String(localStorage.getItem('token')) },
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
            // HandleBeforeUpload.bind(this)
            return file;
          },
          onProgress(progress: any) {},
          onSuccess(file: any, res: any) {},
        },
      },
    };
    // 继续补充其他配置~
    const defaultContent = [{ type: 'paragraph', children: [{ text: '' }] }];
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
                        // this.setState({ cropperVisible: true });
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
                      style={{ width: '73%' }}
                      onChange={e => {
                        this.setState({ brand: e.target.value });
                      }}
                    ></Input>
                  </Form.Item>
                </Col>
              </Row>
              {/* 商品轮播图 */}
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item required {...formlayout} label="商品轮播图">
                    <Input style={{ width: '73%' }} value={'请选择上传图片'} disabled></Input>
                  </Form.Item>
                  <Upload
                    action={'/api/sys/file/upLoadFuJian/' + fileType.ship_spare}
                    listType="picture-card"
                    accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                    beforeUpload={HandleBeforeUpload.bind(this)}
                    headers={{ token: String(localStorage.getItem('token')) }}
                    defaultFileList={[...this.state.picList] || []}
                    // onRemove={this.onRemoveCheck}
                    // onPreview={this.handlePreview}
                    onChange={this.handleChangeCheck}
                  >
                    {isNil(this.state) || isNil(this.state.picList) || this.state.picList.length < 10
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
                    ></Table>
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
                    {forEach(this.state.ellist, (v, index) => {
                      {
                        v;
                      }
                    })}
                    <Button
                      icon="plus"
                      style={{
                        width: '7%',
                        backgroundColor: '#FFFFFF',
                        color: '#B3B3B3',
                        lineHeight: '20px',
                        fontSize: '20px',
                      }}
                      onClick={() => {
                        let index = this.state.partExplainIndex + 1;
                        let arr = [...this.state.ellist];
                        arr.push(
                          <Input
                            key={index}
                            onBlur={e => {
                              let partExplain = this.state.partExplain + e.target.value + '/';
                              this.setState({
                                partExplain: partExplain,
                              });
                            }}
                            style={{ width: '50%' }}
                          />,
                        );
                        this.setState({ ellist: arr, partExplainIndex: index });
                      }}
                    ></Button>
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
                      event={this.getShipSparePartsAdd}
                    />
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>
          <Modal
            title="请裁剪图片"
            visible={this.state.cropperVisible}
            onOk={this.handleCropper}
            onCancel={() => {
              this.setState({ cropperVisible: false });
            }}
          >
            {/* <Cropper /> */}
          </Modal>
        </div>
      </div>
    );
  }
}
const MPCertificationList_Form = Form.create({ name: 'MPCertificationList_Form' })(
  ShipSparePartsAdd,
);

export default MPCertificationList_Form;
