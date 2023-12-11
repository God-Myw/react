import React, { ReactNode } from 'react';
import '@wangeditor/editor/dist/css/style.css';
import './spartDetail.less';
import { Carousel } from 'antd';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import { Editor } from '../components/WangEditor';
import axios from 'axios';

class Authorized extends React.Component<{ to: string; children: ReactNode }, {}> {
  state = {
    editor: null,
    picList: [],
    money: '',
    tradeName: '',
    placeOf: '',
    storeName: '',
    storeLogo: '',
    brand: '',
    views: 0,
    type: '1',
    model: '',
    partExplain: [],
    details: '',
  };

  //初期化事件
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    let guid = new URLSearchParams(window.location.href.split('?')[1]).get('guid');
    axios(`https://www.dylnet.cn/api/business/spart/getSpartById?guid=${guid}`).then(res => {
      if (res.data.code == '0000') {
        let data = res.data.data;
        let picList = [];
        if (data.picList) {
          picList = data.picList.map((v: any) => {
            return v.source == 1
              ? 'http://58.33.34.10:10443/images/spart/' + v.fileName
              : 'http://39.105.35.83:10443/images/spart/' + v.fileName;
          });
        }
        let partExplain = data.partExplain
          .split('/')
          .filter(Boolean)
          .map((v: any) => {
            return v;
          });
        this.setState({
          picList: picList || [],
          money: data.money || '',
          views: data.views || 0,
          type: data.type || '',
          storeLogo: `http://58.33.34.10:10443/images/spart/${data.storeLogo ||
            '1682241015756.png'}`,
          tradeName: data.tradeName || '',
          storeName: data.storeName || '',
          brand: data.brand || '',
          placeOf: data.placeOf || '',
          model:
            data.models
              .split('，')
              .filter((item: any) => item != 'null')
              .toString() || '',
          partExplain: partExplain || '',
        });

        this.state.editor.setHtml(data.details);
      }
    });
  };

  render() {
    const editorConfig: Partial<IEditorConfig> = {
      placeholder: '请输入内容...',
      readOnly: true,
      onCreated: (editor: IDomEditor) => {
        this.setState({ editor });
      },
      onChange: (editor: IDomEditor) => {
        this.setState({ details: editor.getHtml() });
      },
    };
    return (
      <div style={{ background: '#ffffff' }}>
        <Carousel autoplay>
          {this.state.picList.map(item => {
            return (
              <div key={item}>
                <img style={{ width: '100vw', aspectRatio: '1/1' }} src={item} alt="" />
              </div>
            );
          })}
        </Carousel>
        <div className="info">
          <div className="name box">
            <p>
              ￥{this.state.money}
              <span>{this.state.views} 浏览</span>
            </p>
            <p>{this.state.tradeName}</p>
          </div>
          <div className="placeOfOrigin box">
            <div className="divl">
              <p>产地:</p>
              <p>品牌:</p>
              <p>型号:</p>
            </div>
            <div>
              <p>中国</p>
              <p>{this.state.brand}</p>
              <p>{this.state.model}</p>
            </div>
          </div>
          <div className="explain box">
            <div className="divl">
              <p>说明:</p>
            </div>
            <div className="divR">
              {this.state.partExplain.map((item: any) => {
                return (
                  <p key={item}>
                    <img src="http://58.33.34.10:10443/images/spart/1670551173075.png" alt="" />
                    <span> {item} </span>
                  </p>
                );
              })}
            </div>
          </div>
          <div className="verify box">
            <div className="limg">
              <img src={this.state.storeLogo} alt="" />
            </div>
            <div className="rinfo">
              <div>
                <span>{this.state.storeName}</span>
                {this.state.type == '1' ? (
                  <img src="http://58.33.34.10:10443/images/spart/1670924635524.png" alt="" />
                ) : (
                  <img src="http://58.33.34.10:10443/images/spart/1670924637144.png" alt="" />
                )}
              </div>
              <div>
                <span>
                  信用评级
                  {[1, 2, 3, 4, 5].map(item => {
                    return (
                      <img
                        src="http://58.33.34.10:10443/images/spart/1670924109041.png"
                        key={item}
                      />
                    );
                  })}
                </span>
                <span className="score">5.0</span>
              </div>
            </div>
          </div>
          <div className="commodityDetails box">
            <p>商品详情</p>
            <div data-testid="editor-container" style={{ marginTop: '10px' }}>
              <Editor defaultConfig={editorConfig} mode="default" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Authorized;
