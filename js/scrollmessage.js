var ScrollMessage = {
  _defaultConfig: function() {
    return {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      direction: "LEFT",
      duration: 5000,
      gap: 0,
      richtexts: [
        '<span>hello</span>',
        '<span>world</span>'
      ]
    };
  },
  _init: function($outdiv, opts) {
    this.element = $outdiv
    this.$scrollmessage = $('<div>').appendTo(this.element);
    var opts = $.extend(this._defaultConfig(), opts)
    this.options = opts
    this.$scrollmessage.css({width: opts.width, height: opts.height, overflow: 'hidden', 'text-align': 'center'});

    if (opts.direction) {
      this.verticalDir = opts.direction == "UP" || opts.direction == "DOWN";
      this.$scrollmessage.attr("data-direction", opts.direction.toLowerCase());
    }

    if (opts.gap === 0) {
      this.alwaysRenewGap = true;
      opts.gap = this.verticalDir
        ? this.$scrollmessage.height()
        : this.$scrollmessage.width();
    }

    if (opts.richtexts) {
      this.$helper = $('<span>').appendTo(this.$scrollmessage);
      this.$helper.css({display: 'inline-block', height: '100%', 'vertical-align': 'middle'});
      this.$text = $('<p>').appendTo(this.$scrollmessage);
      this.$text.css({display: 'inline-block', 'vertical-align': 'middle', 'text-align': 'left', 'margin': '0'});
      this.$text.html(this.combineRichTexts());
    }

    if (opts.duration) {
      this.$scrollmessage.attr("data-duration", opts.duration);
    }


    this.$scrollmessage.attr("data-duplicated", true);
    this.$scrollmessage.attr("data-gap", opts.gap);

    var self = this;
    this.$scrollmessage.click(function(e) {
      // self.fireEvent(FR.Events.CLICK, e);
    });

    this._init4Style();

    this.$scrollmessage.marquee({});
  },

  /**
         * 初始化滚动消息块样式，包括背景，边框，圆角
         * @private
         */
  _init4Style: function() {
    var msgbox = this.$scrollmessage;
    if (!msgbox) {
      return;
    }
    var border = this.options.border;
    if (border) {
      msgbox.css('border-style', border.type);
      msgbox.css('border-color', border.color);
      msgbox.css('border-width', border.width);
      msgbox.css('border-radius', border.borderRadius);
      this.borderWidth = (this.borderWidth || 0) + parseInt(border.width * 2);
    }

    // 渲染阴影
    // if (!FR.Browser.isIE8Before() && border) {
    //   msgbox.css('box-shadow', border.borderStyle);
    // }

    //初始化背景
    if (!this.options.widgetBackground) {
      return;
    }
    var alpha = this.options.widgetOpacity;
    if (!alpha) {
      // FR.setBackground(msgbox, this.options.widgetBackground, msgbox.height());
      return;
    }
    this.$background = $("<div class='widgetBackground'></div>");
    //IE
    this.$background.css('filter', 'alpha(opacity=' + alpha * 100 + ')');
    //Chrome ff
    this.$background.css('opacity', alpha);

    this.$background.prependTo(this.element);

    // FR.setBackground(this.$background, this.options.widgetBackground, this.element.height());
  },

  getValue: function() {
    return this.options.richtexts.join("<br>---<br>");
  },

  setValue: function(value) {
    value = value.toString();
    this.options.richtexts = value.split(/<br>-{3,}<br>/);
    $('p', this.$scrollmessage).html(this.combineRichTexts());
    this.timeout = this.createTimeout();
  },

  // 把多条消息整合为一条
  combineRichTexts: function() {
    var o = this.options;

    // 更新gap
    if (this.alwaysRenewGap) {
      o.gap = this.verticalDir
        ? this.$scrollmessage.height()
        : this.$scrollmessage.width();
    }
    this.$scrollmessage.attr("data-gap", o.gap);

    if (o.richtexts.length === 1) {
      return o.richtexts[0];
    }
    var divider;
    if (this.verticalDir) {
      divider = '<br><span class="divider" style="display:inline-block;height:' + o.gap + 'px"></span><br>';
    } else {
      divider = '<span class="divider" style="display:inline-block;width:' + o.gap + 'px"></span>';
    }
    return o.richtexts.join(divider);
  },

  doResize: function(give) {
    // FR.ScrollMessage.superclass.doResize.call(this, give);

    //重新计算$scrollmessage的宽度
    this.$scrollmessage.css(
      "width", this.borderWidth
      ? this.element.width() - this.borderWidth
      : this.element.width());
    this.$scrollmessage.css(
      "height", this.borderWidth
      ? this.element.height() - this.borderWidth
      : this.element.height());

    // 更新背景层高度
    if (this.options.widgetOpacity) {
      this.$background.css("height", this.element.height());
      this.$background.css("margin-bottom", -this.element.height());
    }

    if (this.alwaysRenewGap) {
      $('p', this.$scrollmessage).html(this.combineRichTexts());
    }

    clearTimeout(this.timeout); // 取消上次的 timeout
    this.timeout = this.createTimeout();
  },

  createTimeout: function() {
    var self = this;
    return setTimeout(function() {
      self.$scrollmessage.marquee({isInResize: true});
    }, 100);
  }
}

ScrollMessage._init($('#msg'), {})
