class MVVM {
  constructor(el, data) {
    this._data = data;
    this.data = data;
    this.el = document.querySelector(el);
    this.domPool = {};
    this.init();
  }
  init() {
    this.initData();
    this.initDom();
    console.log(11, this.domPool);
  }
  initData() {
    let _this = this;
    // this.data = {};
    // for (let key in this._data) {
    //   Object.defineProperty(this.data, key, {
    //     get() {
    //       return _this._data[key];
    //     },
    //     set(newValue) {
    //       _this.domPool[key].innerHTML = newValue;
    //       _this._data[key] = newValue;
    //     },
    //   });
    // }
    this.data = new Proxy(this.data, {
      get(obj, key) {
        return Reflect.get(obj, key);
      },
      set(obj, key, value) {
        _this.domPool[key].innerHTML = value;
        return Reflect.set(obj, key, value);
      },
    });
  }
  initDom() {
    this.bindDom(this.el);
    this.bindInput(this.el);
  }
  bindDom(el) {
    /////nodeType:1 是文本节点，他的parentNode才是标签元素节点
    const childs = el.childNodes;
    childs.forEach((item) => {
      if (item.nodeType === 3) {
        let _value = item.nodeValue;
        if (_value.trim().length) {
          if (/\{\{(.+)\}\}/.test(_value)) {
            let _key = _value.match(/\{\{(.+)\}\}/)[1];
            this.domPool[_key] = item.parentNode;
            item.parentNode.innerText = this.data[_key] || undefined;
          }
        }
      }
      item.childNodes && this.bindDom(item);
    });
  }
  bindInput(el) {
    const allInput = el.querySelectorAll("input");
    allInput.forEach((item) => {
      let vNode = item.getAttribute("v-model");
      item.addEventListener("keyup", this.handleInput.bind(this, vNode, item)); //这里用bind方法的原因是这里是一个回调函数，不直接调用，所以用bind方法只挂载起来
    });
  }
  handleInput(key, input) {
    this.data[key] = input.value;
  }
}
