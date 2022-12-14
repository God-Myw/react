import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail } from '@/utils/utils';
import { AutoComplete, Button, Col, Divider, Form, Icon, Input, message, Modal, Row, Select, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { ColumnProps } from 'antd/lib/table';
import { RouteComponentProps } from 'dva/router';
import { forEach, isNil } from 'lodash';
import React from 'react';
import QueryButton from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { getLocale, formatMessage } from 'umi-plugin-react/locale';
const { confirm } = Modal;
const { Option } = Select;
const countryPorts: any[] = []//港口数据
const data_Source: any[] = []; //列表

class voyageLineList extends React.Component<RouteComponentProps & FormComponentProps> {
  constructor(props: RouteComponentProps & FormComponentProps) {
    super(props);
  }

  state = {
    status: -1,//初始化状态如果为0,代表没有任何航线,如果为1,代表有
    columns: [], //列数
    guid: -1, //id
    voyageLineList: [], //下拉航线列表
    voyageLineName: '', //当前航线名
    voyageLineNumber: '', //当前航线编号
    voyageLine: {}, //当前航线
    indexNumber: -1, //当前选择编辑的列表索引
    countryName: '', //当前选择编辑的国家名
    countryId: -1, //当前选择编辑的国家id
    portName: '', //当前选择编辑的港口名
    portId: -1, //当前选择编辑的港口id
    portTypeName: '', //当前选编辑的港口顺序
    buttonDisabled: true, //按钮是否可点击,在添加新数据时,使得按钮无法点击
    saveButton: true,
    editOrAdd: -1,//0为新增,1为编辑
    portList: [],//港口列表
    countryPorts: [],//港口数据
    voyageIntention: '',//航次意向
    currentPort: '',//船舶当前位置
    portIntention: '',//意向港口
    locationIntention: '',//意向区域
    selectDisabled: true// 初始化是下拉非活性
  };

  private columns: ColumnProps<any>[] = [
    {
      title: formatMessage({ id: 'Ship-VoyageLine.Country' }),
      width: '22%',
      dataIndex: 'countryName',
      align: 'center',
      render: (text: any, record: any) => {
        if (this.state.indexNumber == record.indexId) {
          return (
            <Select
              showSearch
              placeholder={formatMessage({ id: 'Ship-VoyageLine.Country' })}
              style={{ width: '80%' }}
              optionFilterProp="children"
              value={this.state.countryName != '' && !isNil(this.state.countryName) ? this.state.countryName : undefined}
              onSelect={this.selectCountry}
              filterOption={this.serachCountry}
            >
              {getDictDetail('country').map((item: any) => (
                <option value={item.code}>{item.textValue}</option>
              ))}
            </Select>
          );
        }
        return text;
      },
    },
    {
      title: formatMessage({ id: 'Ship-VoyageLine.Port' }),
      width: '22%',
      dataIndex: 'portName',
      align: 'center',
      render: (text: any, record: any) => {
        if (this.state.indexNumber == record.indexId) {
          return (
            <Select style={{ width: '80%' }} showSearch
              optionFilterProp="children"
              value={this.state.portName != '' && !isNil(this.state.portName) ? this.state.portName : undefined}
              onSelect={this.selectPort}
              placeholder={formatMessage({ id: 'Ship-VoyageLine.Port' })}
              filterOption={this.serachPort}
            >
              {this.state.portList.map((item: any) => (
                <option value={item.portCode}>{item.portName}</option>
              ))}
            </Select>
          );
        }
        return text;
      },
    },
    {
      title:  formatMessage({ id: 'Ship-VoyageLine.Port.Rotation' }),
      dataIndex: 'portTypeName',
      width: '40%',
      align: 'center',
      render: (text: any, record: any) => {
        if (this.state.indexNumber == record.indexId) {
          return (
            <Input
              maxLength={50}
              placeholder={formatMessage({ id: 'Ship-VoyageLine.Port.Rotation' })}
              value={this.state.portTypeName}
              style={{ width: '80%' }}
              onChange={e => this.setState({ portTypeName: e.target.value })}
            />
          );
        }
        return text;
      },
    },
    {
      title: formatMessage({ id: 'Ship-VoyageLine.operation' }),
      dataIndex: 'indexId',
      align: 'center',
      width: '16%',
      render: (indexId: any, record: any) => {
        if (this.state.indexNumber == record.indexId && this.state.editOrAdd == 0) {
          return (
            <span>
              <QueryButton
                disabled={false}
                text={formatMessage({ id: 'Ship-VoyageLine.Add.to' })}
                type="Edit"
                event={() => this.handleSave(indexId, record)}
              />
              &nbsp;
              <QueryButton
                disabled={false}
                text={formatMessage({ id: 'Ship-VoyageLine.delete' })}
                type="Delete"
                event={() => this.handleDelete(indexId, record)}
              />
            </span>
          );
        } else if (this.state.indexNumber == record.indexId && this.state.editOrAdd == 1) {
          return (
            <span>
              <QueryButton
                disabled={false}
                text={formatMessage({ id: 'Ship-VoyageLine.Save' })}
                type="Edit"
                event={() => this.handleSave(indexId, record)}
              />
              &nbsp;
              <QueryButton
                disabled={false}
                text={formatMessage({ id: 'Ship-VoyageLine.Cancel' })}
                type="Delete"
                event={() => this.handleOver(indexId)}
              />
            </span>
          );
        }
        return (
          <span>
            <QueryButton
              disabled={false}
              text={formatMessage({ id: 'Ship-VoyageLine.update' })}
              type="Edit"
              event={() => this.handleEdit(indexId, record)}
            />
            &nbsp;
            <QueryButton
              disabled={false}
              text={formatMessage({ id: 'Ship-VoyageLine.delete' })}
              type="Delete"
              event={() => this.handleDelete(indexId, record)}
            />
          </span>
        );
      },
    },
  ];

  //钩子函数
  componentDidMount() {
    this.getAllVoyageLine();
    this.getAllCountryPort();
  }

  //查找所有航线
  getAllVoyageLine() {
    data_Source.length = 0;
    this.setState({
      guid: -1,
      voyageLineList: [],
      voyageLineName: '',
      voyageLineNumber: '',
      voyageLine: {},
      indexNumber: -1,
      countryName: '',
      countryId: -1,
      portName: '',
      portId: -1,
      portTypeName: '',
      buttonDisabled: true,
      saveButton: true,
    });
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('pageSize', '-1');
    param.set('currentPage', '-1');
    getRequest('/business/voyageLine', param, (response: any) => {
      if (response.status == 200) {
        if (response.data.voyageLines.length == 0) {
          this.setState({
            status: 0,
            buttonDisabled: false,
            saveButton: false,
          })
        } else {
          this.setState({
            status: 1,
            voyageLineList: response.data.voyageLines,
            columns: this.columns,
          });
        }
      }
    });
  }

  getAllCountryPort() {
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    getRequest('/sys/port/all', param, (response: any) => {
      if (response.status == 200) {
        if(getLocale() === 'zh-CN'){
          response.data['zh'].forEach((ele: any) => {
            countryPorts.push(ele);
          })
        }else if(getLocale() === 'en-US'){
          response.data['en'].forEach((ele: any) => {
            countryPorts.push(ele);
          })
        }

      }
    });

  }

  //提交后刷新回本页
  getAllVoyageLineAfterSubmit = (voyageLineNumber: any) => {
    this.setState({
      guid: -1,
      voyageLineList: [],
      voyageLineName: '',
      voyageLineNumber: '',
      voyageLine: {},
      indexNumber: -1,
      countryName: '',
      countryId: -1,
      portName: '',
      portId: -1,
      portTypeName: '',
      buttonDisabled: true,
      saveButton: true,
    });
    let param: Map<string, any> = new Map();
    param.set('type', '1');
    param.set('pageSize', '-1');
    param.set('currentPage', '-1');
    getRequest('/business/voyageLine', param, (response: any) => {
      if (response.status == 200) {
        this.setState({
          status: 1,
          voyageLineList: response.data.voyageLines,
          columns: this.columns,
        },()=>{
          this.voyageLineNumberChoose(voyageLineNumber);
        });

      }
    });
  };

  //编辑按钮,点击编辑,将此行变为可编辑状态
  handleEdit = (indexId: any, record: any) => {
    if (this.state.indexNumber != indexId && this.state.indexNumber != -1) {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.current.line.operation' }));
      return;
    }
    let portList = this.getPortsByCountryId(data_Source[indexId].countryId);
    this.setState({
      indexNumber: indexId,
      countryName: record.countryName,
      portName: record.portName,
      portTypeName: record.portTypeName,
      countryId: data_Source[indexId].countryId,
      portId: data_Source[indexId].portId,
      editOrAdd: 1,
      portList: portList,
      buttonDisabled: true
    });
  };

  //航线下拉框
  handleSelect = (id: any) => {
    for (let voyageLine of this.state.voyageLineList) {
      //正在被选择的线路
      if (voyageLine['guid'] == id) {
        this.setState({
          voyageLineName: voyageLine['voyageLineName'],
          voyageLineNumber: voyageLine['voyageLineNumber'],
          indexNumber: -1,
          guid: id,
          buttonDisabled: false,
          saveButton: true,
          selectDisabled: false
        });
        this.props.form.setFieldsValue({
          voyageIntention: voyageLine['voyageIntention'],
          currentPort: voyageLine['currentPort'],
          portIntention: voyageLine['portIntention'],
          locationIntention: voyageLine['locationIntention']
        });
        let countryAndPortList = voyageLine['items'];
        //将数据插入下面的列表展示中
        if (countryAndPortList) {
          data_Source.length = 0;
          forEach(countryAndPortList, (countryAndPort: any, index) => {
            data_Source.push({
              voyageLineIndex: `${index + 1}`,
              countryName: countryAndPort.countryName,
              portName: countryAndPort.portName,
              portTypeName: countryAndPort.portTypeName,
              indexId: index,
              countryId: countryAndPort.countryId,
              portId: countryAndPort.portId,
            });
          });
        }
      } else {
        continue;
      }
    }
  };


  voyageLineNumberChoose = (voyageLineNumber: any) => {
    for (let voyageLine of this.state.voyageLineList) {
      //正在被选择的线路
      if (voyageLine['voyageLineNumber'] == voyageLineNumber) {
        this.setState({
          voyageLineName: voyageLine['voyageLineName'],
          voyageLineNumber: voyageLine['voyageLineNumber'],
          indexNumber: -1,
          guid: voyageLine['guid'],
          buttonDisabled: false,
          saveButton: true,
        });
        this.props.form.setFieldsValue({
          voyageIntention: voyageLine['voyageIntention'],
          currentPort: voyageLine['currentPort'],
          portIntention: voyageLine['portIntention'],
          locationIntention: voyageLine['locationIntention']
        });
        let countryAndPortList = voyageLine['items'];
        if (countryAndPortList) {
          data_Source.length = 0;
          forEach(countryAndPortList, (countryAndPort: any, index) => {
            data_Source.push({
              voyageLineIndex: `${index + 1}`,
              countryName: countryAndPort.countryName,
              portName: countryAndPort.portName,
              portTypeName: countryAndPort.portTypeName,
              indexId: index,
              countryId: countryAndPort.countryId,
              portId: countryAndPort.portId,
            });
          });
        }
      } else {
        continue;
      }
    }
  };
  //取消操作
  handleOver = (id: any) => {
    this.setState({
      indexNumber: -1,
      countryName: '',
      countryId: -1,
      portName: '',
      portId: -1,
      portTypeName: '',
    })
  };
  //国家选择框
  selectCountry = (id: any, option: any) => {
    this.setState({
      countryName: option.props.children,
      countryId: id,
      portName: '',
      portId: -1,
    });
    let portList = this.getPortsByCountryId(id);
    this.setState({
      portList: portList
    });
  };

  // 根据国家id获取下属所有港口
  getPortsByCountryId(id: number) {
    let portList: any = [];
    countryPorts.forEach((countryPort: any) => {
      if (countryPort['countryCode'] === id) {
        portList = countryPort['items'];
      }
    });
    return portList;
  }

  serachCountry = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //港口选择框
  selectPort = (id: any, option: any) => {
    this.setState({
      portName: option.props.children,
      portId: id,
      saveButton: false
    });
  };

  serachPort = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //保存此条index
  handleSave = (indexId: any, record: any) => {
    if (isNil(this.state.countryName) || this.state.countryName == '') {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.Country.unselected' }));
      return;
    }
    if (isNil(this.state.portName) || this.state.portName == '') {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.port.unselected' }));
      return;
    }
    if (isNil(this.state.portTypeName) || this.state.portTypeName == '') {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.Port.Rotation.unselected' }));
      return;
    }
    data_Source[indexId].countryId = this.state.countryId;
    data_Source[indexId].portId = this.state.portId;
    data_Source[indexId].countryName = this.state.countryName;
    data_Source[indexId].portName = this.state.portName;
    data_Source[indexId].portTypeName = this.state.portTypeName;

    this.setState({
      buttonDisabled: false,
      countryName: '',
      countryId: -1,
      portName: '',
      portId: -1,
      portTypeName: '',
      indexNumber: -1,
      saveButton: false,
    });
  };

  //从一条记录中获取uid
  getIndexId = (record: any) => {
    return !isNil(record.indexId) ? record.indexId : '';
  };

  //最下面的保存按钮
  submit = () => {
    if(data_Source.length < 2)
    {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.new.check.two' }));
      return;
    }
    let voNum = this.state.voyageLineNumber;//航线id,用于刷新数据回显
    let requestParam: { countryId: any; portId: any; portTypeName: any; }[] = [];
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        if (isNil(this.state.voyageLineNumber) || this.state.voyageLineNumber == '') {
          message.warning(formatMessage({ id: 'Ship-VoyageLine.new.modified' }));
          return;
        }
        if (this.state.buttonDisabled) {
          message.warning(formatMessage({ id: 'Ship-VoyageLine.setport.unsaved' }));
          return;
        }
        data_Source.forEach(function (item) {
          requestParam.push({
            countryId: item.countryId,
            portId: item.portId,
            portTypeName: item.portTypeName
          })
        });
        if (this.state.guid != -1) {
          let putRequestParam: any = {
            type: '1',
            guid: this.state.guid,
            voyageLineName: this.state.voyageLineName,
            voyageLineNumber: this.state.voyageLineNumber,
            voyageIntention: (values.voyageIntention=== undefined || isNil(values.voyageIntention)) ? "":values.voyageIntention,
            currentPort: (values.currentPort === undefined|| isNil(values.currentPort)) ? "":values.currentPort,
            portIntention: (values.portIntention=== undefined || isNil(values.portIntention))? "":values.portIntention,
            locationIntention: (values.locationIntention=== undefined || isNil(values.locationIntention))? "":values.locationIntention,
            countryAndPortList: requestParam,
          };
          console.log(putRequestParam)
          // putRequest('/business/voyageLine', JSON.stringify(putRequestParam), (response: any) => {
          //   if (response.status == 200) {
          //     message.success(formatMessage({ id: 'Ship-VoyageLine.Save.success' }));
          //     this.getAllVoyageLineAfterSubmit(voNum);
          //   } else if(response.status === 500){
          //     message.error(response.message,2);
          //     return;
          //   }
          // });
        } else {
          let postrequestParam: any = {
            type: '1',
            voyageLineName: this.state.voyageLineName,
            voyageLineNumber: this.state.voyageLineNumber,
            voyageIntention: values.voyageIntention=== undefined ? "":values.voyageIntention,
            currentPort: values.currentPort === undefined ? "":values.currentPort,
            portIntention: values.portIntention=== undefined ? "":values.portIntention,
            locationIntention: values.locationIntention=== undefined ? "":values.locationIntention,
            countryAndPortList: requestParam,
          };
          console.log(postrequestParam)
          // postRequest('/business/voyageLine', JSON.stringify(postrequestParam), (response: any) => {
          //   if (response.status == 200) {
          //     message.success(formatMessage({ id: 'Ship-VoyageLine.Save.success' }));
          //     this.getAllVoyageLineAfterSubmit(voNum);
          //   } else  if(response.status === 500){
          //     message.error(response.message,2);
          //     return;
          //   }
          // });
        }
      }
    });
  };

  //点击新增按钮
  clickAddButton = () => {
    let length = data_Source.length;
    this.setState({
      countryName: '',
      countryId: -1,
      portName: '',
      portId: -1,
      portTypeName: '',
      indexNumber: length,
      buttonDisabled: true,
      saveButton: true,
      editOrAdd: 0,
      portList: []
    });
    data_Source.push({
      voyageLineIndex: length + 1,
      countryName: '',
      portName: '',
      portTypeName: '',
      indexId: length,
    });
  };

  //点击新增路线按钮
  clickAddRouteButton = () => {
    data_Source.length = 0;
    this.setState({
      guid: -1,
      status: 0,
      voyageLineName: '',
      voyageLineNumber: '',
      buttonDisabled: false,
      saveButton: false,
      selectDisabled: false
    });
    this.props.form.setFieldsValue({
      voyageIntention: '',//航次意向
      currentPort: '',//船舶当前位置
      portIntention: '',//意向港口
      locationIntention: ''//意向区域
    })
  };

  //组件确定按钮
  modalOk = () => {
    if (isNil(this.state.voyageLineName) || this.state.voyageLine == '') {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.Name.null' }));
    }
    if (isNil(this.state.voyageLineNumber) || this.state.voyageLineNumber == '') {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.No.null' }));
    }
    this.setState({
      buttonDisabled: true,
      indexNumber: 0,
      modalVisible: false,
      saveButton: true
    });
    data_Source.push({
      voyageLineIndex: 1,
      countryName: '',
      portName: '',
      portTypeName: '',
      indexId: 0,
    });
  };

  //组件取消按钮
  modalCancel = () => {
    this.setState({
      saveButton: false,
      modalVisible: false,
      voyageLineName: '',
      voyageLineNumber: '',
      guid: -1,
    });
  };

  //删除单个港口
  handleDelete = (indexId: any, record: any) => {
    if (this.state.indexNumber != indexId && this.state.indexNumber != -1) {
      message.warning(formatMessage({ id: 'Ship-VoyageLine.Now.operation' }));
      return;
    }
    const get = this;
    const deleteMessage = formatMessage({ id: 'Ship-VoyageLine.Del.type' })+` ${record.portTypeName}`;
    confirm({
      title: deleteMessage,
      okText: formatMessage({ id: 'Ship-VoyageLine.Confirm' }),
      cancelText: formatMessage({ id: 'Ship-VoyageLine.Cancel' }),
      onOk() {
        get.delOk(indexId);
      },
      onCancel() {
        get.delCancel();
      }
    });
  };

  //删除单个港口确定
  delOk = (indexId: any) => {
    data_Source.splice(indexId, 1);
    forEach(data_Source, (model, index) => {
      model['indexId'] = index;
      model['voyageLineIndex'] = index + 1;
    });
    this.setState({
      buttonDisabled: false,
      saveButton: false,
      portTypeName: '',
      indexNumber: -1
    });
    message.success(formatMessage({ id: 'Ship-VoyageLine.Del.success' }));
  };

  //删除单个港口取消
  delCancel = () => {
    this.setState({
      portTypeName: '',
    });
  };

  autoComplete = (value: any) => {
    this.setState({
      voyageLineName: value,
      saveButton: false
    })
  };

  changesaveButton = () => {
    this.setState({
      saveButton: false
    })
  }

  checkPort = (checkValue: string, rule: any, val: any, callback: any) => {
    if (checkValue !== '') {
      if (val === checkValue) {
        callback(formatMessage({ id: 'Ship-VoyageLine.Local.inconsistent.Port' }));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  changePortIntention = (value: any) => {
    this.changesaveButton();
    this.setState({
      portIntention: value
    }, () => {
      if (!isNil(this.state.currentPort) && this.state.currentPort !== '') {
        this.props.form.validateFields(['portIntention', 'currentPort']);
      }
    })
  };

  changeCurrentPort = (value: any) => {
    this.changesaveButton();
    this.setState({
      currentPort: value
    }, () => {
      if (!isNil(this.state.portIntention) && this.state.portIntention !== '') {
        this.props.form.validateFields(['portIntention', 'currentPort']);
      }
    })
  };

  //渲染页面组件
  render() {
    const { getFieldDecorator } = this.props.form;
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={commonCss.container}>
        <LabelTitleComponent text={formatMessage({ id: 'Ship-VoyageLine.Set' })} event={() => { this.props.history.push('/index_menu/'); }} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                {/* 下拉栏 */}
                <Form.Item {...formlayout} label={formatMessage({ id: 'Ship-VoyageLine.Name' })} required>
                  {this.state.status == 0 && getFieldDecorator('voyageLineName', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Ship-VoyageLine.Name.null' }),
                      }
                    ],
                  })(
                    <Input
                      maxLength={20}
                      onChange={e => this.setState({ voyageLineName: e.target.value })}
                      value={this.state.voyageLineName}
                    />
                  )}

                  {this.state.status == 1 && <div
                    onMouseDown={e => {
                      e.preventDefault();
                      return false;
                    }}
                  >
                    <AutoComplete
                      className="certain-category-search"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownMatchSelectWidth={false}
                      size="default"
                      dataSource={this.state.voyageLineList.map((voyageLine: any) => (
                        <Option key={voyageLine.guid}>{voyageLine.voyageLineName}</Option>
                      ))}
                      value={this.state.voyageLineName}
                      onChange={this.autoComplete}
                      onSelect={this.handleSelect}
                      placeholder={formatMessage({ id: 'Ship-VoyageLine.Name' })}
                      optionLabelProp="value"
                      dropdownRender={(ReactNode) => (
                        <div>
                          <Button
                            type="dashed"
                            style={{ width: '100%', height: '40px' }}
                            onClick={this.clickAddRouteButton}
                          >
                            + {formatMessage({ id: 'Ship-VoyageLine.Add' })}
                            </Button>
                          {ReactNode}
                        </div>
                      )}
                    >
                    </AutoComplete>
                  </div>}

                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Ship-VoyageLine.No' })} required>
                  {this.state.status == 0 && getFieldDecorator('voyageLineNumber', {
                    initialValue:
                      this.state == null || this.state.voyageLineNumber == null ? '' : this.state.voyageLineNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Ship-VoyageLine.No.null' }),
                      }
                    ],
                  })(
                    <Input
                      maxLength={20}
                      onChange={e => this.setState({ voyageLineNumber: e.target.value })}
                    />
                  )}

                  {this.state.status == 1 && <Input
                    maxLength={20}
                    disabled={true}
                    onChange={e => this.setState({ voyageLineNumber: e.target.value })}
                    value={this.state.voyageLineNumber}
                  />}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider dashed />
        {/* 配置港口 */}
        <LabelTitleComponent text={formatMessage({ id: 'Ship-VoyageLine.Set.Port' })} event={() => {
        }} displayNone={true} />

        <div className={commonCss.table}>
          <Table
            rowKey={record => this.getIndexId(record)}
            bordered
            columns={this.columns}
            dataSource={data_Source}
            size="small"
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 == 0 ? commonCss.dataRowOdd : commonCss.dataRowEven
            }
          />
          <Button
            type="dashed"
            style={{ width: '100%', height: '60px' }}
            onClick={this.clickAddButton}
            disabled={this.state.buttonDisabled}
          >
            <Icon type="border-inner" />
            {formatMessage({ id: 'Ship-VoyageLine.Add.Port' })}
            {/* 新增港口 */}
          </Button>
        </div>

        <div style={{ height: '60px' }} />
        <LabelTitleComponent text={formatMessage({ id: 'Ship-VoyageLine.remark' })} event={() => { }} displayNone={true} />
        <div className={commonCss.AddForm}>
          <Form labelAlign="left">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Ship-VoyageLine.Voyage.intent' })}>
                  {getFieldDecorator(`voyageIntention`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.voyageIntention) || this.state.voyageIntention === ''
                        ? undefined
                        : this.state.voyageIntention,
                  })(
                    <Select
                      allowClear={true}
                      style={{ width: '80%' }}
                      placeholder={formatMessage({ id: 'Ship-VoyageLine.Voyage.intent' })}
                      onChange={this.changesaveButton}
                      disabled={this.state.status !== 0 && this.state.selectDisabled}
                    >
                      {getDictDetail('voyage_intention').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Ship-VoyageLine.Local.position' })}>
                  {getFieldDecorator(`currentPort`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.currentPort) || this.state.currentPort === ''
                        ? undefined
                        : this.state.currentPort,
                    rules: [
                      {
                        validator: this.checkPort.bind(
                          this,
                          isNil(this.state) || isNil(this.state.portIntention)
                            ? ''
                            : this.state.portIntention,
                        ),
                      },
                    ],
                  })(
                    <Select style={{ width: '80%' }} showSearch allowClear={true}
                      optionFilterProp="children"
                      placeholder={formatMessage({ id: 'Ship-VoyageLine.Local.position' })}
                      filterOption={this.serachPort}
                      onChange={this.changeCurrentPort}
                      disabled={this.state.status !== 0 && this.state.selectDisabled}
                    >
                      {getDictDetail('port').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Ship-VoyageLine.Port.intent' })}>
                  {getFieldDecorator(`portIntention`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.portIntention) || this.state.portIntention === ''
                        ? undefined
                        : this.state.portIntention,
                    rules: [
                      {
                        validator: this.checkPort.bind(
                          this,
                          isNil(this.state) || isNil(this.state.currentPort)
                            ? ''
                            : this.state.currentPort,
                        ),
                      },
                    ],
                  })(
                    <Select style={{ width: '80%' }} showSearch allowClear={true}
                      optionFilterProp="children"
                      placeholder={formatMessage({ id: 'Ship-VoyageLine.Port.intent' })}
                      filterOption={this.serachPort}
                      onChange={this.changePortIntention}
                      disabled={this.state.status !== 0 && this.state.selectDisabled}
                    >
                      {getDictDetail('port').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Ship-VoyageLine.Area.intent' })}>
                  {getFieldDecorator(`locationIntention`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.locationIntention) || this.state.locationIntention === ''
                        ? undefined
                        : this.state.locationIntention,
                  })(
                    <Select style={{ width: '80%' }} showSearch allowClear={true}
                      optionFilterProp="children"
                      placeholder={formatMessage({ id: 'Ship-VoyageLine.Area.intent' })}
                      onChange={this.changesaveButton}
                      disabled={this.state.status !== 0 && this.state.selectDisabled}
                    >
                      {getDictDetail('voyage_area').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div style={{ height: '60px' }}>
              <Row type="flex" justify="center">
                <Button type="primary" onClick={this.submit} disabled={this.state.saveButton}>
                {formatMessage({ id: 'Ship-VoyageLine.Save' })}
            </Button>
              </Row>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create<RouteComponentProps & FormComponentProps>()(voyageLineList);
