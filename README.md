# Mobile Console

移动 Web 发展至今，手机浏览器却一直没有一个原生的 devTool 供我们开发者使用。虽然已经出现了很多与桌面联调的优秀方案，但面对突发的线上问题需要快速定位时，手机屏幕前的你是不是也显得手足无措？如果能够仅仅依靠 Web 页面中预设的一个控制台检查问题，那将是我们都希望拥有的美好明天。

<br />

## 在线体验

![qq 20160527154533](https://cloud.githubusercontent.com/assets/2509085/15601494/3f429aba-2422-11e6-8501-8d3779ffc3ce.png)

<br />

## 安装

**一**：将 `mobile-console.js` 在页面顶部引用。

```
<script src="mobile-console.js"></script>
```

由于 Mobile Console 插件没有任何依赖，所以可以安心放在 jQuery、Zepto 等第三方工具之前。

<br />

**二**：初始化

```javascript
mobileConsole.addPanel([...]) //在初始化之前添加自定义面板
mobileConsole.init()
```

<br />

## 使用说明

Mobile Console 是一款简易的网页调试工具，默认包含两个面板。

默认面板：
 - **控制台面板** （面板 id: `console`）将网页中的 console 和网页中的错误信息，打印在面板中；
 - **资源面板** （面板 id: `resource`）将网页中的 cookie （httponly的读不到）、localStorage、sessionStorage 打印在面板中。

Mobile Console 还可以添加自定义面板以满足各种调试需求。
 
<br />

### 添加自定义面板

`mobileConsole.addPanel` 方法接受一个对象数组，每一项对应一个自定义面板数据。比如：

```javascript
//面板数据
var panelData = {
  id: 'myPanel',
  title: '我的面板',
  initFn: function (tabDom, panelDom) {
    panelDom.innerHTML = '面板中的内容'
  }
}

mobileConsole.addPanel([panelData])
```

###### 添加一个自定义面板

<br />

### 面板数据说明

key | 说明
---- | ----
id | 面板唯一标示
title | 面板名称，会显示在 MobileConsole 的标签栏中
initFn | MobileConsole **初始化时**会执行所有面板的 initFn 方法帮助各面板进行一次初始化。方法接受 3 个参数：对应面板的标签 Dom 对象、面板 Dom 对象、面板对象
extend | 用于扩展面板对象的属性与方法。

面板数据最终会被 MobileConsole 转换为面板对象，对象拥有默认的属性与方法，也允许通过 `extend` 数据进行添加。

```javascript
//面板数据
var panelData = {
  id: 'myPanel',
  title: '我的面板',
  initFn: function (tabDom, panelDom) {
    panelDom.innerHTML = '面板中的内容'
  },
  extend: {
    clear: function () {alert(0)},
    extendData: 100
  }
}

mobileConsole.addPanel([panelData])
```

###### 面板对象 myPanel 将会拥有 `clear` 方法与 `extendData` 属性

<br />

### 清除与关闭

Mobile Console 底部有两个按钮，一个是清除，一个是关闭。

清除功能会默认尝试调用当前面板对象的 clear 方法（面板对象默认是没有该方法的，可通过 `extend` 添加），否则仅仅是将当前面板的内容清除。

关闭按钮会将 Mobile Console 关闭。可使用 `mobileConsole.bone.open()` 重新打开。

<br />

### 骨架对象

`mobileConsole.bone` 对象提供三个方法：

方法 | 说明
---- | ----
open | 打开 Mobile Console
close | 关闭 Mobile Console
getActivePanel | 返回当前的面板对象

<br />

## Thanks

<br />
 