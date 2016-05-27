"use strict"
;(function () {
  
  /**
   * Bone 控制台骨架
   * @params {Array|Object} panelArray 面板类实例
   */
  function Bone (panelArray) {
    var panels = [],
      tabItems = [],
      currentPanel = null,
      wrapper = document.createElement('div'),
      tabs = null,
      html = '<div class="mc-tabs">{{tabs}}</div>\
          <div class="mc-panels">{{panels}}</div>\
          <div class="mc-bottom"><ul class="bottom-list"><div class="mc-clear bottom-item">清除</div><div class="mc-close bottom-item">关闭</div></ul></div>'
    
    _addPanel(panelArray)
    
    /**
     * _init 生成HTML，绑定通用事件
     */    
    function _init () {
      var tabsHtml = '<ul class="tabs-list">',
        panelsHtml = '',
        i = 0,
        l = panels.length,
        temp = null
      
      for (; i < l; i++) {
        temp = panels[i]
        tabsHtml += '<li class="tab-item tab-' + temp.id + '"><span>' + temp.title + '</span></li>'
        panelsHtml += '<div class="panel-item panel-' + temp.id + '"></div>'
      }
      tabsHtml += '</ul>'
      
      html = html.replace('{{tabs}}', tabsHtml).replace('{{panels}}', panelsHtml)
      
      wrapper.id = 'mobile-console-wrapper'
      wrapper.innerHTML = html
      document.body.appendChild(wrapper)
      
      tabs = wrapper.querySelectorAll('.tab-item')
      wrapper.querySelector('.mc-clear').addEventListener('click', _clear)
      wrapper.querySelector('.mc-close').addEventListener('click', _close)
      Array.prototype.map.call(tabs, function (o) {
        o.addEventListener('click', function () {
          _exchange(panels[Array.prototype.indexOf.call(wrapper.querySelectorAll('.tab-item'), this)].id)
        })
      })
      
      _handleUI()
      
      panels.map(function (o) {
        o.isReady = true
        o.initFn(wrapper.querySelector('.tab-' + o.id), wrapper.querySelector('.panel-' + o.id), o)
      })
      
      _exchange(panels[0].id)
    }
    
    /**
     * _exchange 切换面板方法
     * @params {String|Number} id 面板类实例的 id
     */
    function _exchange (id) {
      var i = 0,
        l = panels.length
      for (; i < l; i++) {
        if (panels[i].id === id) {
          currentPanel = panels[i]
          break
        }
      }
      
      //切换标签页和面板
      Array.prototype.map.call(wrapper.querySelectorAll('.tab-item'), function (o) {
        o.className = o.className.replace(/(\s*|^)current(\s*|$)/g, ' ')
      })
      wrapper.querySelector('.tab-' + currentPanel.id).className += ' current'
      
      Array.prototype.map.call(wrapper.querySelectorAll('.panel-item'), function (o) {
        o.className = o.className.replace(/(\s*|^)current(\s*|$)/g, ' ')
      })
      wrapper.querySelector('.panel-' + currentPanel.id).className += ' current'
    }
    
    /*清空当前面板*/
    function _clear () {
      if (currentPanel && currentPanel.clear) {
        currentPanel.clear(wrapper.querySelector('.panel-item.current'))
      } else {
        wrapper.querySelector('.panel-item.current').innerHTML = ''
      }
      //currentPanel.isReady = false
    }
    
    /*关闭面板*/
    function _close () {
      wrapper.className += ' close'
    }
    
    /*开启面板*/
    function _open () {
      wrapper.className = wrapper.className.replace(/(\s*|^)close(\s*|$)/g, ' ')
    }
    
    /**
     * _addPanel 一次性添加面板方法
     * @params {Array|Object} panelArray 面板类实例
     */
    function _addPanel (panelArray) {
      if (panelArray.length) {
        panels = panels.concat(panelArray)
      } else {
        panels.push(panelArray)
      }
      
      _init()
    }
    
    /*面板中 tab\bottomItem 太多时应该有滚动功能*/
    function _handleUI () {
      var width = 0
      setTimeout(function () {
        Array.prototype.map.call(wrapper.querySelectorAll('.tab-item'), function (o) {
          width += (o.clientWidth + 1)
        })
        wrapper.querySelector('.tabs-list').style.width = width + 'px'
      }, 0)
    }
    
    this.open = _open,
    this.close = _close
    this.getActivePanel = function () {
      return currentPanel || panels[0]
    }
  }
  
  /**
   * Panel 面板类
   * @params {String|Number} id 面板唯一标识
   * @params {String|Number} title 面板标题，会显示在标签中
   * @params {Function} initFn 面板初始化方法
   * @params {Object} extend 实例的扩展，可扩展面板实例的属性与方法
   */
  function Panel (id, title, initFn, extend) {
    this.id = id,
    this.title = title,
    this.initFn = initFn
    
    if (extend) {
      var item = ''
      for (item in extend) {
        this[item] = extend[item]
      }
    }
  }
  
  /**
   * 自定义初始化 mobileConsole 
   * @params {Array} panels 控制台中的各面板
   */
  function _customizeInit (panels) {
    var panelArray = [],
      bone = null
    panels = panels || []
    panels.map(function (o) {
      panelArray.push(new Panel(o.id, o.title, o.initFn, o.extend))
    })
    bone = new Bone(panelArray)
    mobileConsole.bone = bone
    delete mobileConsole.customizeInit
    delete mobileConsole.init
  }
  
  var customizePanels = []
  
  /**
   * 为 mobileConsole 添加自定义面板
   * @params {Array} panelArray 面板数据，每项包括：
      id: 面板唯一标示
      title: 面板名称
      initFn: 面板初始化方法
      extend: 面板扩展方法，可选
   */
  function _addPanel (panelArray) {
    customizePanels = Object.prototype.toString.call(panelArray) === '[object Array]' ? panelArray : []
  }
  
  /**
   * 初始化 mobileConsole，带有默认面板
   */
  function _init () {
    var panelArray = [],
      bone = null,
      panels = null,
      defaultPanels = _createDefaultPanels()
    panels = defaultPanels.concat(customizePanels)
    panels.map(function (o) {
      panelArray.push(new Panel(o.id, o.title, o.initFn, o.extend))
    })
    bone = new Bone(panelArray)
    mobileConsole.bone = bone
    delete mobileConsole.init
  }

  var mobileConsole = {
    init: _init,
    addPanel: _addPanel
  }

  ////////////////内置面板/////////////////////
  /**
   * 创建默认面板集合
   */
  function _createDefaultPanels () {
    var panels = []
    
    panels.push(_initConsolePanel())
    panels.push(_initResourcePanel())
    
    return panels
  }
  
  /**
   * 控制台面板，功能包括：
        网页中的 console 输出捕获；
        网页中的 JS error 捕获；
   */
  function _initConsolePanel () {
    function _initConsole (panel) {
      window.console = {
        console: window.console
      }
      ;['log', 'error', 'warn', 'debug', 'info'].forEach(function (item) {
        window.console[item] = function () {
          var html = panel.innerHTML + _log(arguments, item)
          panel.innerHTML = html
          window.console.console[item].apply(window.console.console, Array.prototype.slice.call(arguments))
        }
      })
    }
    
    function _log (msgs, type) {
      var html = '<div class="' + type +' console-log">',
        i = 0,
        l = msgs.length,
        arr = [],
        temp = ''
      for (i; i < l; i++) {
        temp = msgs[i]
        html += '<span class="' + typeof temp + '">' + temp + '</span>'
      }
      html += '</div>'
      return html
    }
    
    function _initError () {
      window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
        console.error('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
              + ' Column: ' + column + ' StackTrace: ' + errorObj);
      }
    }
    
    return {
      id: 'console',
      title: '控制台',
      initFn: function (tab, panel) {
        _initConsole(panel)
        _initError()
      }
    }
  }
  
  /**
   * 资源面板，功能包括：
        显示 cookie、localStorage、sessionStorage
   */
  function _initResourcePanel () {
    var currentResource = null,
      cookieNames = []
    
    //搭建 DOM，需要标签切换
    function _init (panel) {
      var html = '<div class="resource-boxes">\
          <div class="resource-tabs">\
            <div class="resource-tab tab-cookie">Cookie</div>\
            <div class="resource-tab tab-localstorage">Local Storage</div>\
            <div class="resource-tab tab-sessionstorage">Session Storage</div>\
          </div>\
          <div class="resource-panels">\
            <div class="cookie-panel resource-panel">{{cookie}}</div>\
            <div class="localstorage-panel resource-panel">{{localStorage}}</div>\
            <div class="sessionstorage-panel resource-panel">{{sessionStorage}}</div>\
          </div>\
        </div>',
        cookieHtml = '',
        localStorageHtml = '',
        sessionStorageHtml = '',
        key = ''
      
      document.cookie.split(/\s*;\s*/).forEach(function(group) {
        if (group !== '') {
          group = group.split(/\s*=\s*/)
          cookieNames.push(group[0])
          cookieHtml += '<li class="item"><span class="key">' + group[0] + '</span><span class="value">' + (group[1] || '') + '</span></li>'
        }
      })
      
      for (key in window.localStorage){
        localStorageHtml += '<li class="item"><span class="key">' + key + '</span><span class="value">' + window.localStorage[key] + '</span></li>'
      }
    
      for (key in window.sessionStorage){
        sessionStorageHtml += '<li class="item"><span class="key">' + key + '</span><span class="value">' + window.sessionStorage[key] + '</span></li>'
      }
      
      panel.innerHTML = html.replace('{{cookie}}', '<ul class="list">' + cookieHtml + '</ul>').replace('{{localStorage}}', '<ul class="list">' + localStorageHtml + '</ul>').replace('{{sessionStorage}}', '<ul class="list">' + sessionStorageHtml + '</ul>')
      
      _exchange('cookie')
      
      panel.querySelector('.tab-cookie').addEventListener('click', function () {
        _exchange('cookie')
      })
      panel.querySelector('.tab-localstorage').addEventListener('click', function () {
        _exchange('localStorage')
      })
      panel.querySelector('.tab-sessionstorage').addEventListener('click', function () {
        _exchange('sessionStorage')
      })
      
      function _exchange (id) {
        Array.prototype.map.call(panel.querySelectorAll('.resource-tab'), function (o) {
          o.className = o.className.replace(/(\s*|^)current(\s*|$)/g, ' ')
        })
        panel.querySelector('.tab-' + id).className += ' current'
        
        Array.prototype.map.call(panel.querySelectorAll('.resource-panel'), function (o) {
          o.className = o.className.replace(/(\s*|^)current(\s*|$)/g, ' ')
        })
        panel.querySelector('.' + id + '-panel').className += ' current'
        
        currentResource = id
      }
    }
    
    function _clear (panel) {      
      if (window.confirm('确定清除全部 ' + currentResource + ' 吗？')) {
        _clearResource[currentResource](panel)
      }
    }
    
    var _clearResource = {
      'cookie': function (panel) {
        cookieNames.map(function (name) {
          document.cookie = name + '=; expires=-1'
        })
        
        cookieNames = []
        panel.querySelector('.cookie-panel').innerHTML = ''
      },
      'localStorage': function (panel) {
        window.localStorage.clear()
        panel.querySelector('.localstorage-panel').innerHTML = ''
      },
      'sessionStorage': function (panel) {
        window.sessionStorage.clear()
        panel.querySelector('.sessionstorage-panel').innerHTML = ''
      }
    }
    
    return {
      id: 'resource',
      title: '资源',
      initFn: function (tab, panel) {
        _init(panel)
      },
      extend: {
        clear: _clear
      }
    }
  }
  
  if(typeof define === 'function' && define.amd) {
		define([], function () {
			return mobileConsole
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = mobileConsole
	} else {
		window.mobileConsole = mobileConsole
	}
}())