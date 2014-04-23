(function() {
  (function($) {
    var Swapbox, defaults, pluginName;
    pluginName = "swapbox";
    defaults = {
      wrapCssClass: "swapbox-wrapper btn-group",
      triggerCssClass: "swapbox-toggle btn btn-default dropdown-toggle",
      itemCssClass: "swapbox-item",
      listCssClass: "swapbox-list dropdown-menu",
      itemPrepend: "<span>",
      itemAppend: "</span>"
    };
    Swapbox = (function() {
      function Swapbox(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Swapbox.prototype.init = function() {
        this.retrieveItems();
        return this.build();
      };

      Swapbox.prototype.build = function() {
        this.buildWrap();
        this.buildList();
        this.buildItems();
        return this.buildTrigger();
      };

      Swapbox.prototype.buildWrap = function() {
        this.$wrap = $("<div></div>");
        this.$wrap.addClass(this.options.wrapCssClass);
        this.$wrap.insertAfter($(this.element));
      };

      Swapbox.prototype.buildList = function() {
        this.$list = $("<ul></ul>");
        this.$list.attr("role", "menu");
        this.$list.addClass(this.options.listCssClass);
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
        var $select;
        $select = $(this.element);
        this.$trigger.html(this.$list.find("[data-value='" + item.value + "'] > a").html());
        this.removeItem(item.value);
        $select.val(item.value);
      };

      Swapbox.prototype.removeItem = function(value) {
        this.$list.children().removeClass("hide").end();
        this.$list.find("[data-value='" + value + "']").addClass("hide");
      };

      Swapbox.prototype.buildTrigger = function() {
        var $selected_option, $trigger, option;
        this.$trigger = $trigger = $("<button></button>");
        $trigger.addClass(this.options.triggerCssClass);
        $trigger.attr("data-toggle", "dropdown");
        $selected_option = $(this.element).children().filter(":selected");
        option = this.splitOption($selected_option);
        this.selectOption(option);
        $trigger.prependTo(this.$wrap);
        $(this.element).hide();
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
