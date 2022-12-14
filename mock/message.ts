import { Request, Response } from 'express';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 查询聊天
  'GET /sys/chat/message/station': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        total:2,
        currentPage:1,
        messages: [
          {
            onlineId:111,
            accountId: '船东001',
            serviceId:'001',
          },
          {
            onlineId:112,
            accountId: '船东002',
            serviceId:'002',
          },
          {
            onlineId:113,
            accountId: '船东003',
            serviceId:'003',
          },
          {
            onlineId:114,
            accountId: '船东004',           
            serviceId:'004',
          },
        ],
      },
    });
  },

  'GET /sys/chat/message/station/:onlineId': (req: Request, res: Response) => {
    res.send({
      code: '0',
      message: 'OK',
      status: 200,
      data: {
        total: 1,
        currentPage: 1,
        messages: [
          {
            sendId: 1,
            sendInfo: 'lala',
            sendUserType: 2,
            guid: 1,
            isSend: 1,
            receiveInfo:'001',
            type:1,
            content:'',
            url:'data:image/png;base64,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',
            sendTime:'2019/12/12 15:00',
            receiveId:1,
            receiveUserType:3,
          },
          {
            sendId: 1,
            sendInfo: 'lala',
            sendUserType: 2,
            guid: 1,
            isSend: 1,
            receiveInfo:'001',
            type:1,
            content:'客服',
            url:'data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABsAJADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDjEKDgKPxpWCgfLxUIyKa0uO9bHGWFkIp/mHsTVHzzT0lOetAi5td+imr9lIyRlSe+c55zVGOdWXDkggcU+OYZwM0wOosL1rVN6sCSMZrd0qO7vboLBK5dznHpXFwy5IHArsvDV3JFdLI8myJBl2B7CqM76noGmaLLax4uLhpGYcqT0rWRFjjKBAPoK871Tx8WaODStrBkBaZ1ORkcAe9dH4Z1tbiyitruVjMDtV2yd/4+tS4u1zoi1extTwARl37dqz7i5ZIcQgKfatG7ZlXOflrGuyfLGBzTQNIwNQuZ/mVzn8K5S8mkZmAJya6q6DykhuvSss2G1z5icHpVHOzl41dDkuQOxNPWHLbzIeucE1f1GzWFHlZdo6DPesGRyw5NIFqbRlZVHDA0hv8AZEQowe5NYguiv8ZJFQS3jOMM2QT60XHyksWgL5Ylkc7D0Heqs+jR5bZJ9ARU1ndTRHDElfc1c+2YJIA5qCjmJbNonIIPHenwWzsdwBx9K3J7mJF3uoIz0AqQNC0aFCuHGeO3tTC5itCwrRsbXzB8y5qxHbrLJwgNW5lFhbmaTaFBwAGBJPtTS7kuXRDDFHaoZZkIRey8k1BPrzfZprW3h2CT5dxbnb7is+81N7p8kkRr91c9Pes03HnvvXPyde1O/YuFPudNZXysSZYwzk8t6V0Nrq7CCOMfIAeCD3rgI5GUqynG48D0rZ0/UGifDAHvg1aZTjqem6V4juJ75Le5k3q67Bj+8Cefxrfmi81vk6HpnvXlVvq7QSxzQld6MHGRnkGt+Dx1fG6gM8cLRKMSKq4Lc9R6HFS/IaWmp0V1bmN1JHQ4Nc341u5LXTIoYiUMzEFl7gY4/Wtg69BrNm0qBoWVypRjz7Gse5ht7kFLhTInXk9KRlLTQ5bSWuXLwTEvEE3KHbO05/r/AEp91prucoVx7dBWyILeFcQxbV9M81A7BBgjNIm+pylzFJE+xwRzwexoFozAEBjW/MIpGBeMHHQVC4BGAMD0pWKuZLMCe35Uh3HpVWaZougGfepLa9wyiRcKep9KRVm0SNGzjBFSRxeWBg4AHTtVlZInJwRj1qrdzIMqME4zigWpJ5xHAIBqK8ZpLdMuGAySM9Kz3nBYZPzdTipQXdA2CV96LjSZBJaSyQyEbhJ1244xUK2M1tapKcbG756fWtu3uUACvwQMDNNuWiaFlxn6UGik9jJQSPIqKMsTgKKtTI9pLsfIJ5qOGZLRgyEmQ9T6VJcziZkLtuGOvfNNMrqTQzOy4QE+wFWwl4y58ibAGTiM8CoYtTjgiYRABmHUVM97bESSF7XcFBJ86TJ9R+OcUXEtTasWubG1EksMqqeu9CAfzrUt547pd0Tqw7jPI+tcpFq8Uq+U0toV6fPcyY6daxW1SWyvw0cill43IeCKEyJUmz0G4wjbc8ntVCUnvn8qzdN1SO5BuS7GVmO9M5AGOCP89qS51YMA2TlTyobincz5HexopHL1VC59AuarXFy6pukiKoDtLYwM+n15qhJqH2k5cxLGFzlmZRnjHTmqbzQzWs6ma1VwxYN5smW4BwBjHtk0rlxp6akf2cyzEsTnPFP8gxtzgD3q8sWAWXBOM1mahcs6hBlQOuKi5aI5L4RsUiwzDrzxUSS+ZnepB9uSagS3YjKRmrsMBRBvKg09SnYaI33eY7qgA4LY4pSbcE/vCz9cgDFPkhV8989s4pqQhPuhB+poEVPNHmf6nJGeWJyal847SWXg9cdPpSTW7M4dmYj0FR/Z5WQKu7A6CkVoNU7m6cmpUkRWPmNjPYigWtwCMAVLHp8rcyjJ7AUwbSF/dcJjJJ64q/cBh5uy4uGARTgXUagEEkdRz9Kq/wBn3TgBdiD3OK2V0dUjVZ4QSwUsRYg7cH/65+uKNRKSRnWbXW1HSS7MSYAxcRZBGMf1qPXbe4ltPNkM7lG+XzbiN8Z4PC89hWr/AGfbRTh0jZIyoJP9mZHB4xz3z6+lMeBZpJVEJKnAymmHPP0PFFyr32OOsrme3LGNSQeCKvLPIAGmUD3HStOS1W3Jjlhlg5JUyRlSw9eap3kQMG1Dx69qBcyuSWUk3mSCNpAPLOfLkVD19TVtrid9OfMt5tjDKwNxGRzz0xk9RWfpG4uUdN+EPSDzf07fWtdbdJlyYzlDtCppwOTweeevT8/ei5QQNjkng1UvIzhmjTcaYsxOBmrCyhVx1yKkzMxVmK/MCOewpkr7RxjNdFbqpQKBiqFxZhnboMmgLmP9tZeCePpSHUcNwp+ua0f7LjcdcN7Gj+yIFTkHPqSKZXNEppqKBeck+9POqKBjB9sU8aQX4Cjj+IEYoGkOsgBxtPTnmjULwCDVufmBx7VeW/WSLI5YHgHjNVBpl2pwpQL6sgq1/Z0iou50ZvdCP5EUaktxGtqnksG8ts47NxV1LzMw82/iO8DADE9+nSqxspXADQxMo75I/qa2zb3ShAkTBX2gkzp0ycdvXFO7J90rXNu8SM329CAOAjk9u3FZDieXlLt9w6KWP+NdVcJM+mmFWlk+XdhriPHHPbmuTks5Q4kMix8/dAJAoeoloOitJpG3Ts+cdd+aka0ZItiuCPfrUQimUks0UgHTPFN+ygyF8FT7GpGrvqOtoBHMwZYzlDyzso/SryNDFJEGNoV4Zl+0S88Ywcfgf+A0WjOrOI5JAdh+5Iqn8zViJr5VjElzcnGSNk8fQnj+dBojmReJ3SpRfpjBFZW4UbhTHyI6C21dYugB+pqX+0I5mywA/GuZ47AfkKXI74P1UUB7M6dZowc+aAfrTvNRj8sik+9c0GXuo/75pwfacq2PwoJ9m+50ZL9QVIPYGmESqpKRrn6VireMoxvpW1F413GTj6UC9nI0rqKea0eNiwz6E1IJLtflW5OB03DP86yF19BwZhn8amTXA/HnIfxoDkl2Lsst6QQxjkHuKuxLcK6xKJSMZOLVjgfgfXFZY1MP95Vb8Aa1DfQby++3GFUcTvnrSBR7okWF5AGcyhe7fYnwPxzVaaG9hdvNjZYySFLxld2PrWhBeWRj626qTypvJRn8KZcy2s4VBdW67Ruyblnz7cjrRqPlXRGUAzP86Kce1SMQV4AH41Ncrb28YZbuCUk4xE+T/IVT8+DH3qBFqyVmlkJUEBM8x7x1H5fX/GukhtQhJa3wc7Sf7N7evWuasZ7YyNueLG0/6xmUfpV1rqMQiMXUDO5yJBNJ8nsR0/8A1UDuebGa567iM+1Pju5Cu0qGI79Krktt+8etM3t/eNM6rF03kidVA+tNe9lPQqB3wOaqMxOATn60ZODQFiU3BB3OSWxxzzTzfSKPl35P96qyknvTixHpQFieO/nz8zpkdsVYXUfVMj2NZ4YlaFILEFRSCyNJL2FuTGQe/Gac99CoGwb2PYVnKADgAD6U2RyhGMc98UxWL41FgT8mPxrqLa4mui6771W2KcLNFjqcc46ZrgnmctjNXDbqlwiKzgHvnmiwWR6DbteOohjlvNyIFOZIgMdhz9KdcNdefDva6LPkYMsJz2PT6jrXn/2maJyiyEgHHPNOW+nVh82R6EUhcp199dalZ3D7JZEUYb52QsMjHUfSsQse9ZzajMCAAn5U5r+YyY+UfhQLlL28D1FAc9mP51gzySSOxZ2644qza6nPDlCkUg6AyLkimHKf/9k=',
            sendTime:'2019/12/12 15:02',
            receiveId:1,
            receiveUserType:3,
          },
          {
            sendId: 1,
            sendInfo: '001',
            sendUserType: 2,
            guid: 1,
            isSend: 1,
            receiveInfo:'lala',
            type:1,
            content:'有什么可以帮到你',
            url:'',
            sendTime:'2019/12/12 16:02',
            receiveId:1,
            receiveUserType:3,
          },
          {
            sendId: 1,
            sendInfo: 'lala',
            sendUserType: 2,
            guid: 1,
            isSend: 1,
            receiveInfo:'001',
            type:1,
            content:'大键盘',
            url:'',
            sendTime:'2019/12/12 20:00',
            receiveId:1,
            receiveUserType:3,
          },
        ],
      },
    });
  },
};
