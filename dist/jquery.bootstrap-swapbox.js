/*
 *  Bootstrap Swapbox - v0.0.1
 *  An alternative to the HTML select-box.
 *  https://github.com/joshuairl/jquery-bootstrap-swapbox
 *
 *  Made by Joshua F. Rountree
 *  Under MIT License
 */
(function() {
  (function($) {
    var Swapbox, defaults, pluginName;
    pluginName = "swapbox";
    defaults = {
      wrapCssClass: "",
      triggerCssClass: "",
      itemCssClass: "",
      listCssClass: "",
      itemPrepend: "<span>",
      itemAppend: "</span>",
      triggerPrepend: "<span>",
      triggerAppend: "</span>"
    };
    Swapbox = (function() {
      function Swapbox(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.$el = $(this.element);
        this.init();
        return;
      }

      Swapbox.prototype.init = function() {
        this.retrieveItems();
        this.build();
      };

      Swapbox.prototype.build = function() {
        var self;
        self = this;
        this.buildWrap();
        this.buildList();
        this.buildItems();
        this.buildTrigger();
      };

      Swapbox.prototype.buildWrap = function() {
        var self;
        self = this;
        this.$wrap = $("<div></div>");
        this.$wrap.addClass(this.options.wrapCssClass);
        this.$wrap.addClass("swapbox-wrapper btn-group");
        this.$wrap.insertAfter($(this.element));
      };

      Swapbox.prototype.buildList = function() {
        var self;
        self = this;
        this.$list = $("<ul></ul>");
        this.$list.attr("role", "menu");
        this.$list.addClass(this.options.listCssClass);
        this.$list.addClass("swapbox-list dropdown-menu");
        this.$list.appendTo(this.$wrap);
      };

      Swapbox.prototype.buildItems = function() {
        var $select, self;
        self = this;
        $select = $(this.element);
        $.each(this.original_items, function(i, item) {
          var $item, itemAppend, itemPrepend;
          itemPrepend = "";
          itemAppend = "";
          if ($.type(self.options.itemPrepend) === "function") {
            itemPrepend = self.options.itemPrepend(item);
          } else {
            itemPrepend = self.options.itemPrepend;
          }
          if ($.type(self.options.itemAppend) === "function") {
            itemAppend = self.options.itemAppend(item);
          } else {
            itemAppend = self.options.itemAppend;
          }
          $item = $("<li><a href='#'>" + itemPrepend + item.label + itemAppend + "</a></li>");
          $item.attr("data-value", item.value);
          $item.on("click", function(ev) {
            self.selectOption(item);
            ev.preventDefault();
          });
          return $item.appendTo(self.$list);
        });
      };

      Swapbox.prototype.selectOption = function(item) {
        var $select, e, relatedTarget, self, triggerAppend, triggerPrepend;
        self = this;
        $select = $(this.element);
        triggerPrepend = "";
        triggerAppend = "";
        if ($.type(self.options.triggerPrepend) === "function") {
          triggerPrepend = self.options.triggerPrepend(item);
        } else {
          triggerPrepend = self.options.triggerPrepend;
        }
        if ($.type(self.options.triggerAppend) === "function") {
          triggerAppend = self.options.triggerAppend(item);
        } else {
          triggerAppend = self.options.triggerAppend;
        }
        this.$trigger.html("" + triggerPrepend + (this.$list.find("[data-value='" + item.value + "'] > a").html()) + triggerAppend);
        this.removeItem(item.value);
        $select.val(item.value);
        relatedTarget = {
          relatedTarget: self.$wrap[0]
        };
        if (item.value !== this.selected_item_value) {
          self.$el.trigger(e = $.Event("change.bs.swapbox", relatedTarget));
        }
        this.selected_item_value = item.value;
      };

      Swapbox.prototype.removeItem = function(value) {
        var self;
        self = this;
        this.$list.children().removeClass("hide").end();
        this.$list.find("[data-value='" + value + "']").addClass("hide");
      };

      Swapbox.prototype.buildTrigger = function() {
        var $selected_option, $trigger, option, relatedTarget, self;
        self = this;
        this.$trigger = $trigger = $("<button></button>");
        $trigger.addClass(this.options.triggerCssClass);
        $trigger.addClass("swapbox-toggle btn btn-default dropdown-toggle");
        $trigger.attr("data-toggle", "dropdown");
        $selected_option = $(this.element).children().filter(":selected");
        option = this.splitOption($selected_option);
        this.selectOption(option);
        $trigger.prependTo(this.$wrap);
        $(this.element).hide();
        relatedTarget = {
          relatedTarget: self.$wrap[0]
        };
        this.$wrap.on("show.bs.dropdown", function(e) {
          return self.$el.trigger(e = $.Event("show.bs.swapbox", relatedTarget));
        });
        this.$wrap.on("shown.bs.dropdown", function(e) {
          return self.$el.trigger(e = $.Event("shown.bs.swapbox", relatedTarget));
        });
        this.$wrap.on("hide.bs.dropdown", function(e) {
          return self.$el.trigger(e = $.Event("hide.bs.swapbox", relatedTarget));
        });
        this.$wrap.on("hidden.bs.dropdown", function(e) {
          return self.$el.trigger(e = $.Event("hidden.bs.swapbox", relatedTarget));
        });
      };

      Swapbox.prototype.splitOption = function($option) {
        var item;
        item = {
          label: $option.text() || "",
          value: $option.attr("value") || $option.text() || "",
          $option: $option
        };
        return item;
      };

      Swapbox.prototype.retrieveItems = function() {
        var selected_item_value, self;
        self = this;
        this.original_items = [];
        selected_item_value = this.selected_item_value = "";
        $(this.element).find("option").each(function() {
          var $option, item;
          $option = $(this);
          item = self.splitOption($option);
          if ($option.prop("selected")) {
            selected_item_value = item.value;
          }
          return self.original_items.push(item);
        });
      };

      return Swapbox;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Swapbox(this, options));
        }
      });
    };
  })(jQuery);

}).call(this);
