# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery) -> #, window, document
	# window and document are passed through as local variable rather than global
	# as this (slightly) quickens the resolution process and can be more efficiently
	# minified (especially when both are regularly referenced in your plugin).

	# Create the defaults once
	pluginName = "swapbox"
	defaults =
		wrapCssClass: "swapbox-wrapper btn-group"
		triggerCssClass: "swapbox-toggle btn btn-default dropdown-toggle"
		itemCssClass: "swapbox-item"
		listCssClass: "swapbox-list dropdown-menu"
		itemPrepend: "<span>"
		itemAppend: "</span>"

	
	# The actual plugin constructor
	class Swapbox
		constructor: (@element, options) ->
			@options = $.extend {}, defaults, options
			@_defaults = defaults
			@_name = pluginName
			@init()
			return
		init: ->
			@retrieveItems()
			@build()
			return
		build: ->
			@buildWrap()
			@buildList()
			@buildItems()
			@buildTrigger()
			return
		buildWrap: ->
			@$wrap = $("<div></div>")
			@$wrap.addClass(@options.wrapCssClass)
			@$wrap.insertAfter($(@element))
			return

		buildList: ->
			@$list = $("<ul></ul>")
			@$list.attr("role","menu")
			@$list.addClass(@options.listCssClass)
			@$list.appendTo(@$wrap)
			#@$list.hide()
			return
		buildItems: ->
			self = @
			$select = $(@element)
			$.each @original_items,(i,item) ->
				itemPrepend = ""
				itemAppend = ""

				if $.type(self.options.itemPrepend) == "function"
					itemPrepend = self.options.itemPrepend item
				else
					itemPrepend = self.options.itemPrepend

				if $.type(self.options.itemAppend) == "function"
					itemAppend = self.options.itemAppend item
				else
					itemAppend = self.options.itemAppend
				$item = $("<li><a href='#'>#{itemPrepend}#{item.label}#{itemAppend}</a></li>")
				$item.attr("data-value",item.value)
				$item.on "click", (ev) ->
					self.selectOption(item)
					ev.preventDefault()
					return
				$item.appendTo(self.$list)
			return
		selectOption: (item) ->
			$select = $(@element)
			@$trigger.html(@$list.find("[data-value='" + item.value + "'] > a").html())
			@removeItem(item.value)
			$select.val(item.value)
			return
		removeItem: (value) ->
			@$list.children().removeClass("hide").end()
			@$list.find("[data-value='" + value + "']").addClass("hide")
			return
		buildTrigger: ->
			@$trigger = $trigger  = $("<button></button>")
			$trigger.addClass(@options.triggerCssClass)
			$trigger.attr("data-toggle", "dropdown")
			$selected_option = $(@element).children().filter(":selected")
			option = @splitOption($selected_option)
			@selectOption(option)
			$trigger.prependTo(@$wrap)
			$(@element).hide()

			return
		splitOption: ($option) ->
			item =
				label: $option.text() || ""
				value: $option.attr("value") || $option.text() || ""
				$option: $option

			return item
		retrieveItems: ->
			self = @
			@original_items = []
			selected_item_value = @selected_item_value = ""
			$(@element).find("option").each ->
				$option = $(this)
				item = self.splitOption($option)

				if $option.prop("selected")
					selected_item_value = item.value
				self.original_items.push(item)
			return
	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			if !$.data(@, "plugin_#{pluginName}")
				$.data(@, "plugin_#{pluginName}", new Swapbox(@, options))
