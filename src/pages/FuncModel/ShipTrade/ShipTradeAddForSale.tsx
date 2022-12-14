import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { checkEmail, checkPhone, checkNumber, HandleBeforeUpload } from '@/utils/validator';
import { Col, Form, Input, message, Modal, Row, Select, Divider, Upload, Icon } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { isNil, forEach } from 'lodash';
import React from 'react';
import { formatMessage } from 'umi-plugin-locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { fileType } from '@/pages/Common/Components/FileTypeCons';
import { ShipTradeFormProps, FileMsg, PicList } from './ShipTradeFormInterface';

const { confirm } = Modal;
class ShipownerShipTradeAddForSale extends React.Component<
  ShipTradeFormProps, ShipTradeFormProps> {
  constructor(props: ShipTradeFormProps) {
    super(props);
  }

  //初始化事件
  componentDidMount() {
    this.setState({
      phoneCode: '+86',
      history: this.props.history,
      flag: '1',
      title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.add' }),
      tradeType: 1,
      checkflag: false,
      ownershipflag: false,
      loadLineflag: false,
      specificationflag: false,
      airworthinessflag: false,
      shipflag: false,
    });
    let guid = this.props.match.params['guid'];
    if (!isNil(guid)) {
      this.setState({
        guid: guid,
        title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.update' }),
      });
      let param: Map<string, string> = new Map();
      param.set('type', '1');
      getRequest('/business/shipTrade/' + guid, param, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              tradeType: response.data.shipTrade.tradeType,
              shipType: response.data.shipTrade.shipType,
              tonNumber: response.data.shipTrade.tonNumber,
              shipAge: response.data.shipTrade.shipAge,
              classificationSociety: response.data.shipTrade.classificationSociety,
              voyageArea: response.data.shipTrade.voyageArea,
              contacter: response.data.shipTrade.contacter,
              phoneCode: response.data.shipTrade.phoneCode,
              phoneNumber: response.data.shipTrade.phoneNumber,
              remark: response.data.shipTrade.remark,
              email: response.data.shipTrade.email,
              flag: '2',

              imo: response.data.shipTrade.imo,   //IMO号
              shipName: response.data.shipTrade.shipName,   //船名
              buildAddress: response.data.shipTrade.buildAddress, //建造地点
              buildParticularYear: response.data.shipTrade.buildParticularYear,//建造年份
              draft: response.data.shipTrade.draft,//吃水
              netWeight: response.data.shipTrade.netWeight,//净重
              hatchesNumber: response.data.shipTrade.hatchesNumber,//舱口数量
              checkFileList: response.data.checkFileList,
              ownershipFileList: response.data.ownershipFileList,
              loadLineFileList: response.data.loadLineFileList,
              specificationFileList: response.data.specificationFileList,
              airworthinessFileList: response.data.airworthinessFileList,
              shipFileList: response.data.shipFileList,
            });
            //船舶检验证书
            if (!isNil(response.data.checkFileList)) {
              let checkFileList: FileMsg[] = [];
              forEach(response.data.checkFileList, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response1: any) => {
                  if (response1.status === 200) {
                    // if (pic.fileLog === 17) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response1.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response1.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.type;
                    checkFileList.push(fileList);
                    if (checkFileList.length === response.data.checkFileList.length) {
                      this.setState({
                        checkFile: checkFileList,
                        picNum: checkFileList.length,
                      });
                    }
                    // }
                  }
                },
                );
              });
            }
            //船舶所有权证书
            if (!isNil(response.data.ownershipFileList)) {
              let ownershipFileList: FileMsg[] = [];
              forEach(response.data.ownershipFileList, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response2: any) => {
                  if (response2.status === 200) {
                    // if (pic.fileLog === 18) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response2.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response2.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.type;
                    ownershipFileList.push(fileList);
                    if (ownershipFileList.length === response.data.ownershipFileList.length) {
                      this.setState({
                        ownershipFile: ownershipFileList,
                        picNum: ownershipFileList.length,
                      });
                    }
                    // }
                  }
                },
                );
              });
            }
            //船舶载重线证书
            if (!isNil(response.data.loadLineFileList)) {
              let loadLineFileList: FileMsg[] = [];
              forEach(response.data.loadLineFileList, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response3: any) => {
                  if (response3.status === 200) {
                    // if (pic.fileLog === 8) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response3.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response3.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.type;
                    loadLineFileList.push(fileList);
                    if (loadLineFileList.length === response.data.loadLineFileList.length) {
                      this.setState({
                        loadLineFile: loadLineFileList,
                        picNum: loadLineFileList.length,
                      });
                    }
                    // }
                  }
                },
                );
              });
            }
            //船舶规范
            if (!isNil(response.data.specificationFileList)) {
              let specificationFileList: FileMsg[] = [];
              forEach(response.data.specificationFileList, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response4: any) => {
                  if (response4.status === 200) {
                    // if (pic.fileLog === 19) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response4.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response4.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.type;
                    specificationFileList.push(fileList);
                    if (specificationFileList.length === response.data.specificationFileList.length) {
                      this.setState({
                        specificationFile: specificationFileList,
                        picNum: specificationFileList.length,
                      });
                    }
                    // }
                  }
                },
                );
              });
            }
            //船舶适航证书
            if (!isNil(response.data.airworthinessFileList)) {
              let airworthinessFileList: FileMsg[] = [];
              forEach(response.data.airworthinessFileList, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response5: any) => {
                  if (response5.status === 200) {
                    // if (pic.fileLog === 20) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response5.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response5.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.type;
                    airworthinessFileList.push(fileList);
                    if (airworthinessFileList.length === response.data.airworthinessFileList.length) {
                      this.setState({
                        airworthinessFile: airworthinessFileList,
                        picNum: airworthinessFileList.length,
                      });
                    }
                    // }
                  }
                },
                );
              });
            }
            //船舶照片
            if (!isNil(response.data.shipFileList)) {
              let shipFileList: FileMsg[] = [];
              forEach(response.data.shipFileList, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest('/sys/file/getThumbImageBase64/' + pic.type, picParams, (response6: any) => {
                  if (response6.status === 200) {
                    // if (pic.fileLog === 13) {
                    let fileList: FileMsg = {};
                    fileList.uid = index;
                    fileList.name = response6.data[0].fileName;
                    fileList.status = 'done';
                    fileList.thumbUrl = response6.data[0].base64;
                    fileList.fileName = pic.fileName;
                    fileList.type = pic.type;
                    shipFileList.push(fileList);
                    if (shipFileList.length === response.data.shipFileList.length) {
                      this.setState({
                        shipFile: shipFileList,
                        picNum: shipFileList.length,
                      });
                    }
                    // }
                  }
                },
                );
              });
            }
          }
        }
      });
    }
  }

  onBack = () => {
    this.props.history.push('/shipTrade');
  };

  handleCancel = () => this.setState({ previewVisible: false });

  // 提交
  handleSubmit(state: number, guid: number) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let type;
        if (state === 0) {
          type = 1;
        } else {
          type = 2;
        }

        let param = {};
        if (!isNil(guid)) {
          param = {
            guid: guid,
            tradeType: this.state.tradeType,
            shipType: this.state.shipType,
            tonNumber: this.state.tonNumber,
            shipAge: this.state.shipAge,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            contacter: this.state.contacter,
            phoneCode: values.phoneCode,
            phoneNumber: this.state.phoneNumber,
            remark: this.state.remark,
            email: values.email,
            type: type,
            state: state,
            imo: this.state.imo,   //IMO号
            shipName: this.state.shipName,   //船名
            buildAddress: this.state.buildAddress, //建造地点
            buildParticularYear: this.state.buildParticularYear,//建造年份
            draft: this.state.draft,//吃水
            netWeight: this.state.netWeight,//净重
            hatchesNumber: this.state.hatchesNumber,//舱口数量
            checkFileList: isNil(this.state.checkFileList) ? [] : this.state.checkFileList,
            ownershipFileList: isNil(this.state.ownershipFileList) ? [] : this.state.ownershipFileList,
            loadLineFileList: isNil(this.state.loadLineFileList) ? [] : this.state.loadLineFileList,
            specificationFileList: isNil(this.state.specificationFileList) ? [] : this.state.specificationFileList,
            airworthinessFileList: isNil(this.state.airworthinessFileList) ? [] : this.state.airworthinessFileList,
            shipFileList: isNil(this.state.shipFileList) ? [] : this.state.shipFileList,
          };
          //修改船舶交易
          putRequest('/business/shipTrade/seller', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.successfulUpdate' }),
                2,
              );
              this.props.history.push('/shipTrade');
            } else {
              message.error(
                response.message,
                2,
              );
            }
          });
        } else {
          param = {
            tradeType: this.state.tradeType,
            shipType: this.state.shipType,
            tonNumber: this.state.tonNumber,
            shipAge: this.state.shipAge,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            contacter: this.state.contacter,
            phoneCode: values.phoneCode,
            phoneNumber: this.state.phoneNumber,
            remark: this.state.remark,
            email: values.email,
            type: type,
            state: state,
            imo: this.state.imo,   //IMO号
            shipName: this.state.shipName,   //船名
            buildAddress: this.state.buildAddress, //建造地点
            buildParticularYear: this.state.buildParticularYear,//建造年份
            draft: this.state.draft,//吃水
            netWeight: this.state.netWeight,//净重
            hatchesNumber: this.state.hatchesNumber,//舱口数量
            checkFileList: isNil(this.state.checkFileList) ? [] : this.state.checkFileList,
            ownershipFileList: isNil(this.state.ownershipFileList) ? [] : this.state.ownershipFileList,
            loadLineFileList: isNil(this.state.loadLineFileList) ? [] : this.state.loadLineFileList,
            specificationFileList: isNil(this.state.specificationFileList) ? [] : this.state.specificationFileList,
            airworthinessFileList: isNil(this.state.airworthinessFileList) ? [] : this.state.airworthinessFileList,
            shipFileList: isNil(this.state.shipFileList) ? [] : this.state.shipFileList,
          };
          //新增船舶交易
          postRequest('/business/shipTrade/seller', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(
                formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.successfulAdd' }),
                2,
              );
              this.props.history.push('/shipTrade');
            } else {
              message.error(
                response.message,
                2,
              );
            }
          });
        }
      }
    });
  }

  handleTradeTypeSelect = (value: any) => {
    confirm({
      title: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.tradeTypeChange' }),
      okText: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.yes' }),
      cancelText: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.no' }),
      onCancel: () => {
        this.setState({
          tradeType: 1,
        });
        this.props.form.resetFields();
      },
      onOk: () => {
        this.setState({
          tradeType: value,
        });
        this.props.history.push('/shipTrade/add/');
      },
    });
  };

  handleShipTypeSelect = (value: any) => {
    this.setState({
      shipType: value,
    });
  };
  handleShipAgeSelect = (value: any) => {
    this.setState({
      shipAge: value,
    });
  };
  handleClassificationSocietySelect = (value: any) => {
    this.setState({
      classificationSociety: value,
    });
  };
  handleVoyageAreaSelect = (value: any) => {
    this.setState({
      voyageArea: value,
    });
  };

  handlePreview = async (file: any) => {
    if (file.response) {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.response.data.fileName);
      getRequest('/sys/file/getImageBase64/' + file.response.data.type, params, (response: any) => {
        if (response.status === 200) {
          this.setState({
            previewImage: response.data.file.base64,
            previewVisible: true,
          });
        }
      });
    } else {
      let params: Map<string, string> = new Map();
      params.set('fileName', file.fileName);
      getRequest('/sys/file/getImageBase64/' + file.type, params, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              previewImage: response.data.file.base64,
              previewVisible: true,
            });
          }
        }
      });
    }
  };

  onRemoveCheck = (file: any) => {
    const oldFileList = this.state.checkFile;
    const checkFileList = this.state.checkFileList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(checkFileList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      checkFile: newFileList,
      checkFileList: types,
    }));
  };

  onRemoveOwnership = (file: any) => {
    const oldFileList = this.state.ownershipFile;
    const ownershipFileList = this.state.ownershipFileList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(ownershipFileList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      ownershipFile: newFileList,
      ownershipFileList: types,
    }));
  };

  onRemoveLoad = (file: any) => {
    const oldFileList = this.state.loadLineFile;
    const loadLineFileList = this.state.loadLineFileList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(loadLineFileList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      loadLineFile: newFileList,
      loadLineFileList: types,
    }));
  };

  onRemoveSpe = (file: any) => {
    const oldFileList = this.state.specificationFile;
    const specificationFileList = this.state.specificationFileList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(specificationFileList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      specificationFile: newFileList,
      specificationFileList: types,
    }));
  };

  onRemoveAir = (file: any) => {
    const oldFileList = this.state.airworthinessFile;
    const airworthinessFileList = this.state.airworthinessFileList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(airworthinessFileList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      airworthinessFile: newFileList,
      airworthinessFileList: types,
    }));
  };

  onRemoveShip = (file: any) => {
    const oldFileList = this.state.shipFile;
    const shipFileList = this.state.shipFileList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(shipFileList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      shipFile: newFileList,
      shipFileList: types,
    }));
  };

  handleChangeCheck = (info: any) => {
    let count = 0;
    const dataSource = this.state.checkFileList ? this.state.checkFileList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 17;
      dataSource.push(fileLists);
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ checkflag: true });
    }
    this.setState({
      checkFile: info.fileList,
      checkFileList: dataSource,
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

  handleChangeOwnership = (info: any) => {
    let count = 0;
    const dataSource = this.state.ownershipFileList ? this.state.ownershipFileList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 18;
      dataSource.push(fileLists);
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ ownershipflag: true });
    }
    this.setState({
      ownershipFile: info.fileList,
      ownershipFileList: dataSource,
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++;
      }
    });
    if (count === info.fileList.length) {
      this.setState({ ownershipflag: false });
    }
  };

  handleChangeLoad = (info: any) => {
    let count = 0;
    const dataSource = this.state.loadLineFileList ? this.state.loadLineFileList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 8;
      dataSource.push(fileLists);
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ loadLineflag: true });
    }
    this.setState({
      loadLineFile: info.fileList,
      loadLineFileList: dataSource,
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++;
      }
    });
    if (count === info.fileList.length) {
      this.setState({ loadLineflag: false });
    }
  };

  handleChangeSpe = (info: any) => {
    let count = 0;
    const dataSource = this.state.specificationFileList ? this.state.specificationFileList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 19;
      dataSource.push(fileLists);
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ specificationflag: true });
    }
    this.setState({
      specificationFile: info.fileList,
      specificationFileList: dataSource,
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++;
      }
    });
    if (count === info.fileList.length) {
      this.setState({ specificationflag: false });
    }
  };

  handleChangeAir = (info: any) => {
    let count = 0;
    const dataSource = this.state.airworthinessFileList ? this.state.airworthinessFileList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 20;
      dataSource.push(fileLists);
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ airworthinessflag: true });
    }
    this.setState({
      airworthinessFile: info.fileList,
      airworthinessFileList: dataSource,
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++;
      }
    });
    if (count === info.fileList.length) {
      this.setState({ airworthinessflag: false });
    }
  };

  handleChangeShip = (info: any) => {
    let count = 0;
    const dataSource = this.state.shipFileList ? this.state.shipFileList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 13;
      dataSource.push(fileLists);
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ shipflag: true });
    }
    this.setState({
      shipFile: info.fileList,
      shipFileList: dataSource,
    });
    forEach(info.fileList, (pic, index) => {
      if (pic.status === 'done') {
        count++;
      }
    });
    if (count === info.fileList.length) {
      this.setState({ shipflag: false });
    }
  };

  //号段选择框
  selectPhoneCode = (id: any, option: any) => {
    this.setState({
      phoneCode: id,
    });
    focus();
  };

  serach = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  checkPic = (name:string, rule: any, val: any, callback: any) => {
    if(name === 'checkFile'){
      if (isNil(this.state.checkFile) || this.state.checkFile.length === 0) {
        callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateA.null' }));
      } else {
        callback();
      }
    }else if(name === 'ownershipFile'){
      if (isNil(this.state.ownershipFile) || this.state.ownershipFile.length === 0) {
        callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateB.null' }));
      } else {
        callback();
      }
    }else if(name === 'loadLineFile'){
      if (isNil(this.state.loadLineFile) || this.state.loadLineFile.length === 0) {
        callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateC.null' }));
      } else {
        callback();
      }
    }else if(name === 'specificationFile'){
      if (isNil(this.state.specificationFile) || this.state.specificationFile.length === 0) {
        callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateD.null' }));
      } else {
        callback();
      }
    }else if(name === 'airworthinessFile'){
      if (isNil(this.state.airworthinessFile) || this.state.airworthinessFile.length === 0) {
        callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateE.null' }));
      } else {
        callback();
      }
    }else if(name === 'shipFile'){
      if (isNil(this.state.shipFile) || this.state.shipFile.length === 0) {
        callback(formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.ship.pictures.null' }));
      } else {
        callback();
      }
    }else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator('phoneCode', {
      initialValue: isNil(this.state) || isNil(this.state.phoneCode) ? '+86' : this.state.phoneCode,
    })(
      <Select
        showSearch
        optionFilterProp="children"
        onSelect={this.selectPhoneCode}
        filterOption={this.serach}
        style={{ minWidth: '80px' }}
      >
        {getDictDetail("phone_code").map((item: any) => (
          <Select.Option value={item.textValue}>{item.textValue}</Select.Option>
        ))}
      </Select>,
    );
    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="ShipownerShipTrade-ShipownerShipTradeAddForSale.upload" />
        </div>
      </div>
    );

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? ''
              : this.state.title +
              formatMessage({
                id: 'ShipownerShipTrade-ShipownerShipTradeAdd.shipTradeInformation',
              })
          }
          event={() => this.onBack()}
        />
        <Form labelAlign="left">
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.tradeType',
                  })}
                >
                  {getFieldDecorator('tradeType', {
                    initialValue:
                      this.state == null || this.state.tradeType == null
                        ? ''
                        : this.state.tradeType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullTradeType',
                        }),
                      },
                    ],
                  })(
                    <Select
                      disabled={!isNil(this.state) && !isNil(this.state.flag) && this.state.flag === '2'}
                      onChange={this.handleTradeTypeSelect}
                    >
                      {getDictDetail('trade_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.shipType',
                  })}
                >
                  {getFieldDecorator('shipType', {
                    initialValue:
                      this.state == null || this.state.shipType == null
                        ? undefined
                        : this.state.shipType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullShipType',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.shipType' })} onChange={this.handleShipTypeSelect}>
                      {getDictDetail('ship_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.tonnage' })}
                >
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      this.state == null || this.state.tonNumber == null
                        ? ''
                        : this.state.tonNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.inputCorrectTon',
                        }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      suffix={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeView.ton',
                      })}
                      maxLength={32}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeAdd.tonnage' })}
                      onChange={e => this.setState({ tonNumber: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeList.shipAge' })}
                >
                  {getFieldDecorator('shipAge', {
                    initialValue:
                      this.state == null || this.state.shipAge == null
                        ? undefined
                        : this.state.shipAge,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullShipAge',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.shipAge' })} onChange={this.handleShipAgeSelect}>
                      {getDictDetail('ship_age').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.classificationSociety',
                  })}
                >
                  {getFieldDecorator('classificationSociety', {
                    initialValue:
                      this.state == null || this.state.classificationSociety == null
                        ? undefined
                        : this.state.classificationSociety,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullClassificationSociety',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.classificationSociety' })} onChange={this.handleClassificationSocietySelect}>
                      {getDictDetail('classification_society').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeList.voyageArea',
                  })}
                >
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      this.state == null || this.state.voyageArea == null
                        ? undefined
                        : this.state.voyageArea,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullVoyageArea',
                        }),
                      },
                    ],
                  })(
                    <Select allowClear={true}
                      placeholder={formatMessage({ id: 'ShipTrade-ShipTradeList.voyageArea' })} onChange={this.handleVoyageAreaSelect}>
                      {getDictDetail('voyage_area').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.name' })}
                >
                  {getFieldDecorator('shipName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipName) ? '' : this.state.shipName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.name.null' }),
                      },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.name' })}
                      onChange={e => {
                        this.setState({
                          shipName: e.target.value,
                        });
                      }}
                      maxLength={150}
                    ></Input>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.IMO' })}
                >
                  {getFieldDecorator('IMONo', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.imo)
                        ? ''
                        : this.state.imo,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.IMO.null' }),
                      },
                      {
                        pattern: /^[a-zA-Z0-9]{1,9}$/,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.INPUT-IMO-NUM' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={9}
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.IMO' })}
                      onChange={e => {
                        this.setState({ imo: e.target.value });
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.place' })}
                >
                  {getFieldDecorator('buildAddress', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.buildAddress) ? '' : this.state.buildAddress,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.place.null' }),
                      },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.place' })}
                      onChange={e => {
                        this.setState({
                          buildAddress: e.target.value,
                        });
                      }}
                      maxLength={32}
                    ></Input>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.year' })}
                >
                  {getFieldDecorator('buildParticularYear', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.buildParticularYear)
                        ? ''
                        : this.state.buildParticularYear,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.year.null' }),
                      },
                      {
                        // validator: checkNumber.bind(this),
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'user-login.login.pls-input-number', })
                      },
                    ],
                  })(
                    <Input
                      maxLength={4}
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.year' })}
                      onChange={e => {
                        this.setState({ buildParticularYear: e.target.value });
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.draft' })}>
                  {getFieldDecorator('draft', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.draft.null' }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.draft' })}
                      maxLength={15}
                      suffix="m"
                      onChange={e => this.setState({ draft: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.weight' })}
                >
                  {getFieldDecorator('netWeight', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.netWeight) ? '' : this.state.netWeight,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.weight.null' }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.weight' })}
                      suffix={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeView.ton' })}
                      onChange={e => this.setState({ netWeight: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeView.contacter',
                  })}
                >
                  {getFieldDecorator('contacter', {
                    initialValue:
                      this.state == null || this.state.contacter == null
                        ? ''
                        : this.state.contacter,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullContacter',
                        }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={100}
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeView.contacter',
                      })}
                      onChange={e => this.setState({ contacter: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.number' })}
                >
                  {getFieldDecorator('hatchesNumber', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.hatchesNumber) ? '' : this.state.hatchesNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.number.null' }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.number' })}
                      suffix={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.ge' })}
                      onChange={e => this.setState({ hatchesNumber: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'index-accountManager-email' })}
                >
                  {getFieldDecorator('email', {
                    initialValue:
                      this.state == null || this.state.email == null
                        ? ''
                        : this.state.email,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'index-accountManager-email.null' }),
                      },
                      {
                        validator: checkEmail.bind(
                          this, 'email',
                        ),
                      },
                    ],
                  })(<Input
                    maxLength={32}
                    placeholder={formatMessage({ id: 'AccountManagement-NewEmailAddress.email.enter' })}
                    onChange={e => this.setState({ email: e.target.value })}
                  />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeView.phoneNumber',
                  })}
                >
                  {getFieldDecorator('contactPhone', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.phoneNumber)
                        ? ''
                        : this.state.phoneNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'ShipownerShipTrade-ShipownerShipTradeAdd.nullPhoneNumber',
                        }),
                      },
                      {
                        pattern: new RegExp(/^[0-9]\d*$/),
                        message: formatMessage({ id: 'insuranceForShipper-insuranceAdd.phonenumber.enter.correct' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={20}
                      addonBefore={prefixSelector}
                      placeholder={formatMessage({
                        id: 'ShipownerShipTrade-ShipownerShipTradeView.phoneNumber',
                      })}
                      style={{ width: '100%' }}
                      onChange={e => this.setState({ phoneNumber: e.target.value })}
                      value={
                        isNil(this.state) || isNil(this.state.phoneNumber)
                          ? ''
                          : this.state.phoneNumber
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>
              {formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificate' })}
            </span>
          </div>
          <div className={commonCss.AddForm}>
          <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateA' })}>
                  </Form.Item></Col></Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout} required>
                  {getFieldDecorator(`checkFile`, {
                    rules: [
                      {
                        validator: this.checkPic.bind(this,"checkFile"),
                      }
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_inspection_certificate}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.checkFile) ||
                          this.state.checkFile.length === 0
                          ? ''
                          : this.state.checkFile
                      }
                      onRemove={this.onRemoveCheck}
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeCheck}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.checkFile) ||
                        this.state.checkFile.length < 3
                        ? uploadButton
                        : null}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateB' })}>
                  </Form.Item></Col></Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout} required>
                  {getFieldDecorator(`ownershipFile`, {
                    rules: [
                      {
                        validator: this.checkPic.bind(this,"ownershipFile"),
                      }
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_ownership_certificate}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.ownershipFile) ||
                          this.state.ownershipFile.length === 0
                          ? ''
                          : this.state.ownershipFile
                      }
                      onRemove={this.onRemoveOwnership}
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeOwnership}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.ownershipFile) ||
                        this.state.ownershipFile.length < 3
                        ? uploadButton
                        : null}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateC' })}>
                  </Form.Item></Col>
              <Col span={8}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateD' })}>
                  </Form.Item></Col>
              <Col span={8}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.certificateE' })}>
                  </Form.Item></Col></Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item {...formlayout} required>
                  {getFieldDecorator(`loadLineFile`, {
                    rules: [
                      {
                        validator: this.checkPic.bind(this,"loadLineFile"),
                      }
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_load_line_certificate}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.loadLineFile) ||
                          this.state.loadLineFile.length === 0
                          ? ''
                          : this.state.loadLineFile
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeLoad}
                      onRemove={this.onRemoveLoad}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.loadLineFile) ||
                        this.state.loadLineFile.length < 1
                        ? uploadButton
                        : null}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formlayout} required>
                  {getFieldDecorator(`specificationFile`, {
                    rules: [
                      {
                        validator: this.checkPic.bind(this,"specificationFile"),
                      }
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_code_certificate}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.specificationFile) ||
                          this.state.specificationFile.length === 0
                          ? ''
                          : this.state.specificationFile
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeSpe}
                      onRemove={this.onRemoveSpe}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.specificationFile) ||
                        this.state.specificationFile.length < 1
                        ? uploadButton
                        : null}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formlayout} required>
                  {getFieldDecorator(`airworthinessFile`, {
                    rules: [
                      {
                        validator: this.checkPic.bind(this,"airworthinessFile"),
                      }
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_seaworthiness_certificate}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.airworthinessFile) ||
                          this.state.airworthinessFile.length === 0
                          ? ''
                          : this.state.airworthinessFile
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeAir}
                      onRemove={this.onRemoveAir}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.airworthinessFile) ||
                        this.state.airworthinessFile.length < 1
                        ? uploadButton
                        : null}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>
              {formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAddForSale.upload.pictures' })}
            </span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item {...formlayout} required>
                  {getFieldDecorator(`shipFile`, {
                    rules: [
                      {
                        validator: this.checkPic.bind(this,"shipFile"),
                      }
                    ],
                  })(
                    <Upload
                      action={"/api/sys/file/upload/" + fileType.ship_picture}
                      listType="picture-card"
                      accept=".gif,.bmp,.png,.img,.jpeg,.jpg,.tiff"
                      beforeUpload={HandleBeforeUpload.bind(this)}
                      headers={{ token: String(localStorage.getItem('token')) }}
                      showUploadList={{
                        showPreviewIcon: true,
                        showDownloadIcon: false,
                        showRemoveIcon: true,
                      }}
                      fileList={
                        isNil(this.state) ||
                          isNil(this.state.shipFile) ||
                          this.state.shipFile.length === 0
                          ? ''
                          : this.state.shipFile
                      }
                      onRemove={this.onRemoveShip}
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeShip}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.shipFile) ||
                        this.state.shipFile.length < 3
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({
                    id: 'ShipownerShipTrade-ShipownerShipTradeAdd.otherDescription',
                  })}
                ></Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator('remark', {
                    initialValue:
                      this.state == null || this.state.remark == null ? '' : this.state.remark,
                  })(<TextArea style={{ height: 90 }}
                    maxLength={250}
                    placeholder={formatMessage({ id: 'ShipTrade-ShipTradeAdd.otherDescription' })} onChange={e => this.setState({ remark: e.target.value })} />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row className={commonCss.rowTop}>
            <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
              <ButtonOptionComponent
                disabled={!isNil(this.state) && (this.state.checkflag || this.state.ownershipflag || this.state.loadLineflag || this.state.specificationflag || this.state.airworthinessflag || this.state.shipflag)}
                type="Save"
                text={formatMessage({ id: 'ShipownerShipTrade-ShipownerShipTradeAdd.save' })}
                event={() => this.handleSubmit(0, this.state.guid)}
              />
            </Col>
            <Col span={12}>
              <ButtonOptionComponent
                disabled={!isNil(this.state) && (this.state.checkflag || this.state.ownershipflag || this.state.loadLineflag || this.state.specificationflag || this.state.airworthinessflag || this.state.shipflag)}
                type="SaveAndCommit"
                text={formatMessage({
                  id: 'ShipownerShipTrade-ShipownerShipTradeAdd.saveAndSubmit',
                })}
                event={() => this.newMethod()}
              />
            </Col>
          </Row>
        </Form>
        <Modal className="picModal"
          visible={
            isNil(this.state) || isNil(this.state.previewVisible)
              ? false
              : this.state.previewVisible
          }
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage}
          />
          <a onClick={()=>linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
        </Modal>
      </div>
    );
  }

  private newMethod() {
    confirm({
      title: formatMessage({ id: 'Common-Publish.confirm.not' }),
      okText: formatMessage({
        id: 'Common-Publish.publish.confirm',
      }),
      cancelText: formatMessage({
        id: 'Common-Publish.publish.cancle',
      }),
      onOk: () => {
        this.handleSubmit(1, this.state.guid);
      },
    });
  }
}

const ShipTradeAddForSale_Form = Form.create({ name: 'shipTradeAddForSale_Form' })(ShipownerShipTradeAddForSale);

export default ShipTradeAddForSale_Form;
