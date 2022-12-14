import { getRequest, postRequest, putRequest } from '@/utils/request';
import { getDictDetail, linkHref } from '@/utils/utils';
import { Col, DatePicker, Divider, Form, Icon, Input, message, Modal, Row, Select, Upload } from 'antd';
import { forEach, isNil, filter } from 'lodash';
import moment from 'moment';
import React from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import ButtonOptionComponent from '../../Common/Components/ButtonOptionComponent';
import LabelTitleComponent from '../../Common/Components/LabelTitleComponent';
import commonCss from '../../Common/css/CommonCss.less';
import { FileMsg, MyShipFormProps, PicList } from './MyShipFormInterface';
import { checkNumber, HandleBeforeUpload } from '@/utils/validator';

const { confirm } = Modal;

const FORMAT = 'YYYY/MM/DD';
class MyShipAdd extends React.Component<MyShipFormProps, MyShipFormProps> {
  constructor(prop: MyShipFormProps) {
    super(prop);
  }

  componentDidMount() {
    this.setState({
      type: 1,
      state: 0,
      picList: [],
      history: this.props.history,
      title: formatMessage({ id: 'Myship-MyshipAdd.add' }),
      previewVisible: false,
      startTime: moment(),
      endTime: moment().add(3, 'months').add(1, 'days'),
      registryStartTime: moment(),
      registryEndTime: moment().add(3, 'months').add(1, 'days'),
      leaseStartTime: (String(localStorage.getItem('ownerType'))==="1")?moment():'',
      leaseEndTime: (String(localStorage.getItem('ownerType'))==="1")?moment().add(3, 'months').add(1, 'days'):'',
      pmiDeadline: 1,
      registryDeadline: 1,
      leaseDeadline: (String(localStorage.getItem('ownerType'))==="1")?1:0,
      pmiflag: false,
      regflag: false,
      partyflag: false,
      shipflag: false,

    });

    let guid = this.props.match.params['guid'] ? this.props.match.params['guid'] : null;
    if (!isNil(guid)) {
      this.setState({
        title: formatMessage({ id: 'Myship-MyshipAdd.update' }),
        guid: guid,
      });
      let param: Map<string, string> = new Map();
      param.set('type', '1');
      param.set('guid', guid);
      getRequest('/business/ship/' + guid, param, (response: any) => {
        if (response.status === 200) {
          if (!isNil(response.data)) {
            this.setState({
              // type: response.data.ship.type,
              shipName: response.data.ship.shipName,
              buildParticularYear: response.data.ship.buildParticularYear,
              tonNumber: response.data.ship.tonNumber,
              draft: response.data.ship.draft,
              shipDeck: response.data.ship.shipDeck,
              capacity: response.data.ship.capacity,
              anchoredPort: response.data.ship.anchoredPort,
              shipType: response.data.ship.shipType,
              classificationSociety: response.data.ship.classificationSociety,
              voyageArea: response.data.ship.voyageArea,
              shipCrane: response.data.ship.shipCrane,
              state: response.data.ship.state,
              startTime: moment(Number(response.data.ship.startTime)),
              endTime: moment(Number(response.data.ship.endTime)),
              registryStartTime: moment(Number(response.data.ship.registryStartTime)),
              registryEndTime: moment(Number(response.data.ship.registryEndTime)),
              leaseStartTime: response.data.ship.leaseStartTime ? moment(Number(response.data.ship.leaseStartTime)) : '',
              leaseEndTime: response.data.ship.leaseEndTime ? moment(Number(response.data.ship.leaseEndTime)) : '',
              charterWay: response.data.ship.charterWay,
              pmiDeadline: response.data.ship.pmiDeadline,
              registryDeadline: response.data.ship.registryDeadline,
              leaseDeadline: response.data.ship.leaseStartTime || response.data.ship.leaseEndTime ? response.data.ship.leaseDeadline : 0,
              mmsi: response.data.ship.mmsi,
              picList: response.data.picList,
              //flag为2代表修改
              flag: '2',
            });
            const regArr = filter(response.data.picList, { fileLog: 5 });
            const pmiArr = filter(response.data.picList, { fileLog: 10 });
            const leaseArr = filter(response.data.picList, { fileLog: 9 });
            const shipArr = filter(response.data.picList, { fileLog: 23 });
            if (regArr.length !== 0) {
              forEach(regArr, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest(
                  '/sys/file/getThumbImageBase64/' + pic.fileType,
                  picParams,
                  (response: any) => {
                    if (response.status === 200) {
                      if (pic.fileLog === 5) {
                        this.setState({
                          registryFile: [
                            {
                              uid: index,
                              name: response.data[0].fileName,
                              status: 'done',
                              thumbUrl: response.data[0].base64,
                              fileName: pic.fileName,
                              type: pic.fileType,
                            },
                          ],
                        });
                      }
                    }
                  },
                );
              });
            }
            if (pmiArr.length !== 0) {
              forEach(pmiArr, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest(
                  '/sys/file/getThumbImageBase64/' + pic.fileType,
                  picParams,
                  (response: any) => {
                    if (response.status === 200) {
                      if (pic.fileLog === 10) {
                        this.setState({
                          pmiFile: [
                            {
                              uid: index,
                              name: response.data[0].fileName,
                              status: 'done',
                              thumbUrl: response.data[0].base64,
                              fileName: pic.fileName,
                              type: pic.fileType,
                            },
                          ],
                        });
                      }
                    }
                  },
                );
              });
            }
            if (leaseArr.length !== 0) {
              forEach(leaseArr, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest(
                  '/sys/file/getThumbImageBase64/' + pic.fileType,
                  picParams,
                  (response: any) => {
                    if (response.status === 200) {
                      if (pic.fileLog === 9) {
                        this.setState({
                          leaseFile: [
                            {
                              uid: index,
                              name: response.data[0].fileName,
                              status: 'done',
                              thumbUrl: response.data[0].base64,
                              fileName: pic.fileName,
                              type: pic.fileType,
                            },
                          ],
                        });
                      }
                    }
                  },
                );
              });
            }
            if (shipArr.length !== 0) {
              let shipFileList: FileMsg[] = [];
              forEach(shipArr, (pic, index) => {
                let picParams: Map<string, string> = new Map();
                picParams.set('fileNames', pic.fileName);
                getRequest(
                  '/sys/file/getThumbImageBase64/' + pic.fileType,
                  picParams,
                  (response: any) => {
                    if (response.status === 200) {
                      if (pic.fileLog === 23) {
                        let fileList: FileMsg = {};
                        fileList.uid = index;
                        fileList.name = response.data[0].fileName;
                        fileList.status = 'done';
                        fileList.thumbUrl = response.data[0].base64;
                        fileList.fileName = pic.fileName;
                        fileList.type = pic.fileType;
                        shipFileList.push(fileList);
                        if (shipFileList.length === shipArr.length) {
                          this.setState({
                            shipFile: shipFileList,
                            picNum: shipFileList.length,
                          });
                        }
                      }
                    }
                  },
                );
              });
            }
          }
        }
      });
    } else {
      this.setState({
        //flag为1代表新增
        flag: '1',
      });
    }
  }

  onBack = () => {
    if (!isNil(this.props.match.params['status'])) {
      this.props.history.push('/myship/list/' + this.props.match.params['status']);
    } else {
      this.props.history.push('/myship/list/2');
    }
  };

  //提交
  handleSubmit(type: number, flag: string, state: number) {
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        let param = {};
        if (flag === '1') {
          param = {
            type: type,
            shipName: this.state.shipName,
            buildParticularYear: values.buildParticularYear,
            tonNumber: values.tonNumber,
            draft: values.draft,
            shipDeck: this.state.shipDeck,
            capacity: values.capacity,
            anchoredPort: values.anchoredPort,
            shipType: this.state.shipType,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            shipCrane: values.shipCrane,
            state: state,
            startTime: moment(values.PMIStartDate).valueOf(),
            endTime: moment(values.PMIEndDate).valueOf(),
            registryStartTime: moment(values.registryStartDate).valueOf(),
            registryEndTime: moment(values.registryEndDate).valueOf(),
            leaseStartTime: values.leaseStartDate?moment(values.leaseStartDate).valueOf():'',
            leaseEndTime: values.leaseEndDate?moment(values.leaseEndDate).valueOf():'',
            charterWay: this.state.charterWay,
            pmiDeadline: this.state.pmiDeadline,
            registryDeadline: this.state.registryDeadline,
            leaseDeadline: this.state.leaseDeadline,
            picList: this.state.picList,
            mmsi: this.state.mmsi,
          };
          //新增船舶
          postRequest('/business/ship', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'Emergency-EmergencyAdd.successfulAdd' }), 2);
              this.props.history.push('/MyShip');
            } else {
              message.error(formatMessage({ id: 'Emergency-EmergencyAdd.failAdd' }), 2);
            }
          });
        } else if (flag === '2') {
          let b: PicList[] = [];
          forEach(this.state.picList, (pic: any, index) => {
            let a: PicList = {};
            if (pic.type) {
              a.type = pic.type;
            } else {
              a.type = pic.fileType;
            }
            a.fileName = pic.fileName;
            a.fileLog = pic.fileLog;
            b.push(a);
          });
          param = {
            type: type,
            guid: this.state.guid,
            shipName: this.state.shipName,
            buildParticularYear: values.buildParticularYear,
            tonNumber: values.tonNumber,
            draft: values.draft,
            shipDeck: this.state.shipDeck,
            capacity: values.capacity,
            anchoredPort: values.anchoredPort,
            shipType: this.state.shipType,
            classificationSociety: this.state.classificationSociety,
            voyageArea: this.state.voyageArea,
            shipCrane: values.shipCrane,
            state: state,
            startTime: moment(values.PMIStartDate).valueOf(),
            endTime: moment(values.PMIEndDate).valueOf(),
            registryStartTime: moment(values.registryStartDate).valueOf(),
            registryEndTime: moment(values.registryEndDate).valueOf(),
            leaseStartTime: this.state.leaseStartTime===0?'':moment(this.state.leaseStartTime).valueOf(),
            leaseEndTime: this.state.leaseEndTime===0? '':moment(this.state.leaseEndTime).valueOf(),
            charterWay: this.state.charterWay,
            pmiDeadline: this.state.pmiDeadline,
            registryDeadline: this.state.registryDeadline,
            leaseDeadline: this.state.leaseDeadline,
            picList: b,
            mmsi: this.state.mmsi,
          };
          //修改船舶
          putRequest('/business/ship', JSON.stringify(param), (response: any) => {
            if (response.status === 200) {
              message.success(formatMessage({ id: 'Emergency-EmergencyAdd.successfulUpdate' }), 2);
              this.props.history.push('/MyShip');
            } else {
              message.error(formatMessage({ id: 'Emergency-EmergencyAdd.failUpdate' }), 2);
            }
          });
        }
      }
    });
  }

  handleShipDeckSelect = (value: any) => {
    this.setState({
      shipDeck: value,
    });
  };

  handleShipTypeSelect = (value: any) => {
    this.setState({
      shipType: value,
    });
  };

  handleVoyageAreaSelect = (value: any) => {
    this.setState({
      voyageArea: value,
    });
  };

  handleClassificationSocietySelect = (value: any) => {
    this.setState({
      classificationSociety: value,
    });
  };

  handleCharterWaySelect = (value: any) => {
    this.setState({
      charterWay: value,
    });
  };

  // 获取DatePick.value
  handlePmiStartDatePick = (value: any) => {
    this.setState(
      {
        startTime: Number(value),
      },
      () => {
        if (!isNil(this.state.startTime) && !isNil(this.state.endTime)) {
          let day = 0;
          let yearStart = moment(Number(this.state.startTime)).year();
          let yearend = moment(Number(this.state.endTime)).year();
          if (yearend - yearStart === 0) {
            this.setState({
              pmiDeadline: 1,
            });
          } else {
            let checkDate = moment(Number(this.state.startTime)).add('years', yearend - yearStart);
            if (moment(Number(this.state.endTime)).isSame(checkDate)) {
              day = yearend - yearStart;
            } else {
              if (moment(Number(this.state.endTime)).isBefore(checkDate)) {
                day = yearend - yearStart;
              } else if (moment(Number(this.state.endTime)).isAfter(checkDate)) {
                day = yearend - yearStart + 1;
              }
            };
            this.setState({
              pmiDeadline: day,
            });
          }
        }
      },
    );
  };

  handlePmiEndDateDatePick = (value: any) => {
    this.setState(
      {
        endTime: Number(value),
      },
      () => {
        if (!isNil(this.state.startTime) && !isNil(this.state.endTime)) {
          let day = 0;
          let yearStart = moment(Number(this.state.startTime)).year();
          let yearend = moment(Number(this.state.endTime)).year();
          if (yearend - yearStart === 0) {
            this.setState({
              pmiDeadline: 1,
            });
          } else {
            let checkDate = moment(Number(this.state.startTime)).add('years', yearend - yearStart);
            if (moment(Number(this.state.endTime)).isSame(checkDate)) {
              day = yearend - yearStart;
            } else {
              if (moment(Number(this.state.endTime)).isBefore(checkDate)) {
                day = yearend - yearStart;
              } else if (moment(Number(this.state.endTime)).isAfter(checkDate)) {
                day = yearend - yearStart + 1;
              }
            };
            this.setState({
              pmiDeadline: day,
            });
          }
        }
      },
    );
  };

  handleRegStartDatePick = (value: any) => {
    this.setState(
      {
        registryStartTime: Number(value),
      },
      () => {
        if (!isNil(this.state.registryStartTime) && !isNil(this.state.registryEndTime)) {
          let day = 0;
          let yearStart = moment(Number(this.state.registryStartTime)).year();
          let yearend = moment(Number(this.state.registryEndTime)).year();
          if (yearend - yearStart === 0) {
            this.setState({
              registryDeadline: 1,
            });
          } else {
            let checkDate = moment(Number(this.state.registryStartTime)).add('years', yearend - yearStart);
            if (moment(Number(this.state.registryEndTime)).isSame(checkDate)) {
              day = yearend - yearStart;
            } else {
              if (moment(Number(this.state.registryEndTime)).isBefore(checkDate)) {
                day = yearend - yearStart;
              } else if (moment(Number(this.state.registryEndTime)).isAfter(checkDate)) {
                day = yearend - yearStart + 1;
              }
            };
            this.setState({
              registryDeadline: day,
            });
          }
        }
      },
    );
  };

  handleRegEndDateDatePick = (value: any) => {
    this.setState(
      {
        registryEndTime: Number(value),
      },
      () => {
        if (!isNil(this.state.registryStartTime) && !isNil(this.state.registryEndTime)) {
          let day = 0;
          let yearStart = moment(Number(this.state.registryStartTime)).year();
          let yearend = moment(Number(this.state.registryEndTime)).year();
          if (yearend - yearStart === 0) {
            this.setState({
              registryDeadline: 1,
            });
          } else {
            let checkDate = moment(Number(this.state.registryStartTime)).add('years', yearend - yearStart);
            if (moment(Number(this.state.registryEndTime)).isSame(checkDate)) {
              day = yearend - yearStart;
            } else {
              if (moment(Number(this.state.registryEndTime)).isBefore(checkDate)) {
                day = yearend - yearStart;
              } else if (moment(Number(this.state.registryEndTime)).isAfter(checkDate)) {
                day = yearend - yearStart + 1;
              }
            };
            this.setState({
              registryDeadline: day,
            });
          }
        }
      },
    );
  };

  handlePartyStartDatePick = (value: any) => {
    this.setState(
      {
        leaseStartTime: Number(value),
      },
      () => {
        this.props.form.validateFields(["leaseStartDate","leaseEndDate","party"])
        if(this.state.leaseStartTime === 0 || this.state.leaseStartTime === '' || this.state.leaseEndTime === 0  || this.state.leaseEndTime === '' ){
          this.setState({
            leaseDeadline: 0,
          });
          return;
        }
        if (!isNil(this.state.leaseStartTime) && !isNil(this.state.leaseEndTime)) {
          let day = 0;
          let yearStart = moment(Number(this.state.leaseStartTime)).year();
          let yearend = moment(Number(this.state.leaseEndTime)).year();
          if (yearend - yearStart === 0) {
            this.setState({
              leaseDeadline: 1,
            });
          } else {
            let checkDate = moment(Number(this.state.leaseStartTime)).add('years', yearend - yearStart);
            if (moment(Number(this.state.leaseEndTime)).isSame(checkDate)) {
              day = yearend - yearStart;
            } else {
              if (moment(Number(this.state.leaseEndTime)).isBefore(checkDate)) {
                day = yearend - yearStart;
              } else if (moment(Number(this.state.leaseEndTime)).isAfter(checkDate)) {
                day = yearend - yearStart + 1;
              }
            };
            this.setState({
              leaseDeadline: day,
            });
          }
        }
      });
  };

  handlePartyEndDateDatePick = (value: any) => {
    this.setState(
      {
        leaseEndTime: Number(value),
      },
      () => {
        this.props.form.validateFields(["leaseStartDate","leaseEndDate","party"])
        if(this.state.leaseStartTime === 0 || this.state.leaseStartTime === '' || this.state.leaseEndTime === 0  || this.state.leaseEndTime === '' ){
          this.setState({
            leaseDeadline: 0,
          });
          return;
        }
        if (!isNil(this.state.registryStartTime) && !isNil(this.state.leaseEndTime)) {
          let day = 0;
          let yearStart = moment(Number(this.state.leaseStartTime)).year();
          let yearend = moment(Number(this.state.leaseEndTime)).year();
          if (yearend - yearStart === 0) {
            this.setState({
              leaseDeadline: 1,
            });
          } else {
            let checkDate = moment(Number(this.state.leaseStartTime)).add('years', yearend - yearStart);
            if (moment(Number(this.state.leaseEndTime)).isSame(checkDate)) {
              day = yearend - yearStart;
            } else {
              if (moment(Number(this.state.leaseEndTime)).isBefore(checkDate)) {
                day = yearend - yearStart;
              } else if (moment(Number(this.state.leaseEndTime


              )).isAfter(checkDate)) {
                day = yearend - yearStart + 1;
              }
            };
            this.setState({
              leaseDeadline: day,
            });
          }
        }
      });
  };

  handleCancel = () => this.setState({ previewVisible: false });

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

  // 检查图片是否上传
  checkPmiFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.pmiFile) || this.state.pmiFile.length === 0) {
      callback(formatMessage({ id: 'Myship-MyshipAdd.certificate.p.null' }));
    } else {
      callback();
    }
  };

  checkRegistryFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.registryFile) || this.state.registryFile.length === 0) {
      callback(formatMessage({ id: 'Myship-MyshipAdd.certificate.registry.null' }));
    } else {
      callback();
    }
  };

  // 租船合同上传需要check起始日期和截止日期
  checkPartyFile = (rule: any, val: any, callback: any) => {
    if(String(localStorage.getItem('ownerType'))==="1")
    {
      if(isNil(this.state.leaseFile) || this.state.leaseFile.length === 0 ){
        callback(formatMessage({ id: 'Myship-MyshipAdd.Charter.party.null' }));
      }else{
        callback();
      }
    }else{
      if(isNil(this.state.leaseFile) || this.state.leaseFile.length === 0 ){
        if(((isNil(this.state.leaseStartTime) || this.state.leaseStartTime === '' || this.state.leaseStartTime === 0) && 
        (isNil(this.state.leaseEndTime) || this.state.leaseEndTime === '' || this.state.leaseEndTime === 0))){
          callback();
        }else if(!isNil(this.state.leaseStartTime) && this.state.leaseStartTime !== '' &&
        !isNil(this.state.leaseEndTime) && this.state.leaseEndTime !== ''){
          callback(formatMessage({ id: 'Myship-MyshipAdd.Charter.party.null' }));
        }else if((!isNil(this.state.leaseStartTime) && this.state.leaseStartTime !== '') ||
        (!isNil(this.state.leaseEndTime) && this.state.leaseEndTime !== '')){
          callback(formatMessage({ id: 'Myship-MyshipAdd.Charter.party.null' }));
        }else{
          callback(formatMessage({ id: 'Myship-MyshipAdd.Charter.party.time' }));
        }
      }else if((isNil(this.state.leaseStartTime) || this.state.leaseStartTime === '' || this.state.leaseStartTime === 0) ||
        (isNil(this.state.leaseEndTime) || this.state.leaseEndTime === '' || this.state.leaseEndTime === 0)){
          callback(formatMessage({ id: 'Myship-MyshipAdd.Charter.party.time' }));
      }else if(this.state.leaseFile.length === 0 && (!isNil(this.state.leaseStartTime) && this.state.leaseStartTime !== '' ||
        !isNil(this.state.leaseEndTime) && this.state.leaseEndTime !== '')){
          callback(formatMessage({ id: 'Myship-MyshipAdd.upload.Charter.party' }));
      }else{
        callback();
      }
    }
  };

  checkShipFile = (rule: any, val: any, callback: any) => {
    if (isNil(this.state.shipFile) || this.state.shipFile.length === 0) {
      callback(formatMessage({ id: 'Myship-MyshipView.upload.picture.null' }));
    } else {
      callback();
    }
  };

  //上传图片变更
  handleChangePMI = (info: any) => {
    const dataSource = this.state.picList;
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 10;
      dataSource.push(fileLists);
      this.setState({ pmiflag: false });
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ pmiflag: true });
    }
    this.setState({
      pmiFile: info.fileList,
      picList: dataSource,
    });
  };

  handleChangeReg = (info: any) => {
    const dataSource = this.state.picList;
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 5;
      dataSource.push(fileLists);
      this.setState({ regflag: false });
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ regflag: true });
    }
    this.setState({
      registryFile: info.fileList,
      picList: dataSource,
    });
  };

  handleChangeParty = (info: any) => {
    const dataSource = this.state.picList;
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 9;
      dataSource.push(fileLists);
      this.setState({ partyflag: false });
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ partyflag: true });
    }
    this.setState({
      leaseFile: info.fileList,
      picList: dataSource,
    });
  };

  handleChangeShip = (info: any) => {
    let count = 0;
    const dataSource = this.state.picList ? this.state.picList : [];
    if (!isNil(info.file.status) && info.file.status === 'done') {
      let fileLists: PicList = {};
      fileLists.type = info.file.response.data.type;
      fileLists.fileName = info.file.response.data.fileName;
      fileLists.fileLog = 23;
      dataSource.push(fileLists);
      this.setState({
        picList: dataSource,
      });
    } else if (!isNil(info.file.status) && info.file.status === 'uploading') {
      this.setState({ shipflag: true });
    }
    this.setState({
      shipFile: info.fileList,
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

  //删除图片
  onRemovePMI = (file: any) => {
    const oldFileList = this.state.pmiFile;
    const picList = this.state.picList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(picList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      pmiFile: newFileList,
      picList: types,
    }));
  };

  onRemoveReg = (file: any) => {
    const oldFileList = this.state.registryFile;
    const picList = this.state.picList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(picList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      registryFile: newFileList,
      picList: types,
    }));
  };

  onRemoveParty = (file: any) => {
    const oldFileList = this.state.leaseFile;
    const picList = this.state.picList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(picList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      leaseFile: newFileList,
      picList: types,
    }));
  };

  onRemoveShip = (file: any) => {
    const oldFileList = this.state.shipFile;
    const picList = this.state.picList;
    const newFileList: PicList[] = [];
    forEach(oldFileList, (attachment, index) => {
      if (file.fileName !== attachment.fileName) {
        newFileList.push(attachment);
      }
    });
    const types: PicList[] = [];
    forEach(picList, (attachment, index) => {
      if ((!isNil(file.response) ? file.response.data.fileName : file.fileName) !== attachment.fileName) {
        types.push(attachment);
      }
    });
    this.setState(() => ({
      shipFile: newFileList,
      picList: types,
    }));
  };

  //判断结束日期大于当前日期三个月
  checkEndtimePick = (rule: any, val: any, callback: any) => {
    const nextMonthDate = moment(new Date())
      .add('months', 3).add('days', 1)
      .format('YYYY/MM/DD');
    const date = moment(val).format('YYYY/MM/DD');
    if (moment(date).isBefore(nextMonthDate)) {
      callback(formatMessage({ id: 'Myship-PMI.end.date.invalid.within.3m' }));
    } else {
      callback();
    }
  };

  //判断起始日期不能晚于当前日期
  checkStarttimePick = (rule: any, val: any, callback: any) => {
    const today = moment(new Date()).format('YYYY/MM/DD');
    const date = moment(val).format('YYYY/MM/DD');
    if (moment(date).isAfter(today)) {
      callback(formatMessage({ id: 'Myship-PMI.start.date.later.current.date' }));
    } else {
      callback();
    }
  };

  //判断租船合同结束日期大于当前日期三个月
  checkPartyEndtimePick = (rule: any, val: any, callback: any) => {

    if(String(localStorage.getItem('ownerType'))==="1")
    {
      const nextMonthDate = moment(new Date())
          .add('months', 3).add('days', 1)
          .format('YYYY/MM/DD');
      const date = moment(val).format('YYYY/MM/DD');
      if (moment(date).isBefore(nextMonthDate)) {
        callback(formatMessage({ id: 'Myship-PMI.end.date.invalid.within.3m' }));
      } else {
        callback();
      }
    }else
    {
      if ((!isNil(val)&&val !== undefined) || this.props.form.getFieldValue("leaseStartTime") !== undefined ) {
        const nextMonthDate = moment(new Date())
          .add('months', 3).add('days', 1)
          .format('YYYY/MM/DD');
        const date = moment(val).format('YYYY/MM/DD');
        if (moment(date).isBefore(nextMonthDate)) {
          callback(formatMessage({ id: 'Myship-PMI.end.date.invalid.within.3m' }));
        } else {
          callback();
        }
      }else if(this.state.leaseStartTime && (val === undefined || isNil(val))){
        callback(formatMessage({ id: 'Myship-PMI.end.date.null' }));
      } else {
        callback();
      }
    }
  };

  checkPartyStarttimePick = (rule: any, val: any, callback: any) => {
    
    if(String(localStorage.getItem('ownerType'))==="1")
    {
      if(!isNil(val)){
        const today = moment(new Date()).format('YYYY/MM/DD');
        const date = moment(val).format('YYYY/MM/DD');
        if (moment(date).isAfter(today)) {
          callback(formatMessage({ id: 'Myship-PMI.start.date.later.current.date' }));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }else{
      if(this.state.leaseEndTime && (val === undefined || isNil(val))){
        callback(formatMessage({ id: 'Myship-PMI.start.date.null' }));
      }else if(!isNil(val)){
        const today = moment(new Date()).format('YYYY/MM/DD');
        const date = moment(val).format('YYYY/MM/DD');
        if (moment(date).isAfter(today)) {
          callback(formatMessage({ id: 'Myship-PMI.start.date.later.current.date' }));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
  };

  serachPort = (input: any, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formlayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">
          <FormattedMessage id="Myship-.UploadMyShip.upload" />
        </div>
      </div>
    );

    return (
      <div className={commonCss.container}>
        <LabelTitleComponent
          text={
            isNil(this.state) || isNil(this.state.title)
              ? ''
              : this.state.title + formatMessage({ id: 'Myship-MyshipAdd.ship' })
          }
          event={() => this.onBack()}
        />
        <Form labelAlign="left">
          <div className={commonCss.AddForm} style={{ marginBottom: 5 }}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.shipname' })}
                >
                  {getFieldDecorator('shipName', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipName) ? '' : this.state.shipName,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.shipname.null' }),
                      },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.shipname' })}
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
                  label={formatMessage({ id: 'Myship-MyshipAdd.shiptype' })}
                >
                  {getFieldDecorator('shipDeck', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipDeck)
                        ? undefined
                        : this.state.shipDeck,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.shiptype.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.shiptype' })}
                      onChange={this.handleShipDeckSelect}
                    >
                      {getDictDetail('ship_deck').map((item: any) => (
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
                  label={formatMessage({ id: 'Myship-MyshipAdd.shipType' })}
                >
                  {getFieldDecorator('shipType', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipType)
                        ? undefined
                        : this.state.shipType,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.shipType.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.shipType' })}
                      onChange={this.handleShipTypeSelect}
                    >
                      {getDictDetail('ship_type').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.construct' })}
                >
                  {getFieldDecorator('buildParticularYear', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.buildParticularYear)
                        ? ''
                        : this.state.buildParticularYear,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.construct.null' }),
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
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.construct' })}
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
                <Form.Item {...formlayout} label={formatMessage({ id: 'Myship-MyshipAdd.draft' })}>
                  {getFieldDecorator('draft', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.draft) ? '' : this.state.draft,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.draft.enter' }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.draft' })}
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
                  label={formatMessage({ id: 'Myship-MyshipAdd.deadweight' })}
                >
                  {getFieldDecorator('tonNumber', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.tonNumber) ? '' : this.state.tonNumber,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.deadweight.enter' }),
                      },
                      {
                        validator: checkNumber.bind(this),
                      },
                    ],
                  })(
                    <Input
                      maxLength={15}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.deadweight' })}
                      suffix={formatMessage({ id: 'Myship-MyshipAdd.t' })}
                      onChange={e => this.setState({ tonNumber: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.crane' })}
                >
                  {getFieldDecorator('shipCrane', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.shipCrane) ? '' : this.state.shipCrane,
                  })(
                    <Input
                      maxLength={20}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.boat.crane' })}
                      onChange={e => this.setState({ shipCrane: e.target.value })}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.port' })}
                >
                  {getFieldDecorator('anchoredPort', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.anchoredPort)
                        ? undefined
                        : this.state.anchoredPort,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.boat.port.null' }),
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.boat.port' })}
                      optionFilterProp="children"
                      onChange={(value: any) => {
                        this.setState({ anchoredPort: value });
                      }}
                      filterOption={this.serachPort}
                    >
                      {getDictDetail('port').map((item: any) => (
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
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.area' })}
                >
                  {getFieldDecorator('voyageArea', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.voyageArea)
                        ? undefined
                        : this.state.voyageArea,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.boat.area.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.boat.area' })}
                      onChange={this.handleVoyageAreaSelect}
                    >
                      {getDictDetail('voyage_area').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.classification.society' })}
                >
                  {getFieldDecorator('classificationSociety', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.classificationSociety)
                        ? undefined
                        : this.state.classificationSociety,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'Myship-MyshipAdd.classification.society.null',
                        }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.classification.society' })}
                      onChange={this.handleClassificationSocietySelect}
                    >
                      {getDictDetail('classification_society').map((item: any) => (
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
                  label={formatMessage({ id: 'Myship-MyshipAdd.Charter.way' })}
                >
                  {getFieldDecorator('charterWay', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.charterWay)
                        ? undefined
                        : this.state.charterWay,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.Charter.way.null' }),
                      },
                    ],
                  })(
                    <Select
                      allowClear={true}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.Charter.way' })}
                      onChange={this.handleCharterWaySelect}
                    >
                      {getDictDetail('charter_way').map((item: any) => (
                        <option value={item.code}>{item.textValue}</option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipAdd.boat.mmsi' })}
                >
                  {getFieldDecorator('mmsi', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.mmsi) ? '' : this.state.mmsi,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-MyshipAdd.boat.mmsi.null' }),
                      },
                      {
                        pattern: /^[1-9]\d*$/,
                        message: formatMessage({ id: 'Myship-MyshipAdd.boat.mmsi.input' }),
                      },
                    ],
                  })(
                    <Input
                      maxLength={9}
                      placeholder={formatMessage({ id: 'Myship-MyshipAdd.boat.mmsi' })}
                      onChange={e => this.setState({ mmsi: Number(e.target.value) })}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>
              {formatMessage({ id: 'Myship-MyshipAdd.certificate' })}
            </span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'Myship-MyshipAdd.certificate.p' })} />
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.start.date' })}
                >
                  {getFieldDecorator(`PMIStartDate`, {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.startTime) ||
                        this.state.startTime === ''
                        ? moment()
                        : this.state.startTime,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-PMI.start.date.null' }),
                      },
                      {
                        validator: this.checkStarttimePick.bind(this),
                      },
                    ],
                  })(
                    <DatePicker
                      format={FORMAT}
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Myship-PMI.start.date.enter' })}
                      onChange={this.handlePmiStartDatePick.bind(this)}
                    />,
                  )}
                </Form.Item></Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout}>
                  {getFieldDecorator(`PMI`, {
                    rules: [
                      {
                        validator: this.checkPmiFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action="/api/sys/file/upload/ship"
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
                          isNil(this.state.pmiFile) ||
                          this.state.pmiFile.length === 0
                          ? ''
                          : this.state.pmiFile
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChangePMI}
                      onRemove={this.onRemovePMI}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.pmiFile) ||
                        this.state.pmiFile.length < 1
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.end.date' })}
                >
                  {getFieldDecorator(`PMIEndDate`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.endTime) || this.state.endTime === ''
                        ? moment(new Date()).add(1, 'months')
                        : this.state.endTime,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-PMI.end.date.null' }),
                      },
                      {
                        validator: this.checkEndtimePick.bind(this),
                      },
                    ],
                  })(
                    <DatePicker
                      format={FORMAT}
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Myship-PMI.end.date.enter' })}
                      onChange={this.handlePmiEndDateDatePick.bind(this)}
                    />,
                  )}
                </Form.Item>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Myship-MyshipAdd.useful' })}>
                  {getFieldDecorator('PMI_term', {
                    initialValue:
                      this.state == null || this.state.pmiDeadline == null
                        ? ''
                        : this.state.pmiDeadline,
                  })(<Input suffix={formatMessage({ id: 'Myship-MyshipAdd.year' })} disabled className="OnlyRead" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} required label={formatMessage({ id: 'Myship-MyshipAdd.certificate.registry' })} /></Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.start.date' })}
                >
                  {getFieldDecorator(`registryStartDate`, {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.registryStartTime) ||
                        this.state.registryStartTime === ''
                        ? moment()
                        : this.state.registryStartTime,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-PMI.start.date.null' }),
                      },
                      {
                        validator: this.checkStarttimePick.bind(this),
                      },
                    ],
                  })(
                    <DatePicker
                      format={FORMAT}
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Myship-PMI.start.date.enter' })}
                      onChange={this.handleRegStartDatePick.bind(this)}
                    />,
                  )}
                </Form.Item></Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="">
                  {getFieldDecorator(`registry`, {
                    rules: [
                      {
                        validator: this.checkRegistryFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action="/api/sys/file/upload/ship"
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
                          isNil(this.state.registryFile) ||
                          this.state.registryFile.length === 0
                          ? ''
                          : this.state.registryFile
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeReg}
                      onRemove={this.onRemoveReg}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.registryFile) ||
                        this.state.registryFile.length < 1
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.end.date' })}
                >
                  {getFieldDecorator(`registryEndDate`, {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.registryEndTime) ||
                        this.state.registryEndTime === ''
                        ? moment(new Date()).add(1, 'months')
                        : this.state.registryEndTime,
                    rules: [
                      {
                        required: true,
                        message: formatMessage({ id: 'Myship-PMI.end.date.null' }),
                      },
                      {
                        validator: this.checkEndtimePick.bind(this),
                      },
                    ],
                  })(
                    <DatePicker
                      format={FORMAT}
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Myship-PMI.end.date.enter' })}
                      onChange={this.handleRegEndDateDatePick.bind(this)}
                    />,
                  )}
                </Form.Item>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Myship-MyshipAdd.useful' })}>
                  {getFieldDecorator('registry_term', {
                    initialValue:
                      this.state == null || this.state.registryDeadline == null
                        ? ''
                        : this.state.registryDeadline,
                  })(<Input suffix={formatMessage({ id: 'Myship-MyshipAdd.year' })} disabled className="OnlyRead" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Myship-MyshipAdd.Charter.party' }) + formatMessage({ id: 'Myship-MyshipAdd.Charter.party.add.remark' })} /></Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.start.date' })}
                >
                  {getFieldDecorator(`leaseStartDate`, {
                    initialValue:
                      isNil(this.state) ||
                        isNil(this.state.leaseStartTime) ||
                        this.state.leaseStartTime === ''
                        ? undefined
                        : this.state.leaseStartTime,
                    rules: [
                      {
                        required: String(localStorage.getItem('ownerType'))==="1"?true:false,
                        message: formatMessage({ id: 'Myship-PMI.start.date.null' }),
                      },
                      {
                        validator: this.checkPartyStarttimePick.bind(this),
                      },
                    ],
                  })(
                    <DatePicker
                      format={FORMAT}
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Myship-PMI.start.date.enter' })}
                      onChange={this.handlePartyStartDatePick.bind(this)}
                    />,
                  )}
                </Form.Item></Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item {...formlayout} label="">
                  {getFieldDecorator(`party`, {
                    rules: [
                      {
                        validator: this.checkPartyFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action="/api/sys/file/upload/ship"
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
                          isNil(this.state.leaseFile) ||
                          this.state.leaseFile.length === 0
                          ? ''
                          : this.state.leaseFile
                      }
                      onPreview={this.handlePreview}
                      onChange={this.handleChangeParty}
                      onRemove={this.onRemoveParty}
                    >
                      {isNil(this.state) ||
                        isNil(this.state.leaseFile) ||
                        this.state.leaseFile.length < 1
                        ? uploadButton
                        : null}
                    </Upload>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...formlayout}
                  label={formatMessage({ id: 'Myship-MyshipView.end.date' })}
                >
                  {getFieldDecorator(`leaseEndDate`, {
                    initialValue:
                      isNil(this.state) || isNil(this.state.leaseEndTime) || this.state.leaseEndTime === ''
                        ? undefined
                        : this.state.leaseEndTime,
                    rules: [
                      {
                        required: String(localStorage.getItem('ownerType'))==="1"?true:false,
                        message: formatMessage({ id: 'Myship-PMI.end.date.null' }),
                      },
                      {
                        validator: this.checkPartyEndtimePick.bind(this),
                      },
                    ],
                  })(
                    <DatePicker
                      format={FORMAT}
                      style={{ width: '100%' }}
                      placeholder={formatMessage({ id: 'Myship-PMI.end.date.enter' })}
                      onChange={this.handlePartyEndDateDatePick.bind(this)}
                    />,
                  )}
                </Form.Item>
                <Form.Item {...formlayout} label={formatMessage({ id: 'Myship-MyshipAdd.useful' })}>
                  {getFieldDecorator('lease_term', {
                    initialValue:
                      isNil(this.state) || isNil(this.state.leaseDeadline)
                        ? ''
                        : this.state.leaseDeadline,
                  })(<Input suffix={formatMessage({ id: 'Myship-MyshipAdd.year' })} disabled className="OnlyRead" />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Divider dashed={true} style={{ marginBottom: 2 }} />
          <div className={commonCss.title}>
            <span className={commonCss.text}>
              {formatMessage({ id: 'Myship-MyshipView.upload.picture' })}
            </span>
          </div>
          <div className={commonCss.AddForm}>
            <Row gutter={24}>
              <Col span={24}>
              <Form.Item {...formlayout}>
                  {getFieldDecorator(`shipFile`, {
                    rules: [
                      {
                        validator: this.checkShipFile.bind(this),
                      },
                    ],
                  })(
                    <Upload
                      action="/api/sys/file/upload/ship"
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
          <div className={commonCss.AddForm}>
            <Row className={commonCss.rowTop}>
              <Col span={12} pull={1} className={commonCss.lastButtonAlignRight}>
                <ButtonOptionComponent
                  type="Save"
                  text={formatMessage({ id: 'Myship-MyshipAdd.save' })}
                  disabled={!isNil(this.state) && (this.state.pmiflag || this.state.regflag || this.state.partyflag || this.state.shipflag)}
                  event={() => this.handleSubmit(1, this.state.flag, 0)}
                />
              </Col>
              <Col span={12}>
                <ButtonOptionComponent
                  type="SaveAndCommit"
                  text={formatMessage({ id: 'Myship-MyshipAdd.submit' })}
                  disabled={!isNil(this.state) && (this.state.pmiflag || this.state.regflag || this.state.partyflag || this.state.shipflag)}
                  event={() => this.newMethod()}
                />
              </Col>
            </Row>
          </div>
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
          <a onClick={() => linkHref(isNil(this.state) || isNil(this.state.previewImage) ? '' : this.state.previewImage)}>查看原图</a>
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
        this.handleSubmit(2, this.state.flag, 1);
      },
    });
  }
}

const MyShipAdd_Form = Form.create({ name: 'MyShipAdd_Form' })(MyShipAdd);

export default MyShipAdd_Form;
