/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);


/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null


    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
      console.log(this.$element)
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

 

+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
/*! jQuery Mobile v1.4.5 | Copyright 2010, 2014 jQuery Foundation, Inc. | jquery.org/license */

(function(e,t,n){typeof define=="function"&&define.amd?define(["jquery"],function(r){return n(r,e,t),r.mobile}):n(e.jQuery,e,t)})(this,document,function(e,t,n,r){(function(e,t,r){"$:nomunge";function l(e){return e=e||location.href,"#"+e.replace(/^[^#]*#?(.*)$/,"$1")}var i="hashchange",s=n,o,u=e.event.special,a=s.documentMode,f="on"+i in t&&(a===r||a>7);e.fn[i]=function(e){return e?this.bind(i,e):this.trigger(i)},e.fn[i].delay=50,u[i]=e.extend(u[i],{setup:function(){if(f)return!1;e(o.start)},teardown:function(){if(f)return!1;e(o.stop)}}),o=function(){function p(){var n=l(),r=h(u);n!==u?(c(u=n,r),e(t).trigger(i)):r!==u&&(location.href=location.href.replace(/#.*/,"")+r),o=setTimeout(p,e.fn[i].delay)}var n={},o,u=l(),a=function(e){return e},c=a,h=a;return n.start=function(){o||p()},n.stop=function(){o&&clearTimeout(o),o=r},t.attachEvent&&!t.addEventListener&&!f&&function(){var t,r;n.start=function(){t||(r=e.fn[i].src,r=r&&r+l(),t=e('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||c(l()),p()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow,s.onpropertychange=function(){try{event.propertyName==="title"&&(t.document.title=s.title)}catch(e){}})},n.stop=a,h=function(){return l(t.location.href)},c=function(n,r){var o=t.document,u=e.fn[i].domain;n!==r&&(o.title=s.title,o.open(),u&&o.write('<script>document.domain="'+u+'"</script>'),o.close(),t.location.hash=n)}}(),n}()})(e,this),function(e){e.mobile={}}(e),function(e,t,n){e.extend(e.mobile,{version:"1.4.5",subPageUrlKey:"ui-page",hideUrlBar:!0,keepNative:":jqmData(role='none'), :jqmData(role='nojs')",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:!0,hashListeningEnabled:!0,linkBindingEnabled:!0,defaultPageTransition:"fade",maxTransitionWidth:!1,minScrollBack:0,defaultDialogTransition:"pop",pageLoadErrorMessage:"Error Loading Page",pageLoadErrorMessageTheme:"a",phonegapNavigationEnabled:!1,autoInitializePage:!0,pushStateEnabled:!0,ignoreContentEnabled:!1,buttonMarkup:{hoverDelay:200},dynamicBaseEnabled:!0,pageContainer:e(),allowCrossDomainPages:!1,dialogHashKey:"&ui-state=dialog"})}(e,this),function(e,t,n){var r={},i=e.find,s=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,o=/:jqmData\(([^)]*)\)/g;e.extend(e.mobile,{ns:"",getAttribute:function(t,n){var r;t=t.jquery?t[0]:t,t&&t.getAttribute&&(r=t.getAttribute("data-"+e.mobile.ns+n));try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:s.test(r)?JSON.parse(r):r}catch(i){}return r},nsNormalizeDict:r,nsNormalize:function(t){return r[t]||(r[t]=e.camelCase(e.mobile.ns+t))},closestPageData:function(e){return e.closest(":jqmData(role='page'), :jqmData(role='dialog')").data("mobile-page")}}),e.fn.jqmData=function(t,r){var i;return typeof t!="undefined"&&(t&&(t=e.mobile.nsNormalize(t)),arguments.length<2||r===n?i=this.data(t):i=this.data(t,r)),i},e.jqmData=function(t,n,r){var i;return typeof n!="undefined"&&(i=e.data(t,n?e.mobile.nsNormalize(n):n,r)),i},e.fn.jqmRemoveData=function(t){return this.removeData(e.mobile.nsNormalize(t))},e.jqmRemoveData=function(t,n){return e.removeData(t,e.mobile.nsNormalize(n))},e.find=function(t,n,r,s){return t.indexOf(":jqmData")>-1&&(t=t.replace(o,"[data-"+(e.mobile.ns||"")+"$1]")),i.call(this,t,n,r,s)},e.extend(e.find,i)}(e,this),function(e,t){function s(t,n){var r,i,s,u=t.nodeName.toLowerCase();return"area"===u?(r=t.parentNode,i=r.name,!t.href||!i||r.nodeName.toLowerCase()!=="map"?!1:(s=e("img[usemap=#"+i+"]")[0],!!s&&o(s))):(/input|select|textarea|button|object/.test(u)?!t.disabled:"a"===u?t.href||n:n)&&o(t)}function o(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return e.css(this,"visibility")==="hidden"}).length}var r=0,i=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"c0ab71056b936627e8a7821f03c044aec6280a40",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(n,r){return typeof n=="number"?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),r&&r.call(t)},n)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?t=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):t=this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(this[0].ownerDocument||n):t},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++r)})},removeUniqueId:function(){return this.each(function(){i.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(n){return!!e.data(n,t)}}):function(t,n,r){return!!e.data(t,r[3])},focusable:function(t){return s(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var n=e.attr(t,"tabindex"),r=isNaN(n);return(r||n>=0)&&s(t,!r)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(n,r){function u(t,n,r,s){return e.each(i,function(){n-=parseFloat(e.css(t,"padding"+this))||0,r&&(n-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(n-=parseFloat(e.css(t,"margin"+this))||0)}),n}var i=r==="Width"?["Left","Right"]:["Top","Bottom"],s=r.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+r]=function(n){return n===t?o["inner"+r].call(this):this.each(function(){e(this).css(s,u(this,n)+"px")})},e.fn["outer"+r]=function(t,n){return typeof t!="number"?o["outer"+r].call(this,t):this.each(function(){e(this).css(s,u(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(n){return arguments.length?t.call(this,e.camelCase(n)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in n.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(r){if(r!==t)return this.css("zIndex",r);if(this.length){var i=e(this[0]),s,o;while(i.length&&i[0]!==n){s=i.css("position");if(s==="absolute"||s==="relative"||s==="fixed"){o=parseInt(i.css("zIndex"),10);if(!isNaN(o)&&o!==0)return o}i=i.parent()}}return 0}}),e.ui.plugin={add:function(t,n,r){var i,s=e.ui[t].prototype;for(i in r)s.plugins[i]=s.plugins[i]||[],s.plugins[i].push([n,r[i]])},call:function(e,t,n,r){var i,s=e.plugins[t];if(!s)return;if(!r&&(!e.element[0].parentNode||e.element[0].parentNode.nodeType===11))return;for(i=0;i<s.length;i++)e.options[s[i][0]]&&s[i][1].apply(e.element,n)}}}(e),function(e,t,r){var i=function(t,n){var r=t.parent(),i=[],s=function(){var t=e(this),n=e.mobile.toolbar&&t.data("mobile-toolbar")?t.toolbar("option"):{position:t.attr("data-"+e.mobile.ns+"position"),updatePagePadding:t.attr("data-"+e.mobile.ns+"update-page-padding")!==!1};return n.position!=="fixed"||n.updatePagePadding!==!0},o=r.children(":jqmData(role='header')").filter(s),u=t.children(":jqmData(role='header')"),a=r.children(":jqmData(role='footer')").filter(s),f=t.children(":jqmData(role='footer')");return u.length===0&&o.length>0&&(i=i.concat(o.toArray())),f.length===0&&a.length>0&&(i=i.concat(a.toArray())),e.each(i,function(t,r){n-=e(r).outerHeight()}),Math.max(0,n)};e.extend(e.mobile,{window:e(t),document:e(n),keyCode:e.ui.keyCode,behaviors:{},silentScroll:function(n){e.type(n)!=="number"&&(n=e.mobile.defaultHomeScroll),e.event.special.scrollstart.enabled=!1,setTimeout(function(){t.scrollTo(0,n),e.mobile.document.trigger("silentscroll",{x:0,y:n})},20),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},getClosestBaseUrl:function(t){var n=e(t).closest(".ui-page").jqmData("url"),r=e.mobile.path.documentBase.hrefNoHash;if(!e.mobile.dynamicBaseEnabled||!n||!e.mobile.path.isPath(n))n=r;return e.mobile.path.makeUrlAbsolute(n,r)},removeActiveLinkClass:function(t){!!e.mobile.activeClickedLink&&(!e.mobile.activeClickedLink.closest("."+e.mobile.activePageClass).length||t)&&e.mobile.activeClickedLink.removeClass(e.mobile.activeBtnClass),e.mobile.activeClickedLink=null},getInheritedTheme:function(e,t){var n=e[0],r="",i=/ui-(bar|body|overlay)-([a-z])\b/,s,o;while(n){s=n.className||"";if(s&&(o=i.exec(s))&&(r=o[2]))break;n=n.parentNode}return r||t||"a"},enhanceable:function(e){return this.haveParents(e,"enhance")},hijackable:function(e){return this.haveParents(e,"ajax")},haveParents:function(t,n){if(!e.mobile.ignoreContentEnabled)return t;var r=t.length,i=e(),s,o,u,a,f;for(a=0;a<r;a++){o=t.eq(a),u=!1,s=t[a];while(s){f=s.getAttribute?s.getAttribute("data-"+e.mobile.ns+n):"";if(f==="false"){u=!0;break}s=s.parentNode}u||(i=i.add(o))}return i},getScreenHeight:function(){return t.innerHeight||e.mobile.window.height()},resetActivePageHeight:function(t){var n=e("."+e.mobile.activePageClass),r=n.height(),s=n.outerHeight(!0);t=i(n,typeof t=="number"?t:e.mobile.getScreenHeight()),n.css("min-height",""),n.height()<t&&n.css("min-height",t-(s-r))},loading:function(){var t=this.loading._widget||e(e.mobile.loader.prototype.defaultHtml).loader(),n=t.loader.apply(t,arguments);return this.loading._widget=t,n}}),e.addDependents=function(t,n){var r=e(t),i=r.jqmData("dependents")||e();r.jqmData("dependents",e(i).add(n))},e.fn.extend({removeWithDependents:function(){e.removeWithDependents(this)},enhanceWithin:function(){var t,n={},r=e.mobile.page.prototype.keepNativeSelector(),i=this;e.mobile.nojs&&e.mobile.nojs(this),e.mobile.links&&e.mobile.links(this),e.mobile.degradeInputsWithin&&e.mobile.degradeInputsWithin(this),e.fn.buttonMarkup&&this.find(e.fn.buttonMarkup.initSelector).not(r).jqmEnhanceable().buttonMarkup(),e.fn.fieldcontain&&this.find(":jqmData(role='fieldcontain')").not(r).jqmEnhanceable().fieldcontain(),e.each(e.mobile.widgets,function(t,s){if(s.initSelector){var o=e.mobile.enhanceable(i.find(s.initSelector));o.length>0&&(o=o.not(r)),o.length>0&&(n[s.prototype.widgetName]=o)}});for(t in n)n[t][t]();return this},addDependents:function(t){e.addDependents(this,t)},getEncodedText:function(){return e("<a>").text(this.text()).html()},jqmEnhanceable:function(){return e.mobile.enhanceable(this)},jqmHijackable:function(){return e.mobile.hijackable(this)}}),e.removeWithDependents=function(t){var n=e(t);(n.jqmData("dependents")||e()).remove(),n.remove()},e.addDependents=function(t,n){var r=e(t),i=r.jqmData("dependents")||e();r.jqmData("dependents",e(i).add(n))},e.find.matches=function(t,n){return e.find(t,null,null,n)},e.find.matchesSelector=function(t,n){return e.find(n,null,null,[t]).length>0}}(e,this),function(e,r){t.matchMedia=t.matchMedia||function(e,t){var n,r=e.documentElement,i=r.firstElementChild||r.firstChild,s=e.createElement("body"),o=e.createElement("div");return o.id="mq-test-1",o.style.cssText="position:absolute;top:-100em",s.style.background="none",s.appendChild(o),function(e){return o.innerHTML='&shy;<style media="'+e+'"> #mq-test-1 { width: 42px; }</style>',r.insertBefore(s,i),n=o.offsetWidth===42,r.removeChild(s),{matches:n,media:e}}}(n),e.mobile.media=function(e){return t.matchMedia(e).matches}}(e),function(e,t){var r={touch:"ontouchend"in n};e.mobile.support=e.mobile.support||{},e.extend(e.support,r),e.extend(e.mobile.support,r)}(e),function(e,n){e.extend(e.support,{orientation:"orientation"in t&&"onorientationchange"in t})}(e),function(e,r){function i(e){var t=e.charAt(0).toUpperCase()+e.substr(1),n=(e+" "+u.join(t+" ")+t).split(" "),i;for(i in n)if(o[n[i]]!==r)return!0}function h(){var n=t,r=!!n.document.createElementNS&&!!n.document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect&&(!n.opera||navigator.userAgent.indexOf("Chrome")!==-1),i=function(t){(!t||!r)&&e("html").addClass("ui-nosvg")},s=new n.Image;s.onerror=function(){i(!1)},s.onload=function(){i(s.width===1&&s.height===1)},s.src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="}function p(){var i="transform-3d",o=e.mobile.media("(-"+u.join("-"+i+"),(-")+"-"+i+"),("+i+")"),a,f,l;if(o)return!!o;a=n.createElement("div"),f={MozTransform:"-moz-transform",transform:"transform"},s.append(a);for(l in f)a.style[l]!==r&&(a.style[l]="translate3d( 100px, 1px, 1px )",o=t.getComputedStyle(a).getPropertyValue(f[l]));return!!o&&o!=="none"}function d(){var t=location.protocol+"//"+location.host+location.pathname+"ui-dir/",n=e("head base"),r=null,i="",o,u;return n.length?i=n.attr("href"):n=r=e("<base>",{href:t}).appendTo("head"),o=e("<a href='testurl' />").prependTo(s),u=o[0].href,n[0].href=i||location.pathname,r&&r.remove(),u.indexOf(t)===0}function v(){var e=n.createElement("x"),r=n.documentElement,i=t.getComputedStyle,s;return"pointerEvents"in e.style?(e.style.pointerEvents="auto",e.style.pointerEvents="x",r.appendChild(e),s=i&&i(e,"").pointerEvents==="auto",r.removeChild(e),!!s):!1}function m(){var e=n.createElement("div");return typeof e.getBoundingClientRect!="undefined"}function g(){var e=t,n=navigator.userAgent,r=navigator.platform,i=n.match(/AppleWebKit\/([0-9]+)/),s=!!i&&i[1],o=n.match(/Fennec\/([0-9]+)/),u=!!o&&o[1],a=n.match(/Opera Mobi\/([0-9]+)/),f=!!a&&a[1];return(r.indexOf("iPhone")>-1||r.indexOf("iPad")>-1||r.indexOf("iPod")>-1)&&s&&s<534||e.operamini&&{}.toString.call(e.operamini)==="[object OperaMini]"||a&&f<7458||n.indexOf("Android")>-1&&s&&s<533||u&&u<6||"palmGetResource"in t&&s&&s<534||n.indexOf("MeeGo")>-1&&n.indexOf("NokiaBrowser/8.5.0")>-1?!1:!0}var s=e("<body>").prependTo("html"),o=s[0].style,u=["Webkit","Moz","O"],a="palmGetResource"in t,f=t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]",l=t.blackberry&&!i("-webkit-transform"),c;e.extend(e.mobile,{browser:{}}),e.mobile.browser.oldIE=function(){var e=3,t=n.createElement("div"),r=t.all||[];do t.innerHTML="<!--[if gt IE "+ ++e+"]><br><![endif]-->";while(r[0]);return e>4?e:!e}(),e.extend(e.support,{pushState:"pushState"in history&&"replaceState"in history&&!(t.navigator.userAgent.indexOf("Firefox")>=0&&t.top!==t)&&t.navigator.userAgent.search(/CriOS/)===-1,mediaquery:e.mobile.media("only all"),cssPseudoElement:!!i("content"),touchOverflow:!!i("overflowScrolling"),cssTransform3d:p(),boxShadow:!!i("boxShadow")&&!l,fixedPosition:g(),scrollTop:("pageXOffset"in t||"scrollTop"in n.documentElement||"scrollTop"in s[0])&&!a&&!f,dynamicBaseTag:d(),cssPointerEvents:v(),boundingRect:m(),inlineSVG:h}),s.remove(),c=function(){var e=t.navigator.userAgent;return e.indexOf("Nokia")>-1&&(e.indexOf("Symbian/3")>-1||e.indexOf("Series60/5")>-1)&&e.indexOf("AppleWebKit")>-1&&e.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}(),e.mobile.gradeA=function(){return(e.support.mediaquery&&e.support.cssPseudoElement||e.mobile.browser.oldIE&&e.mobile.browser.oldIE>=8)&&(e.support.boundingRect||e.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/)!==null)},e.mobile.ajaxBlacklist=t.blackberry&&!t.WebKitPoint||f||c,c&&e(function(){e("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")}),e.support.boxShadow||e("html").addClass("ui-noboxshadow")}(e),function(e,t){var n=e.mobile.window,r,i=function(){};e.event.special.beforenavigate={setup:function(){n.on("navigate",i)},teardown:function(){n.off("navigate",i)}},e.event.special.navigate=r={bound:!1,pushStateEnabled:!0,originalEventName:t,isPushStateEnabled:function(){return e.support.pushState&&e.mobile.pushStateEnabled===!0&&this.isHashChangeEnabled()},isHashChangeEnabled:function(){return e.mobile.hashListeningEnabled===!0},popstate:function(t){var r=new e.Event("navigate"),i=new e.Event("beforenavigate"),s=t.originalEvent.state||{};i.originalEvent=t,n.trigger(i);if(i.isDefaultPrevented())return;t.historyState&&e.extend(s,t.historyState),r.originalEvent=t,setTimeout(function(){n.trigger(r,{state:s})},0)},hashchange:function(t){var r=new e.Event("navigate"),i=new e.Event("beforenavigate");i.originalEvent=t,n.trigger(i);if(i.isDefaultPrevented())return;r.originalEvent=t,n.trigger(r,{state:t.hashchangeState||{}})},setup:function(){if(r.bound)return;r.bound=!0,r.isPushStateEnabled()?(r.originalEventName="popstate",n.bind("popstate.navigate",r.popstate)):r.isHashChangeEnabled()&&(r.originalEventName="hashchange",n.bind("hashchange.navigate",r.hashchange))}}}(e),function(e){e.event.special.throttledresize={setup:function(){e(this).bind("resize",n)},teardown:function(){e(this).unbind("resize",n)}};var t=250,n=function(){s=(new Date).getTime(),o=s-r,o>=t?(r=s,e(this).trigger("throttledresize")):(i&&clearTimeout(i),i=setTimeout(n,t-o))},r=0,i,s,o}(e),function(e,t){function p(){var e=s();e!==o&&(o=e,r.trigger(i))}var r=e(t),i="orientationchange",s,o,u,a,f={0:!0,180:!0},l,c,h;if(e.support.orientation){l=t.innerWidth||r.width(),c=t.innerHeight||r.height(),h=50,u=l>c&&l-c>h,a=f[t.orientation];if(u&&a||!u&&!a)f={"-90":!0,90:!0}}e.event.special.orientationchange=e.extend({},e.event.special.orientationchange,{setup:function(){if(e.support.orientation&&!e.event.special.orientationchange.disabled)return!1;o=s(),r.bind("throttledresize",p)},teardown:function(){if(e.support.orientation&&!e.event.special.orientationchange.disabled)return!1;r.unbind("throttledresize",p)},add:function(e){var t=e.handler;e.handler=function(e){return e.orientation=s(),t.apply(this,arguments)}}}),e.event.special.orientationchange.orientation=s=function(){var r=!0,i=n.documentElement;return e.support.orientation?r=f[t.orientation]:r=i&&i.clientWidth/i.clientHeight<1.1,r?"portrait":"landscape"},e.fn[i]=function(e){return e?this.bind(i,e):this.trigger(i)},e.attrFn&&(e.attrFn[i]=!0)}(e,this),function(e,t,n,r){function T(e){while(e&&typeof e.originalEvent!="undefined")e=e.originalEvent;return e}function N(t,n){var i=t.type,s,o,a,l,c,h,p,d,v;t=e.Event(t),t.type=n,s=t.originalEvent,o=e.event.props,i.search(/^(mouse|click)/)>-1&&(o=f);if(s)for(p=o.length,l;p;)l=o[--p],t[l]=s[l];i.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1);if(i.search(/^touch/)!==-1){a=T(s),i=a.touches,c=a.changedTouches,h=i&&i.length?i[0]:c&&c.length?c[0]:r;if(h)for(d=0,v=u.length;d<v;d++)l=u[d],t[l]=h[l]}return t}function C(t){var n={},r,s;while(t){r=e.data(t,i);for(s in r)r[s]&&(n[s]=n.hasVirtualBinding=!0);t=t.parentNode}return n}function k(t,n){var r;while(t){r=e.data(t,i);if(r&&(!n||r[n]))return t;t=t.parentNode}return null}function L(){g=!1}function A(){g=!0}function O(){E=0,v.length=0,m=!1,A()}function M(){L()}function _(){D(),c=setTimeout(function(){c=0,O()},e.vmouse.resetTimerDuration)}function D(){c&&(clearTimeout(c),c=0)}function P(t,n,r){var i;if(r&&r[t]||!r&&k(n.target,t))i=N(n,t),e(n.target).trigger(i);return i}function H(t){var n=e.data(t.target,s),r;!m&&(!E||E!==n)&&(r=P("v"+t.type,t),r&&(r.isDefaultPrevented()&&t.preventDefault(),r.isPropagationStopped()&&t.stopPropagation(),r.isImmediatePropagationStopped()&&t.stopImmediatePropagation()))}function B(t){var n=T(t).touches,r,i,o;n&&n.length===1&&(r=t.target,i=C(r),i.hasVirtualBinding&&(E=w++,e.data(r,s,E),D(),M(),d=!1,o=T(t).touches[0],h=o.pageX,p=o.pageY,P("vmouseover",t,i),P("vmousedown",t,i)))}function j(e){if(g)return;d||P("vmousecancel",e,C(e.target)),d=!0,_()}function F(t){if(g)return;var n=T(t).touches[0],r=d,i=e.vmouse.moveDistanceThreshold,s=C(t.target);d=d||Math.abs(n.pageX-h)>i||Math.abs(n.pageY-p)>i,d&&!r&&P("vmousecancel",t,s),P("vmousemove",t,s),_()}function I(e){if(g)return;A();var t=C(e.target),n,r;P("vmouseup",e,t),d||(n=P("vclick",e,t),n&&n.isDefaultPrevented()&&(r=T(e).changedTouches[0],v.push({touchID:E,x:r.clientX,y:r.clientY}),m=!0)),P("vmouseout",e,t),d=!1,_()}function q(t){var n=e.data(t,i),r;if(n)for(r in n)if(n[r])return!0;return!1}function R(){}function U(t){var n=t.substr(1);return{setup:function(){q(this)||e.data(this,i,{});var r=e.data(this,i);r[t]=!0,l[t]=(l[t]||0)+1,l[t]===1&&b.bind(n,H),e(this).bind(n,R),y&&(l.touchstart=(l.touchstart||0)+1,l.touchstart===1&&b.bind("touchstart",B).bind("touchend",I).bind("touchmove",F).bind("scroll",j))},teardown:function(){--l[t],l[t]||b.unbind(n,H),y&&(--l.touchstart,l.touchstart||b.unbind("touchstart",B).unbind("touchmove",F).unbind("touchend",I).unbind("scroll",j));var r=e(this),s=e.data(this,i);s&&(s[t]=!1),r.unbind(n,R),q(this)||r.removeData(i)}}}var i="virtualMouseBindings",s="virtualTouchID",o="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),u="clientX clientY pageX pageY screenX screenY".split(" "),a=e.event.mouseHooks?e.event.mouseHooks.props:[],f=e.event.props.concat(a),l={},c=0,h=0,p=0,d=!1,v=[],m=!1,g=!1,y="addEventListener"in n,b=e(n),w=1,E=0,S,x;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(x=0;x<o.length;x++)e.event.special[o[x]]=U(o[x]);y&&n.addEventListener("click",function(t){var n=v.length,r=t.target,i,o,u,a,f,l;if(n){i=t.clientX,o=t.clientY,S=e.vmouse.clickDistanceThreshold,u=r;while(u){for(a=0;a<n;a++){f=v[a],l=0;if(u===r&&Math.abs(f.x-i)<S&&Math.abs(f.y-o)<S||e.data(u,s)===f.touchID){t.preventDefault(),t.stopPropagation();return}}u=u.parentNode}}},!0)}(e,t,n),function(e,t,r){function l(t,n,i,s){var o=i.type;i.type=n,s?e.event.trigger(i,r,t):e.event.dispatch.call(t,i),i.type=o}var i=e(n),s=e.mobile.support.touch,o="touchmove scroll",u=s?"touchstart":"mousedown",a=s?"touchend":"mouseup",f=s?"touchmove":"mousemove";e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,n){e.fn[n]=function(e){return e?this.bind(n,e):this.trigger(n)},e.attrFn&&(e.attrFn[n]=!0)}),e.event.special.scrollstart={enabled:!0,setup:function(){function s(e,n){r=n,l(t,r?"scrollstart":"scrollstop",e)}var t=this,n=e(t),r,i;n.bind(o,function(t){if(!e.event.special.scrollstart.enabled)return;r||s(t,!0),clearTimeout(i),i=setTimeout(function(){s(t,!1)},50)})},teardown:function(){e(this).unbind(o)}},e.event.special.tap={tapholdThreshold:750,emitTapOnTaphold:!0,setup:function(){var t=this,n=e(t),r=!1;n.bind("vmousedown",function(s){function a(){clearTimeout(u)}function f(){a(),n.unbind("vclick",c).unbind("vmouseup",a),i.unbind("vmousecancel",f)}function c(e){f(),!r&&o===e.target?l(t,"tap",e):r&&e.preventDefault()}r=!1;if(s.which&&s.which!==1)return!1;var o=s.target,u;n.bind("vmouseup",a).bind("vclick",c),i.bind("vmousecancel",f),u=setTimeout(function(){e.event.special.tap.emitTapOnTaphold||(r=!0),l(t,"taphold",e.Event("taphold",{target:o}))},e.event.special.tap.tapholdThreshold)})},teardown:function(){e(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup"),i.unbind("vmousecancel")}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:30,getLocation:function(e){var n=t.pageXOffset,r=t.pageYOffset,i=e.clientX,s=e.clientY;if(e.pageY===0&&Math.floor(s)>Math.floor(e.pageY)||e.pageX===0&&Math.floor(i)>Math.floor(e.pageX))i-=n,s-=r;else if(s<e.pageY-r||i<e.pageX-n)i=e.pageX-n,s=e.pageY-r;return{x:i,y:s}},start:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y],origin:e(t.target)}},stop:function(t){var n=t.originalEvent.touches?t.originalEvent.touches[0]:t,r=e.event.special.swipe.getLocation(n);return{time:(new Date).getTime(),coords:[r.x,r.y]}},handleSwipe:function(t,n,r,i){if(n.time-t.time<e.event.special.swipe.durationThreshold&&Math.abs(t.coords[0]-n.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(t.coords[1]-n.coords[1])<e.event.special.swipe.verticalDistanceThreshold){var s=t.coords[0]>n.coords[0]?"swipeleft":"swiperight";return l(r,"swipe",e.Event("swipe",{target:i,swipestart:t,swipestop:n}),!0),l(r,s,e.Event(s,{target:i,swipestart:t,swipestop:n}),!0),!0}return!1},eventInProgress:!1,setup:function(){var t,n=this,r=e(n),s={};t=e.data(this,"mobile-events"),t||(t={length:0},e.data(this,"mobile-events",t)),t.length++,t.swipe=s,s.start=function(t){if(e.event.special.swipe.eventInProgress)return;e.event.special.swipe.eventInProgress=!0;var r,o=e.event.special.swipe.start(t),u=t.target,l=!1;s.move=function(t){if(!o||t.isDefaultPrevented())return;r=e.event.special.swipe.stop(t),l||(l=e.event.special.swipe.handleSwipe(o,r,n,u),l&&(e.event.special.swipe.eventInProgress=!1)),Math.abs(o.coords[0]-r.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&t.preventDefault()},s.stop=function(){l=!0,e.event.special.swipe.eventInProgress=!1,i.off(f,s.move),s.move=null},i.on(f,s.move).one(a,s.stop)},r.on(u,s.start)},teardown:function(){var t,n;t=e.data(this,"mobile-events"),t&&(n=t.swipe,delete t.swipe,t.length--,t.length===0&&e.removeData(this,"mobile-events")),n&&(n.start&&e(this).off(u,n.start),n.move&&i.off(f,n.move),n.stop&&i.off(a,n.stop))}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe.left",swiperight:"swipe.right"},function(t,n){e.event.special[t]={setup:function(){e(this).bind(n,e.noop)},teardown:function(){e(this).unbind(n)}}})}(e,this),function(e,t){var r={animation:{},transition:{}},i=n.createElement("a"),s=["","webkit-","moz-","o-"];e.each(["animation","transition"],function(n,o){var u=n===0?o+"-"+"name":o;e.each(s,function(n,s){if(i.style[e.camelCase(s+u)]!==t)return r[o].prefix=s,!1}),r[o].duration=e.camelCase(r[o].prefix+o+"-"+"duration"),r[o].event=e.camelCase(r[o].prefix+o+"-"+"end"),r[o].prefix===""&&(r[o].event=r[o].event.toLowerCase())}),e.support.cssTransitions=r.transition.prefix!==t,e.support.cssAnimations=r.animation.prefix!==t,e(i).remove(),e.fn.animationComplete=function(i,s,o){var u,a,f=this,l=function(){clearTimeout(u),i.apply(this,arguments)},c=!s||s==="animation"?"animation":"transition";if(e.support.cssTransitions&&c==="transition"||e.support.cssAnimations&&c==="animation"){if(o===t){e(this).context!==n&&(a=parseFloat(e(this).css(r[c].duration))*3e3);if(a===0||a===t||isNaN(a))a=e.fn.animationComplete.defaultDuration}return u=setTimeout(function(){e(f).off(r[c].event,l),i.apply(f)},a),e(this).one(r[c].event,l)}return setTimeout(e.proxy(i,this),0),e(this)},e.fn.animationComplete.defaultDuration=1e3}(e),function(e,n){var r,i,s="&ui-state=dialog";e.mobile.path=r={uiStateKey:"&ui-state",urlParseRE:/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,getLocation:function(e){var t=this.parseUrl(e||location.href),n=e?t:location,r=t.hash;return r=r==="#"?"":r,n.protocol+t.doubleSlash+n.host+(n.protocol!==""&&n.pathname.substring(0,1)!=="/"?"/":"")+n.pathname+n.search+r},getDocumentUrl:function(t){return t?e.extend({},r.documentUrl):r.documentUrl.href},parseLocation:function(){return this.parseUrl(this.getLocation())},parseUrl:function(t){if(e.type(t)==="object")return t;var n=r.urlParseRE.exec(t||"")||[];return{href:n[0]||"",hrefNoHash:n[1]||"",hrefNoSearch:n[2]||"",domain:n[3]||"",protocol:n[4]||"",doubleSlash:n[5]||"",authority:n[6]||"",username:n[8]||"",password:n[9]||"",host:n[10]||"",hostname:n[11]||"",port:n[12]||"",pathname:n[13]||"",directory:n[14]||"",filename:n[15]||"",search:n[16]||"",hash:n[17]||""}},makePathAbsolute:function(e,t){var n,r,i,s;if(e&&e.charAt(0)==="/")return e;e=e||"",t=t?t.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"",n=t?t.split("/"):[],r=e.split("/");for(i=0;i<r.length;i++){s=r[i];switch(s){case".":break;case"..":n.length&&n.pop();break;default:n.push(s)}}return"/"+n.join("/")},isSameDomain:function(e,t){return r.parseUrl(e).domain.toLowerCase()===r.parseUrl(t).domain.toLowerCase()},isRelativeUrl:function(e){return r.parseUrl(e).protocol===""},isAbsoluteUrl:function(e){return r.parseUrl(e).protocol!==""},makeUrlAbsolute:function(e,t){if(!r.isRelativeUrl(e))return e;t===n&&(t=this.documentBase);var i=r.parseUrl(e),s=r.parseUrl(t),o=i.protocol||s.protocol,u=i.protocol?i.doubleSlash:i.doubleSlash||s.doubleSlash,a=i.authority||s.authority,f=i.pathname!=="",l=r.makePathAbsolute(i.pathname||s.filename,s.pathname),c=i.search||!f&&s.search||"",h=i.hash;return o+u+a+l+c+h},addSearchParams:function(t,n){var i=r.parseUrl(t),s=typeof n=="object"?e.param(n):n,o=i.search||"?";return i.hrefNoSearch+o+(o.charAt(o.length-1)!=="?"?"&":"")+s+(i.hash||"")},convertUrlToDataUrl:function(e){var n=e,i=r.parseUrl(e);return r.isEmbeddedPage(i)?n=i.hash.split(s)[0].replace(/^#/,"").replace(/\?.*$/,""):r.isSameDomain(i,this.documentBase)&&(n=i.hrefNoHash.replace(this.documentBase.domain,"").split(s)[0]),t.decodeURIComponent(n)},get:function(e){return e===n&&(e=r.parseLocation().hash),r.stripHash(e).replace(/[^\/]*\.[^\/*]+$/,"")},set:function(e){location.hash=e},isPath:function(e){return/\//.test(e)},clean:function(e){return e.replace(this.documentBase.domain,"")},stripHash:function(e){return e.replace(/^#/,"")},stripQueryParams:function(e){return e.replace(/\?.*$/,"")},cleanHash:function(e){return r.stripHash(e.replace(/\?.*$/,"").replace(s,""))},isHashValid:function(e){return/^#[^#]+$/.test(e)},isExternal:function(e){var t=r.parseUrl(e);return!!t.protocol&&t.domain.toLowerCase()!==this.documentUrl.domain.toLowerCase()},hasProtocol:function(e){return/^(:?\w+:)/.test(e)},isEmbeddedPage:function(e){var t=r.parseUrl(e);return t.protocol!==""?!this.isPath(t.hash)&&t.hash&&(t.hrefNoHash===this.documentUrl.hrefNoHash||this.documentBaseDiffers&&t.hrefNoHash===this.documentBase.hrefNoHash):/^#/.test(t.href)},squash:function(e,t){var n,i,s,o,u,a=this.isPath(e),f=this.parseUrl(e),l=f.hash,c="";t||(a?t=r.getLocation():(u=r.getDocumentUrl(!0),r.isPath(u.hash)?t=r.squash(u.href):t=u.href)),i=a?r.stripHash(e):e,i=r.isPath(f.hash)?r.stripHash(f.hash):i,o=i.indexOf(this.uiStateKey),o>-1&&(c=i.slice(o),i=i.slice(0,o)),n=r.makeUrlAbsolute(i,t),s=this.parseUrl(n).search;if(a){if(r.isPath(l)||l.replace("#","").indexOf(this.uiStateKey)===0)l="";c&&l.indexOf(this.uiStateKey)===-1&&(l+=c),l.indexOf("#")===-1&&l!==""&&(l="#"+l),n=r.parseUrl(n),n=n.protocol+n.doubleSlash+n.host+n.pathname+s+l}else n+=n.indexOf("#")>-1?c:"#"+c;return n},isPreservableHash:function(e){return e.replace("#","").indexOf(this.uiStateKey)===0},hashToSelector:function(e){var t=e.substring(0,1)==="#";return t&&(e=e.substring(1)),(t?"#":"")+e.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g,"\\$1")},getFilePath:function(e){return e&&e.split(s)[0]},isFirstPageUrl:function(t){var i=r.parseUrl(r.makeUrlAbsolute(t,this.documentBase)),s=i.hrefNoHash===this.documentUrl.hrefNoHash||this.documentBaseDiffers&&i.hrefNoHash===this.documentBase.hrefNoHash,o=e.mobile.firstPage,u=o&&o[0]?o[0].id:n;return s&&(!i.hash||i.hash==="#"||u&&i.hash.replace(/^#/,"")===u)},isPermittedCrossDomainRequest:function(t,n){return e.mobile.allowCrossDomainPages&&(t.protocol==="file:"||t.protocol==="content:")&&n.search(/^https?:/)!==-1}},r.documentUrl=r.parseLocation(),i=e("head").find("base"),r.documentBase=i.length?r.parseUrl(r.makeUrlAbsolute(i.attr("href"),r.documentUrl.href)):r.documentUrl,r.documentBaseDiffers=r.documentUrl.hrefNoHash!==r.documentBase.hrefNoHash,r.getDocumentBase=function(t){return t?e.extend({},r.documentBase):r.documentBase.href},e.extend(e.mobile,{getDocumentUrl:r.getDocumentUrl,getDocumentBase:r.getDocumentBase})}(e),function(e,t){e.mobile.History=function(e,t){this.stack=e||[],this.activeIndex=t||0},e.extend(e.mobile.History.prototype,{getActive:function(){return this.stack[this.activeIndex]},getLast:function(){return this.stack[this.previousIndex]},getNext:function(){return this.stack[this.activeIndex+1]},getPrev:function(){return this.stack[this.activeIndex-1]},add:function(e,t){t=t||{},this.getNext()&&this.clearForward(),t.hash&&t.hash.indexOf("#")===-1&&(t.hash="#"+t.hash),t.url=e,this.stack.push(t),this.activeIndex=this.stack.length-1},clearForward:function(){this.stack=this.stack.slice(0,this.activeIndex+1)},find:function(e,t,n){t=t||this.stack;var r,i,s=t.length,o;for(i=0;i<s;i++){r=t[i];if(decodeURIComponent(e)===decodeURIComponent(r.url)||decodeURIComponent(e)===decodeURIComponent(r.hash)){o=i;if(n)return o}}return o},closest:function(e){var n,r=this.activeIndex;return n=this.find(e,this.stack.slice(0,r)),n===t&&(n=this.find(e,this.stack.slice(r),!0),n=n===t?n:n+r),n},direct:function(n){var r=this.closest(n.url),i=this.activeIndex;r!==t&&(this.activeIndex=r,this.previousIndex=i),r<i?(n.present||n.back||e.noop)(this.getActive(),"back"):r>i?(n.present||n.forward||e.noop)(this.getActive(),"forward"):r===t&&n.missing&&n.missing(this.getActive())}})}(e),function(e,r){var i=e.mobile.path,s=location.href;e.mobile.Navigator=function(t){this.history=t,this.ignoreInitialHashChange=!0,e.mobile.window.bind({"popstate.history":e.proxy(this.popstate,this),"hashchange.history":e.proxy(this.hashchange,this)})},e.extend(e.mobile.Navigator.prototype,{squash:function(r,s){var o,u,a=i.isPath(r)?i.stripHash(r):r;return u=i.squash(r),o=e.extend({hash:a,url:u},s),t.history.replaceState(o,o.title||n.title,u),o},hash:function(e,t){var n,r,s,o;return n=i.parseUrl(e),r=i.parseLocation(),r.pathname+r.search===n.pathname+n.search?s=n.hash?n.hash:n.pathname+n.search:i.isPath(e)?(o=i.parseUrl(t),s=o.pathname+o.search+(i.isPreservableHash(o.hash)?o.hash.replace("#",""):"")):s=e,s},go:function(r,s,o){var u,a,f,l,c=e.event.special.navigate.isPushStateEnabled();a=i.squash(r),f=this.hash(r,a),o&&f!==i.stripHash(i.parseLocation().hash)&&(this.preventNextHashChange=o),this.preventHashAssignPopState=!0,t.location.hash=f,this.preventHashAssignPopState=!1,u=e.extend({url:a,hash:f,title:n.title},s),c&&(l=new e.Event("popstate"),l.originalEvent={type:"popstate",state:null},this.squash(r,u),o||(this.ignorePopState=!0,e.mobile.window.trigger(l))),this.history.add(u.url,u)},popstate:function(t){var n,r;if(!e.event.special.navigate.isPushStateEnabled())return;if(this.preventHashAssignPopState){this.preventHashAssignPopState=!1,t.stopImmediatePropagation();return}if(this.ignorePopState){this.ignorePopState=!1;return}if(!t.originalEvent.state&&this.history.stack.length===1&&this.ignoreInitialHashChange){this.ignoreInitialHashChange=!1;if(location.href===s){t.preventDefault();return}}n=i.parseLocation().hash;if(!t.originalEvent.state&&n){r=this.squash(n),this.history.add(r.url,r),t.historyState=r;return}this.history.direct({url:(t.originalEvent.state||{}).url||n,present:function(n,r){t.historyState=e.extend({},n),t.historyState.direction=r}})},hashchange:function(t){var r,s;if(!e.event.special.navigate.isHashChangeEnabled()||e.event.special.navigate.isPushStateEnabled())return;if(this.preventNextHashChange){this.preventNextHashChange=!1,t.stopImmediatePropagation();return}r=this.history,s=i.parseLocation().hash,this.history.direct({url:s,present:function(n,r){t.hashchangeState=e.extend({},n),t.hashchangeState.direction=r},missing:function(){r.add(s,{hash:s,title:n.title})}})}})}(e),function(e,t){e.mobile.navigate=function(t,n,r){e.mobile.navigate.navigator.go(t,n,r)},e.mobile.navigate.history=new e.mobile.History,e.mobile.navigate.navigator=new e.mobile.Navigator(e.mobile.navigate.history);var n=e.mobile.path.parseLocation();e.mobile.navigate.history.add(n.href,{hash:n.hash})}(e),function(e,t){var n=e("head").children("base"),r={element:n.length?n:e("<base>",{href:e.mobile.path.documentBase.hrefNoHash}).prependTo(e("head")),linkSelector:"[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]",set:function(t){if(!e.mobile.dynamicBaseEnabled)return;e.support.dynamicBaseTag&&r.element.attr("href",e.mobile.path.makeUrlAbsolute(t,e.mobile.path.documentBase))},rewrite:function(t,n){var i=e.mobile.path.get(t);n.find(r.linkSelector).each(function(t,n){var r=e(n).is("[href]")?"href":e(n).is("[src]")?"src":"action",s=e.mobile.path.parseLocation(),o=e(n).attr(r);o=o.replace(s.protocol+s.doubleSlash+s.host+s.pathname,""),/^(\w+:|#|\/)/.test(o)||e(n).attr(r,i+o)})},reset:function(){r.element.attr("href",e.mobile.path.documentBase.hrefNoSearch)}};e.mobile.base=r}(e),function(e,t){var n=0,r=Array.prototype.slice,i=e.cleanData;e.cleanData=function(t){for(var n=0,r;(r=t[n])!=null;n++)try{e(r).triggerHandler("remove")}catch(s){}i(t)},e.widget=function(t,n,r){var i,s,o,u,a={},f=t.split(".")[0];return t=t.split(".")[1],i=f+"-"+t,r||(r=n,n=e.Widget),e.expr[":"][i.toLowerCase()]=function(t){return!!e.data(t,i)},e[f]=e[f]||{},s=e[f][t],o=e[f][t]=function(e,t){if(!this._createWidget)return new o(e,t);arguments.length&&this._createWidget(e,t)},e.extend(o,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),u=new n,u.options=e.widget.extend({},u.options),e.each(r,function(t,r){if(!e.isFunction(r)){a[t]=r;return}a[t]=function(){var e=function(){return n.prototype[t].apply(this,arguments)},i=function(e){return n.prototype[t].apply(this,e)};return function(){var t=this._super,n=this._superApply,s;return this._super=e,this._superApply=i,s=r.apply(this,arguments),this._super=t,this._superApply=n,s}}()}),o.prototype=e.widget.extend(u,{widgetEventPrefix:s?u.widgetEventPrefix||t:t},a,{constructor:o,namespace:f,widgetName:t,widgetFullName:i}),s?(e.each(s._childConstructors,function(t,n){var r=n.prototype;e.widget(r.namespace+"."+r.widgetName,o,n._proto)}),delete s._childConstructors):n._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(n){var i=r.call(arguments,1),s=0,o=i.length,u,a;for(;s<o;s++)for(u in i[s])a=i[s][u],i[s].hasOwnProperty(u)&&a!==t&&(e.isPlainObject(a)?n[u]=e.isPlainObject(n[u])?e.widget.extend({},n[u],a):e.widget.extend({},a):n[u]=a);return n},e.widget.bridge=function(n,i){var s=i.prototype.widgetFullName||n;e.fn[n]=function(o){var u=typeof o=="string",a=r.call(arguments,1),f=this;return o=!u&&a.length?e.widget.extend.apply(null,[o].concat(a)):o,u?this.each(function(){var r,i=e.data(this,s);if(o==="instance")return f=i,!1;if(!i)return e.error("cannot call methods on "+n+" prior to initialization; "+"attempted to call method '"+o+"'");if(!e.isFunction(i[o])||o.charAt(0)==="_")return e.error("no such method '"+o+"' for "+n+" widget instance");r=i[o].apply(i,a);if(r!==i&&r!==t)return f=r&&r.jquery?f.pushStack(r.get()):r,!1}):this.each(function(){var t=e.data(this,s);t?t.option(o||{})._init():e.data(this,s,new i(o,this))}),f}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=n++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),r!==this&&(e.data(r,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===r&&this.destroy()}}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(n,r){var i=n,s,o,u;if(arguments.length===0)return e.widget.extend({},this.options);if(typeof n=="string"){i={},s=n.split("."),n=s.shift();if(s.length){o=i[n]=e.widget.extend({},this.options[n]);for(u=0;u<s.length-1;u++)o[s[u]]=o[s[u]]||{},o=o[s[u]];n=s.pop();if(r===t)return o[n]===t?null:o[n];o[n]=r}else{if(r===t)return this.options[n]===t?null:this.options[n];i[n]=r}}return this._setOptions(i),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,e==="disabled"&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,n,r){var i,s=this;typeof t!="boolean"&&(r=n,n=t,t=!1),r?(n=i=e(n),this.bindings=this.bindings.add(n)):(r=n,n=this.element,i=this.widget()),e.each(r,function(r,o){function u(){if(!t&&(s.options.disabled===!0||e(this).hasClass("ui-state-disabled")))return;return(typeof o=="string"?s[o]:o).apply(s,arguments)}typeof o!="string"&&(u.guid=o.guid=o.guid||u.guid||e.guid++);var a=r.match(/^(\w+)\s*(.*)$/),f=a[1]+s.eventNamespace,l=a[2];l?i.delegate(l,f,u):n.bind(f,u)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function n(){return(typeof e=="string"?r[e]:e).apply(r,arguments)}var r=this;return setTimeout(n,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,n,r){var i,s,o=this.options[t];r=r||{},n=e.Event(n),n.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],s=n.originalEvent;if(s)for(i in s)i in n||(n[i]=s[i]);return this.element.trigger(n,r),!(e.isFunction(o)&&o.apply(this.element[0],[n].concat(r))===!1||n.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,n){e.Widget.prototype["_"+t]=function(r,i,s){typeof i=="string"&&(i={effect:i});var o,u=i?i===!0||typeof i=="number"?n:i.effect||n:t;i=i||{},typeof i=="number"&&(i={duration:i}),o=!e.isEmptyObject(i),i.complete=s,i.delay&&r.delay(i.delay),o&&e.effects&&e.effects.effect[u]?r[t](i):u!==t&&r[u]?r[u](i.duration,i.easing,s):r.queue(function(n){e(this)[t](),s&&s.call(r[0]),n()})}})}(e),function(e,t){var n=/[A-Z]/g,r=function(e){return"-"+e.toLowerCase()};e.extend(e.Widget.prototype,{_getCreateOptions:function(){var t,i,s=this.element[0],o={};if(!e.mobile.getAttribute(s,"defaults"))for(t in this.options)i=e.mobile.getAttribute(s,t.replace(n,r)),i!=null&&(o[t]=i);return o}}),e.mobile.widget=e.Widget}(e),function(e,t){e.mobile.widgets={};var n=e.widget,r=e.mobile.keepNative;e.widget=function(n){return function(){var r=n.apply(this,arguments),i=r.prototype.widgetName;return r.initSelector=r.prototype.initSelector!==t?r.prototype.initSelector:":jqmData(role='"+i+"')",e.mobile.widgets[i]=r,r}}(e.widget),e.extend(e.widget,n),e.mobile.document.on("create",function(t){e(t.target).enhanceWithin()}),e.widget("mobile.page",{options:{theme:"a",domCache:!1,keepNativeDefault:e.mobile.keepNative,contentTheme:null,enhanced:!1},_createWidget:function(){e.Widget.prototype._createWidget.apply(this,arguments),this._trigger("init")},_create:function(){if(this._trigger("beforecreate")===!1)return!1;this.options.enhanced||this._enhance(),this._on(this.element,{pagebeforehide:"removeContainerBackground",pagebeforeshow:"_handlePageBeforeShow"}),this.element.enhanceWithin(),e.mobile.getAttribute(this.element[0],"role")==="dialog"&&e.mobile.dialog&&this.element.dialog()},_enhance:function(){var n="data-"+e.mobile.ns,r=this;this.options.role&&this.element.attr("data-"+e.mobile.ns+"role",this.options.role),this.element.attr("tabindex","0").addClass("ui-page ui-page-theme-"+this.options.theme),this.element.find("["+n+"role='content']").each(function(){var i=e(this),s=this.getAttribute(n+"theme")||t;r.options.contentTheme=s||r.options.contentTheme||r.options.dialog&&r.options.theme||r.element.jqmData("role")==="dialog"&&r.options.theme,i.addClass("ui-content"),r.options.contentTheme&&i.addClass("ui-body-"+r.options.contentTheme),i.attr("role","main").addClass("ui-content")})},bindRemove:function(t){var n=this.element;!n.data("mobile-page").options.domCache&&n.is(":jqmData(external-page='true')")&&n.bind("pagehide.remove",t||function(t,n){if(!n.samePage){var r=e(this),i=new e.Event("pageremove");r.trigger(i),i.isDefaultPrevented()||r.removeWithDependents()}})},_setOptions:function(n){n.theme!==t&&this.element.removeClass("ui-page-theme-"+this.options.theme).addClass("ui-page-theme-"+n.theme),n.contentTheme!==t&&this.element.find("[data-"+e.mobile.ns+"='content']").removeClass("ui-body-"+this.options.contentTheme).addClass("ui-body-"+n.contentTheme)},_handlePageBeforeShow:function(){this.setContainerBackground()},removeContainerBackground:function(){this.element.closest(":mobile-pagecontainer").pagecontainer({theme:"none"})},setContainerBackground:function(e){this.element.parent().pagecontainer({theme:e||this.options.theme})},keepNativeSelector:function(){var t=this.options,n=e.trim(t.keepNative||""),i=e.trim(e.mobile.keepNative),s=e.trim(t.keepNativeDefault),o=r===i?"":i,u=o===""?s:"";return(n?[n]:[]).concat(o?[o]:[]).concat(u?[u]:[]).join(", ")}})}(e),function(e,t,n){e.mobile.Transition=function(){this.init.apply(this,arguments)},e.extend(e.mobile.Transition.prototype,{toPreClass:" ui-page-pre-in",init:function(t,n,r,i){e.extend(this,{name:t,reverse:n,$to:r,$from:i,deferred:new e.Deferred})},cleanFrom:function(){this.$from.removeClass(e.mobile.activePageClass+" out in reverse "+this.name).height("")},beforeDoneIn:function(){},beforeDoneOut:function(){},beforeStartOut:function(){},doneIn:function(){this.beforeDoneIn(),this.$to.removeClass("out in reverse "+this.name).height(""),this.toggleViewportClass(),e.mobile.window.scrollTop()!==this.toScroll&&this.scrollPage(),this.sequential||this.$to.addClass(e.mobile.activePageClass),this.deferred.resolve(this.name,this.reverse,this.$to,this.$from,!0)},doneOut:function(e,t,n,r){this.beforeDoneOut(),this.startIn(e,t,n,r)},hideIn:function(e){this.$to.css("z-index",-10),e.call(this),this.$to.css("z-index","")},scrollPage:function(){e.event.special.scrollstart.enabled=!1,(e.mobile.hideUrlBar||this.toScroll!==e.mobile.defaultHomeScroll)&&t.scrollTo(0,this.toScroll),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},startIn:function(t,n,r,i){this.hideIn(function(){this.$to.addClass(e.mobile.activePageClass+this.toPreClass),i||e.mobile.focusPage(this.$to),this.$to.height(t+this.toScroll),r||this.scrollPage()}),this.$to.removeClass(this.toPreClass).addClass(this.name+" in "+n),r?this.doneIn():this.$to.animationComplete(e.proxy(function(){this.doneIn()},this))},startOut:function(t,n,r){this.beforeStartOut(t,n,r),this.$from.height(t+e.mobile.window.scrollTop()).addClass(this.name+" out"+n)},toggleViewportClass:function(){e.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-"+this.name)},transition:function(){var t,n=this.reverse?" reverse":"",r=e.mobile.getScreenHeight(),i=e.mobile.maxTransitionWidth!==!1&&e.mobile.window.width()>e.mobile.maxTransitionWidth;return this.toScroll=e.mobile.navigate.history.getActive().lastScroll||e.mobile.defaultHomeScroll,t=!e.support.cssTransitions||!e.support.cssAnimations||i||!this.name||this.name==="none"||Math.max(e.mobile.window.scrollTop(),this.toScroll)>e.mobile.getMaxScrollForTransition(),this.toggleViewportClass(),this.$from&&!t?this.startOut(r,n,t):this.doneOut(r,n,t,!0),this.deferred.promise()}})}(e,this),function(e){e.mobile.SerialTransition=function(){this.init.apply(this,arguments)},e.extend(e.mobile.SerialTransition.prototype,e.mobile.Transition.prototype,{sequential:!0,beforeDoneOut:function(){this.$from&&this.cleanFrom()},beforeStartOut:function(t,n,r){this.$from.animationComplete(e.proxy(function(){this.doneOut(t,n,r)},this))}})}(e),function(e){e.mobile.ConcurrentTransition=function(){this.init.apply(this,arguments)},e.extend(e.mobile.ConcurrentTransition.prototype,e.mobile.Transition.prototype,{sequential:!1,beforeDoneIn:function(){this.$from&&this.cleanFrom()},beforeStartOut:function(e,t,n){this.doneOut(e,t,n)}})}(e),function(e){var t=function(){return e.mobile.getScreenHeight()*3};e.mobile.transitionHandlers={sequential:e.mobile.SerialTransition,simultaneous:e.mobile.ConcurrentTransition},e.mobile.defaultTransitionHandler=e.mobile.transitionHandlers.sequential,e.mobile.transitionFallbacks={},e.mobile._maybeDegradeTransition=function(t){return t&&!e.support.cssTransform3d&&e.mobile.transitionFallbacks[t]&&(t=e.mobile.transitionFallbacks[t]),t},e.mobile.getMaxScrollForTransition=e.mobile.getMaxScrollForTransition||t}(e),function(e,r){e.widget("mobile.pagecontainer",{options:{theme:"a"},initSelector:!1,_create:function(){this._trigger("beforecreate"),this.setLastScrollEnabled=!0,this._on(this.window,{navigate:"_disableRecordScroll",scrollstop:"_delayedRecordScroll"}),this._on(this.window,{navigate:"_filterNavigateEvents"}),this._on({pagechange:"_afterContentChange"}),this.window.one("navigate",e.proxy(function(){this.setLastScrollEnabled=!0},this))},_setOptions:function(e){e.theme!==r&&e.theme!=="none"?this.element.removeClass("ui-overlay-"+this.options.theme).addClass("ui-overlay-"+e.theme):e.theme!==r&&this.element.removeClass("ui-overlay-"+this.options.theme),this._super(e)},_disableRecordScroll:function(){this.setLastScrollEnabled=!1},_enableRecordScroll:function(){this.setLastScrollEnabled=!0},_afterContentChange:function(){this.setLastScrollEnabled=!0,this._off(this.window,"scrollstop"),this._on(this.window,{scrollstop:"_delayedRecordScroll"})},_recordScroll:function(){if(!this.setLastScrollEnabled)return;var e=this._getActiveHistory(),t,n,r;e&&(t=this._getScroll(),n=this._getMinScroll(),r=this._getDefaultScroll(),e.lastScroll=t<n?r:t)},_delayedRecordScroll:function(){setTimeout(e.proxy(this,"_recordScroll"),100)},_getScroll:function(){return this.window.scrollTop()},_getMinScroll:function(){return e.mobile.minScrollBack},_getDefaultScroll:function(){return e.mobile.defaultHomeScroll},_filterNavigateEvents:function(t,n){var r;if(t.originalEvent&&t.originalEvent.isDefaultPrevented())return;r=t.originalEvent.type.indexOf("hashchange")>-1?n.state.hash:n.state.url,r||(r=this._getHash());if(!r||r==="#"||r.indexOf("#"+e.mobile.path.uiStateKey)===0)r=location.href;this._handleNavigate(r,n.state)},_getHash:function(){return e.mobile.path.parseLocation().hash},getActivePage:function(){return this.activePage},_getInitialContent:function(){return e.mobile.firstPage},_getHistory:function(){return e.mobile.navigate.history},_getActiveHistory:function(){return this._getHistory().getActive()},_getDocumentBase:function(){return e.mobile.path.documentBase},back:function(){this.go(-1)},forward:function(){this.go(1)},go:function(n){if(e.mobile.hashListeningEnabled)t.history.go(n);else{var r=e.mobile.navigate.history.activeIndex,i=r+parseInt(n,10),s=e.mobile.navigate.history.stack[i].url,o=n>=1?"forward":"back";e.mobile.navigate.history.activeIndex=i,e.mobile.navigate.history.previousIndex=r,this.change(s,{direction:o,changeHash:!1,fromHashChange:!0})}},_handleDestination:function(t){var n;return e.type(t)==="string"&&(t=e.mobile.path.stripHash(t)),t&&(n=this._getHistory(),t=e.mobile.path.isPath(t)?t:e.mobile.path.makeUrlAbsolute("#"+t,this._getDocumentBase())),t||this._getInitialContent()},_transitionFromHistory:function(e,t){var n=this._getHistory(),r=e==="back"?n.getLast():n.getActive();return r&&r.transition||t},_handleDialog:function(t,n){var r,i,s=this.getActivePage();return s&&!s.data("mobile-dialog")?(n.direction==="back"?this.back():this.forward(),!1):(r=n.pageUrl,i=this._getActiveHistory(),e.extend(t,{role:i.role,transition:this._transitionFromHistory(n.direction,t.transition),reverse:n.direction==="back"}),r)},_handleNavigate:function(t,n){var r=e.mobile.path.stripHash(t),i=this._getHistory(),s=i.stack.length===0?"none":this._transitionFromHistory(n.direction),o={changeHash:!1,fromHashChange:!0,reverse:n.direction==="back"};e.extend(o,n,{transition:s});if(i.activeIndex>0&&r.indexOf(e.mobile.dialogHashKey)>-1){r=this._handleDialog(o,n);if(r===!1)return}this._changeContent(this._handleDestination(r),o)},_changeContent:function(t,n){e.mobile.changePage(t,n)},_getBase:function(){return e.mobile.base},_getNs:function(){return e.mobile.ns},_enhance:function(e,t){return e.page({role:t})},_include:function(e,t){e.appendTo(this.element),this._enhance(e,t.role),e.page("bindRemove")},_find:function(t){var n=this._createFileUrl(t),r=this._createDataUrl(t),i,s=this._getInitialContent();return i=this.element.children("[data-"+this._getNs()+"url='"+e.mobile.path.hashToSelector(r)+"']"),i.length===0&&r&&!e.mobile.path.isPath(r)&&(i=this.element.children(e.mobile.path.hashToSelector("#"+r)).attr("data-"+this._getNs()+"url",r).jqmData("url",r)),i.length===0&&e.mobile.path.isFirstPageUrl(n)&&s&&s.parent().length&&(i=e(s)),i},_getLoader:function(){return e.mobile.loading()},_showLoading:function(t,n,r,i){if(this._loadMsg)return;this._loadMsg=setTimeout(e.proxy(function(){this._getLoader().loader("show",n,r,i),this._loadMsg=0},this),t)},_hideLoading:function(){clearTimeout(this._loadMsg),this._loadMsg=0,this._getLoader().loader("hide")},_showError:function(){this._hideLoading(),this._showLoading(0,e.mobile.pageLoadErrorMessageTheme,e.mobile.pageLoadErrorMessage,!0),setTimeout(e.proxy(this,"_hideLoading"),1500)},_parse:function(t,n){var r,i=e("<div></div>");return i.get(0).innerHTML=t,r=i.find(":jqmData(role='page'), :jqmData(role='dialog')").first(),r.length||(r=e("<div data-"+this._getNs()+"role='page'>"+(t.split(/<\/?body[^>]*>/gmi)[1]||"")+"</div>")),r.attr("data-"+this._getNs()+"url",this._createDataUrl(n)).attr("data-"+this._getNs()+"external-page",!0),r},_setLoadedTitle:function(t,n){var r=n.match(/<title[^>]*>([^<]*)/)&&RegExp.$1;r&&!t.jqmData("title")&&(r=e("<div>"+r+"</div>").text(),t.jqmData("title",r))},_isRewritableBaseTag:function(){return e.mobile.dynamicBaseEnabled&&!e.support.dynamicBaseTag},_createDataUrl:function(t){return e.mobile.path.convertUrlToDataUrl(t)},_createFileUrl:function(t){return e.mobile.path.getFilePath(t)},_triggerWithDeprecated:function(t,n,r){var i=e.Event("page"+t),s=e.Event(this.widgetName+t);return(r||this.element).trigger(i,n),this._trigger(t,s,n),{deprecatedEvent:i,event:s}},_loadSuccess:function(t,n,i,s){var o=this._createFileUrl(t);return e.proxy(function(u,a,f){var l,c=new RegExp("(<[^>]+\\bdata-"+this._getNs()+"role=[\"']?page[\"']?[^>]*>)"),h=new RegExp("\\bdata-"+this._getNs()+"url=[\"']?([^\"'>]*)[\"']?");c.test(u)&&RegExp.$1&&h.test(RegExp.$1)&&RegExp.$1&&(o=e.mobile.path.getFilePath(e("<div>"+RegExp.$1+"</div>").text()),o=this.window[0].encodeURIComponent(o)),i.prefetch===r&&this._getBase().set(o),l=this._parse(u,o),this._setLoadedTitle(l,u),n.xhr=f,n.textStatus=a,n.page=l,n.content=l,n.toPage=l;if(this._triggerWithDeprecated("load",n).event.isDefaultPrevented())return;this._isRewritableBaseTag()&&l&&this._getBase().rewrite(o,l),this._include(l,i),i.showLoadMsg&&this._hideLoading(),s.resolve(t,i,l)},this)},_loadDefaults:{type:"get",data:r,reloadPage:!1,reload:!1,role:r,showLoadMsg:!1,loadMsgDelay:50},load:function(t,n){var i=n&&n.deferred||e.Deferred(),s=n&&n.reload===r&&n.reloadPage!==r?{reload:n.reloadPage}:{},o=e.extend({},this._loadDefaults,n,s),u=null,a=e.mobile.path.makeUrlAbsolute(t,this._findBaseWithDefault()),f,l,c,h;return o.data&&o.type==="get"&&(a=e.mobile.path.addSearchParams(a,o.data),o.data=r),o.data&&o.type==="post"&&(o.reload=!0),f=this._createFileUrl(a),l=this._createDataUrl(a),u=this._find(a),u.length===0&&e.mobile.path.isEmbeddedPage(f)&&!e.mobile.path.isFirstPageUrl(f)?(i.reject(a,o),i.promise()):(this._getBase().reset(),u.length&&!o.reload?(this._enhance(u,o.role),i.resolve(a,o,u),o.prefetch||this._getBase().set(t),i.promise()):(h={url:t,absUrl:a,toPage:t,prevPage:n?n.fromPage:r,dataUrl:l,deferred:i,options:o},c=this._triggerWithDeprecated("beforeload",h),c.deprecatedEvent.isDefaultPrevented()||c.event.isDefaultPrevented()?i.promise():(o.showLoadMsg&&this._showLoading(o.loadMsgDelay),o.prefetch===r&&this._getBase().reset(),!e.mobile.allowCrossDomainPages&&!e.mobile.path.isSameDomain(e.mobile.path.documentUrl,a)?(i.reject(a,o),i.promise()):(e.ajax({url:f,type:o.type,data:o.data,contentType:o.contentType,dataType:"html",success:this._loadSuccess(a,h,o,i),error:this._loadError(a,h,o,i)}),i.promise()))))},_loadError:function(t,n,r,i){return e.proxy(function(s,o,u){this._getBase().set(e.mobile.path.get()),n.xhr=s,n.textStatus=o,n.errorThrown=u;var a=this._triggerWithDeprecated("loadfailed",n);if(a.deprecatedEvent.isDefaultPrevented()||a.event.isDefaultPrevented())return;r.showLoadMsg&&this._showError(),i.reject(t,r)},this)},_getTransitionHandler:function(t){return t=e.mobile._maybeDegradeTransition(t),e.mobile.transitionHandlers[t]||e.mobile.defaultTransitionHandler},_triggerCssTransitionEvents:function(t,n,r){var i=!1;r=r||"",n&&(t[0]===n[0]&&(i=!0),this._triggerWithDeprecated(r+"hide",{nextPage:t,toPage:t,prevPage:n,samePage:i},n)),this._triggerWithDeprecated(r+"show",{prevPage:n||e(""),toPage:t},t)},_cssTransition:function(t,n,r){var i=r.transition,s=r.reverse,o=r.deferred,u,a;this._triggerCssTransitionEvents(t,n,"before"),this._hideLoading(),u=this._getTransitionHandler(i),a=(new u(i,s,t,n)).transition(),a.done(e.proxy(function(){this._triggerCssTransitionEvents(t,n)},this)),a.done(function(){o.resolve.apply(o,arguments)})},_releaseTransitionLock:function(){s=!1,i.length>0&&e.mobile.changePage.apply(null,i.pop())},_removeActiveLinkClass:function(t){e.mobile.removeActiveLinkClass(t)},_loadUrl:function(t,n,r){r.target=t,r.deferred=e.Deferred(),this.load(t,r),r.deferred.done(e.proxy(function(e,t,r){s=!1,t.absUrl=n.absUrl,this.transition(r,n,t)},this)),r.deferred.fail(e.proxy(function(){this._removeActiveLinkClass(!0),this._releaseTransitionLock(),this._triggerWithDeprecated("changefailed",n)},this))},_triggerPageBeforeChange:function(t,n,r){var i;return n.prevPage=this.activePage,e.extend(n,{toPage:t,options:r}),e.type(t)==="string"?n.absUrl=e.mobile.path.makeUrlAbsolute(t,this._findBaseWithDefault()):n.absUrl=r.absUrl,i=this._triggerWithDeprecated("beforechange",n),i.event.isDefaultPrevented()||i.deprecatedEvent.isDefaultPrevented()?!1:!0},change:function(t,n){if(s){i.unshift(arguments);return}var r=e.extend({},e.mobile.changePage.defaults,n),o={};r.fromPage=r.fromPage||this.activePage;if(!this._triggerPageBeforeChange(t,o,r))return;t=o.toPage,e.type(t)==="string"?(s=!0,this._loadUrl(t,o,r)):this.transition(t,o,r)},transition:function(t,o,u){var a,f,l,c,h,p,d,v,m,g,y,b,w,E;if(s){i.unshift([t,u]);return}if(!this._triggerPageBeforeChange(t,o,u))return;o.prevPage=u.fromPage,E=this._triggerWithDeprecated("beforetransition",o);if(E.deprecatedEvent.isDefaultPrevented()||E.event.isDefaultPrevented())return;s=!0,t[0]===e.mobile.firstPage[0]&&!u.dataUrl&&(u.dataUrl=e.mobile.path.documentUrl.hrefNoHash),a=u.fromPage,f=u.dataUrl&&e.mobile.path.convertUrlToDataUrl(u.dataUrl)||t.jqmData("url"),l=f,c=e.mobile.path.getFilePath(f),h=e.mobile.navigate.history.getActive(),p=e.mobile.navigate.history.activeIndex===0,d=0,v=n.title,m=(u.role==="dialog"||t.jqmData("role")==="dialog")&&t.jqmData("dialog")!==!0;if(a&&a[0]===t[0]&&!u.allowSamePageTransition){s=!1,this._triggerWithDeprecated("transition",o),this._triggerWithDeprecated("change",o),u.fromHashChange&&e.mobile.navigate.history.direct({url:f});return}t.page({role:u.role}),u.fromHashChange&&(d=u.direction==="back"?-1:1);try{n.activeElement&&n.activeElement.nodeName.toLowerCase()!=="body"?e(n.activeElement).blur():e("input:focus, textarea:focus, select:focus").blur()}catch(S){}g=!1,m&&h&&(h.url&&h.url.indexOf(e.mobile.dialogHashKey)>-1&&this.activePage&&!this.activePage.hasClass("ui-dialog")&&e.mobile.navigate.history.activeIndex>0&&(u.changeHash=!1,g=!0),f=h.url||"",!g&&f.indexOf("#")>-1?f+=e.mobile.dialogHashKey:f+="#"+e.mobile.dialogHashKey),y=h?t.jqmData("title")||t.children(":jqmData(role='header')").find(".ui-title").text():v,!!y&&v===n.title&&(v=y),t.jqmData("title")||t.jqmData("title",v),u.transition=u.transition||(d&&!p?h.transition:r)||(m?e.mobile.defaultDialogTransition:e.mobile.defaultPageTransition),!d&&g&&(e.mobile.navigate.history.getActive().pageUrl=l),f&&!u.fromHashChange&&(!e.mobile.path.isPath(f)&&f.indexOf("#")<0&&(f="#"+f),b={transition:u.transition,title:v,pageUrl:l,role:u.role},u.changeHash!==!1&&e.mobile.hashListeningEnabled?e.mobile.navigate(this.window[0].encodeURI(f),b,!0):t[0]!==e.mobile.firstPage[0]&&e.mobile.navigate.history.add(f,b)),n.title=v,e.mobile.activePage=t,this.activePage=t,u.reverse=u.reverse||d<0,w=e.Deferred(),this._cssTransition(t,a,{transition:u.transition,reverse:u.reverse,deferred:w}),w.done(e.proxy(function(n,r,i,s,a){e.mobile.removeActiveLinkClass(),u.duplicateCachedPage&&u.duplicateCachedPage.remove(),a||e.mobile.focusPage(t),this._releaseTransitionLock(),this._triggerWithDeprecated("transition",o),this._triggerWithDeprecated("change",o)},this))},_findBaseWithDefault:function(){var t=this.activePage&&e.mobile.getClosestBaseUrl(this.activePage);return t||e.mobile.path.documentBase.hrefNoHash}}),e.mobile.navreadyDeferred=e.Deferred();var i=[],s=!1}(e),function(e,r){function f(e){while(e){if(typeof e.nodeName=="string"&&e.nodeName.toLowerCase()==="a")break;e=e.parentNode}return e}var i=e.Deferred(),s=e.Deferred(),o=function(){s.resolve(),s=null},u=e.mobile.path.documentUrl,a=null;e.mobile.loadPage=function(t,n){var r;return n=n||{},r=n.pageContainer||e.mobile.pageContainer,n.deferred=e.Deferred(),r.pagecontainer("load",t,n),n.deferred.promise()},e.mobile.back=function(){var n=t.navigator;this.phonegapNavigationEnabled&&n&&n.app&&n.app.backHistory?n.app.backHistory():e.mobile.pageContainer.pagecontainer("back")},e.mobile.focusPage=function(e){var t=e.find("[autofocus]"),n=e.find(".ui-title:eq(0)");if(t.length){t.focus();return}n.length?n.focus():e.focus()},e.mobile._maybeDegradeTransition=e.mobile._maybeDegradeTransition||function(e){return e},e.mobile.changePage=function(t,n){e.mobile.pageContainer.pagecontainer("change",t,n)},e.mobile.changePage.defaults={transition:r,reverse:!1,changeHash:!0,fromHashChange:!1,role:r,duplicateCachedPage:r,pageContainer:r,showLoadMsg:!0,dataUrl:r,fromPage:r,allowSamePageTransition:!1},e.mobile._registerInternalEvents=function(){var n=function(t,n){var r,i=!0,s,o,f;return!e.mobile.ajaxEnabled||t.is(":jqmData(ajax='false')")||!t.jqmHijackable().length||t.attr("target")?!1:(r=a&&a.attr("formaction")||t.attr("action"),f=(t.attr("method")||"get").toLowerCase(),r||(r=e.mobile.getClosestBaseUrl(t),f==="get"&&(r=e.mobile.path.parseUrl(r).hrefNoSearch),r===e.mobile.path.documentBase.hrefNoHash&&(r=u.hrefNoSearch)),r=e.mobile.path.makeUrlAbsolute(r,e.mobile.getClosestBaseUrl(t)),e.mobile.path.isExternal(r)&&!e.mobile.path.isPermittedCrossDomainRequest(u,r)?!1:(n||(s=t.serializeArray(),a&&a[0].form===t[0]&&(o=a.attr("name"),o&&(e.each(s,function(e,t){if(t.name===o)return o="",!1}),o&&s.push({name:o,value:a.attr("value")}))),i={url:r,options:{type:f,data:e.param(s),transition:t.jqmData("transition"),reverse:t.jqmData("direction")==="reverse",reloadPage:!0}}),i))};e.mobile.document.delegate("form","submit",function(t){var r;t.isDefaultPrevented()||(r=n(e(this)),r&&(e.mobile.changePage(r.url,r.options),t.preventDefault()))}),e.mobile.document.bind("vclick",function(t){var r,i,s=t.target,o=!1;if(t.which>1||!e.mobile.linkBindingEnabled)return;a=e(s);if(e.data(s,"mobile-button")){if(!n(e(s).closest("form"),!0))return;s.parentNode&&(s=s.parentNode)}else{s=f(s);if(!s||e.mobile.path.parseUrl(s.getAttribute("href")||"#").hash==="#")return;if(!e(s).jqmHijackable().length)return}~s.className.indexOf("ui-link-inherit")?s.parentNode&&(i=e.data(s.parentNode,"buttonElements")):i=e.data(s,"buttonElements"),i?s=i.outer:o=!0,r=e(s),o&&(r=r.closest(".ui-btn")),r.length>0&&!r.hasClass("ui-state-disabled")&&(e.mobile.removeActiveLinkClass(!0),e.mobile.activeClickedLink=r,e.mobile.activeClickedLink.addClass(e.mobile.activeBtnClass))}),e.mobile.document.bind("click",function(n){if(!e.mobile.linkBindingEnabled||n.isDefaultPrevented())return;var i=f(n.target),s=e(i),o=function(){t.setTimeout(function(){e.mobile.removeActiveLinkClass(!0)},200)},a,l,c,h,p,d,v;e.mobile.activeClickedLink&&e.mobile.activeClickedLink[0]===n.target.parentNode&&o();if(!i||n.which>1||!s.jqmHijackable().length)return;if(s.is(":jqmData(rel='back')"))return e.mobile.back(),!1;a=e.mobile.getClosestBaseUrl(s),l=e.mobile.path.makeUrlAbsolute(s.attr("href")||"#",a);if(!e.mobile.ajaxEnabled&&!e.mobile.path.isEmbeddedPage(l)){o();return}if(l.search("#")!==-1&&(!e.mobile.path.isExternal(l)||!e.mobile.path.isAbsoluteUrl(l))){l=l.replace(/[^#]*#/,"");if(!l){n.preventDefault();return}e.mobile.path.isPath(l)?l=e.mobile.path.makeUrlAbsolute(l,a):l=e.mobile.path.makeUrlAbsolute("#"+l,u.hrefNoHash)}c=s.is("[rel='external']")||s.is(":jqmData(ajax='false')")||s.is("[target]"),h=c||e.mobile.path.isExternal(l)&&!e.mobile.path.isPermittedCrossDomainRequest(u,l);if(h){o();return}p=s.jqmData("transition"),d=s.jqmData("direction")==="reverse"||s.jqmData("back"),v=s.attr("data-"+e.mobile.ns+"rel")||r,e.mobile.changePage(l,{transition:p,reverse:d,role:v,link:s}),n.preventDefault()}),e.mobile.document.delegate(".ui-page","pageshow.prefetch",function(){var t=[];e(this).find("a:jqmData(prefetch)").each(function(){var n=e(this),r=n.attr("href");r&&e.inArray(r,t)===-1&&(t.push(r),e.mobile.loadPage(r,{role:n.attr("data-"+e.mobile.ns+"rel"),prefetch:!0}))})}),e.mobile.pageContainer.pagecontainer(),e.mobile.document.bind("pageshow",function(){s?s.done(e.mobile.resetActivePageHeight):e.mobile.resetActivePageHeight()}),e.mobile.window.bind("throttledresize",e.mobile.resetActivePageHeight)},e(function(){i.resolve()}),n.readyState==="complete"?o():e.mobile.window.load(o),e.when(i,e.mobile.navreadyDeferred).done(function(){e.mobile._registerInternalEvents()})}(e),function(e){var t="ui-loader",n=e("html");e.widget("mobile.loader",{options:{theme:"a",textVisible:!1,html:"",text:"loading"},defaultHtml:"<div class='"+t+"'>"+"<span class='ui-icon-loading'></span>"+"<h1></h1>"+"</div>",fakeFixLoader:function(){var t=e("."+e.mobile.activeBtnClass).first();this.element.css({top:e.support.scrollTop&&this.window.scrollTop()+this.window.height()/2||t.length&&t.offset().top||100})},checkLoaderPosition:function(){var t=this.element.offset(),n=this.window.scrollTop(),r=e.mobile.getScreenHeight();if(t.top<n||t.top-n>r)this.element.addClass("ui-loader-fakefix"),this.fakeFixLoader(),this.window.unbind("scroll",this.checkLoaderPosition).bind("scroll",e.proxy(this.fakeFixLoader,this))},resetHtml:function(){this.element.html(e(this.defaultHtml).html())},show:function(r,i,s){var o,u,a;this.resetHtml(),e.type(r)==="object"?(a=e.extend({},this.options,r),r=a.theme):(a=this.options,r=r||a.theme),u=i||(a.text===!1?"":a.text),n.addClass("ui-loading"),o=a.textVisible,this.element.attr("class",t+" ui-corner-all ui-body-"+r+" ui-loader-"+(o||i||r.text?"verbose":"default")+(a.textonly||s?" ui-loader-textonly":"")),a.html?this.element.html(a.html):this.element.find("h1").text(u),this.element.appendTo(e.mobile.pagecontainer?e(":mobile-pagecontainer"):e("body")),this.checkLoaderPosition(),this.window.bind("scroll",e.proxy(this.checkLoaderPosition,this))},hide:function(){n.removeClass("ui-loading"),this.options.text&&this.element.removeClass("ui-loader-fakefix"),this.window.unbind("scroll",this.fakeFixLoader),this.window.unbind("scroll",this.checkLoaderPosition)}})}(e,this),function(e,t,r){function o(){i.removeClass("ui-mobile-rendering")}var i=e("html"),s=e.mobile.window;e(t.document).trigger("mobileinit");if(!e.mobile.gradeA())return;e.mobile.ajaxBlacklist&&(e.mobile.ajaxEnabled=!1),i.addClass("ui-mobile ui-mobile-rendering"),setTimeout(o,5e3),e.extend(e.mobile,{initializePage:function(){var t=e.mobile.path,i=e(":jqmData(role='page'), :jqmData(role='dialog')"),u=t.stripHash(t.stripQueryParams(t.parseLocation().hash)),a=e.mobile.path.parseLocation(),f=u?n.getElementById(u):r;i.length||(i=e("body").wrapInner("<div data-"+e.mobile.ns+"role='page'></div>").children(0)),i.each(function(){var n=e(this);n[0].getAttribute("data-"+e.mobile.ns+"url")||n.attr("data-"+e.mobile.ns+"url",n.attr("id")||t.convertUrlToDataUrl(a.pathname+a.search))}),e.mobile.firstPage=i.first(),e.mobile.pageContainer=e.mobile.firstPage.parent().addClass("ui-mobile-viewport").pagecontainer(),e.mobile.navreadyDeferred.resolve(),s.trigger("pagecontainercreate"),e.mobile.loading("show"),o(),!e.mobile.hashListeningEnabled||!e.mobile.path.isHashValid(location.hash)||!e(f).is(":jqmData(role='page')")&&!e.mobile.path.isPath(u)&&u!==e.mobile.dialogHashKey?(e.event.special.navigate.isPushStateEnabled()&&e.mobile.navigate.navigator.squash(t.parseLocation().href),e.mobile.changePage(e.mobile.firstPage,{transition:"none",reverse:!0,changeHash:!1,fromHashChange:!0})):e.event.special.navigate.isPushStateEnabled()?(e.mobile.navigate.history.stack=[],e.mobile.navigate(e.mobile.path.isPath(location.hash)?location.hash:location.href)):s.trigger("hashchange",[!0])}}),e(function(){e.support.inlineSVG(),e.mobile.hideUrlBar&&t.scrollTo(0,1),e.mobile.defaultHomeScroll=!e.support.scrollTop||e.mobile.window.scrollTop()===1?0:1,e.mobile.autoInitializePage&&e.mobile.initializePage(),e.mobile.hideUrlBar&&s.load(e.mobile.silentScroll),e.support.cssPointerEvents||e.mobile.document.delegate(".ui-state-disabled,.ui-disabled","vclick",function(e){e.preventDefault(),e.stopImmediatePropagation()})})}(e,this),function(e,t){function i(){return++n}function s(e){return e.hash.length>1&&decodeURIComponent(e.href.replace(r,""))===decodeURIComponent(location.href.replace(r,""))}var n=0,r=/#.*$/;e.widget("ui.tabs",{version:"fadf2b312a05040436451c64bbfaf4814bc62c56",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var t=this,n=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",n.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),n.active=this._initialActive(),e.isArray(n.disabled)&&(n.disabled=e.unique(n.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.options.active!==!1&&this.anchors.length?this.active=this._findActive(n.active):this.active=e(),this._refresh(),this.active.length&&this.load(n.active)},_initialActive:function(){var t=this.options.active,n=this.options.collapsible,r=location.hash.substring(1);if(t===null){r&&this.tabs.each(function(n,i){if(e(i).attr("aria-controls")===r)return t=n,!1}),t===null&&(t=this.tabs.index(this.tabs.filter(".ui-tabs-active")));if(t===null||t===-1)t=this.tabs.length?0:!1}return t!==!1&&(t=this.tabs.index(this.tabs.eq(t)),t===-1&&(t=n?!1:0)),!n&&t===!1&&this.anchors.length&&(t=0),t},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(t){var n=e(this.document[0].activeElement).closest("li"),r=this.tabs.index(n),i=!0;if(this._handlePageNav(t))return;switch(t.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:r++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:i=!1,r--;break;case e.ui.keyCode.END:r=this.anchors.length-1;break;case e.ui.keyCode.HOME:r=0;break;case e.ui.keyCode.SPACE:t.preventDefault(),clearTimeout(this.activating),this._activate(r);return;case e.ui.keyCode.ENTER:t.preventDefault(),clearTimeout(this.activating),this._activate(r===this.options.active?!1:r);return;default:return}t.preventDefault(),clearTimeout(this.activating),r=this._focusNextTab(r,i),t.ctrlKey||(n.attr("aria-selected","false"),this.tabs.eq(r).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",r)},this.delay))},_panelKeydown:function(t){if(this._handlePageNav(t))return;t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(t){if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_UP)return this._activate(this._focusNextTab(this.options.active-1,!1)),!0;if(t.altKey&&t.keyCode===e.ui.keyCode.PAGE_DOWN)return this._activate(this._focusNextTab(this.options.active+1,!0)),!0},_findNextTab:function(t,n){function i(){return t>r&&(t=0),t<0&&(t=r),t}var r=this.tabs.length-1;while(e.inArray(i(),this.options.disabled)!==-1)t=n?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,t){if(e==="active"){this._activate(t);return}if(e==="disabled"){this._setupDisabled(t);return}this._super(e,t),e==="collapsible"&&(this.element.toggleClass("ui-tabs-collapsible",t),!t&&this.options.active===!1&&this._activate(0)),e==="event"&&this._setupEvents(t),e==="heightStyle"&&this._setupHeightStyle(t)},_tabId:function(e){return e.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,n=this.tablist.children(":has(a[href])");t.disabled=e.map(n.filter(".ui-state-disabled"),function(e){return n.index(e)}),this._processTabs(),t.active===!1||!this.anchors.length?(t.active=!1,this.active=e()):this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(n,r){var i,o,u,a=e(r).uniqueId().attr("id"),f=e(r).closest("li"),l=f.attr("aria-controls");s(r)?(i=r.hash,o=t.element.find(t._sanitizeSelector(i))):(u=t._tabId(f),i="#"+u,o=t.element.find(i),o.length||(o=t._createPanel(u),o.insertAfter(t.panels[n-1]||t.tablist)),o.attr("aria-live","polite")),o.length&&(t.panels=t.panels.add(o)),l&&f.data("ui-tabs-aria-controls",l),f.attr({"aria-controls":i.substring(1),"aria-labelledby":a}),o.attr("aria-labelledby",a)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var n=0,r;r=this.tabs[n];n++)t===!0||e.inArray(n,t)!==-1?e(r).addClass("ui-state-disabled").attr("aria-disabled","true"):e(r).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var n={click:function(e){e.preventDefault()}};t&&e.each(t.split(" "),function(e,t){n[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,n),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var n,r=this.element.parent();t==="fill"?(n=r.height(),n-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),r=t.css("position");if(r==="absolute"||r==="fixed")return;n-=t.outerHeight(!0)}),this.element.children().not(this.panels).each(function(){n-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,n-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):t==="auto"&&(n=0,this.panels.each(function(){n=Math.max(n,e(this).height("").height())}).height(n))},_eventHandler:function(t){var n=this.options,r=this.active,i=e(t.currentTarget),s=i.closest("li"),o=s[0]===r[0],u=o&&n.collapsible,a=u?e():this._getPanelForTab(s),f=r.length?this._getPanelForTab(r):e(),l={oldTab:r,oldPanel:f,newTab:u?e():s,newPanel:a};t.preventDefault();if(s.hasClass("ui-state-disabled")||s.hasClass("ui-tabs-loading")||this.running||o&&!n.collapsible||this._trigger("beforeActivate",t,l)===!1)return;n.active=u?!1:this.tabs.index(s),this.active=o?e():s,this.xhr&&this.xhr.abort(),!f.length&&!a.length&&e.error("jQuery UI Tabs: Mismatching fragment identifier."),a.length&&this.load(this.tabs.index(s),t),this._toggle(t,l)},_toggle:function(t,n){function o(){r.running=!1,r._trigger("activate",t,n)}function u(){n.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),i.length&&r.options.show?r._show(i,r.options.show,o):(i.show(),o())}var r=this,i=n.newPanel,s=n.oldPanel;this.running=!0,s.length&&this.options.hide?this._hide(s,this.options.hide,function(){n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),u()}):(n.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),s.hide(),u()),s.attr({"aria-expanded":"false","aria-hidden":"true"}),n.oldTab.attr("aria-selected","false"),i.length&&s.length?n.oldTab.attr("tabIndex",-1):i.length&&this.tabs.filter(function(){return e(this).attr("tabIndex")===0}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}),n.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(t){var n,r=this._findActive(t);if(r[0]===this.active[0])return;r.length||(r=this.active),n=r.find(".ui-tabs-anchor")[0],this._eventHandler({target:n,currentTarget:n,preventDefault:e.noop})},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return typeof e=="string"&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),n=t.data("ui-tabs-aria-controls");n?t.attr("aria-controls",n).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),this.options.heightStyle!=="content"&&this.panels.css("height","")},enable:function(n){var r=this.options.disabled;if(r===!1)return;n===t?r=!1:(n=this._getIndex(n),e.isArray(r)?r=e.map(r,function(e){return e!==n?e:null}):r=e.map(this.tabs,function(e,t){return t!==n?t:null})),this._setupDisabled(r)},disable:function(n){var r=this.options.disabled;if(r===!0)return;if(n===t)r=!0;else{n=this._getIndex(n);if(e.inArray(n,r)!==-1)return;e.isArray(r)?r=e.merge([n],r).sort():r=[n]}this._setupDisabled(r)},load:function(t,n){t=this._getIndex(t);var r=this,i=this.tabs.eq(t),o=i.find(".ui-tabs-anchor"),u=this._getPanelForTab(i),a={tab:i,panel:u};if(s(o[0]))return;this.xhr=e.ajax(this._ajaxSettings(o,n,a)),this.xhr&&this.xhr.statusText!=="canceled"&&(i.addClass("ui-tabs-loading"),u.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){u.html(e),r._trigger("load",n,a)},1)}).complete(function(e,t){setTimeout(function(){t==="abort"&&r.panels.stop(!1,!0),i.removeClass("ui-tabs-loading"),u.removeAttr("aria-busy"),e===r.xhr&&delete r.xhr},1)}))},_ajaxSettings:function(t,n,r){var i=this;return{url:t.attr("href"),beforeSend:function(t,s){return i._trigger("beforeLoad",n,e.extend({jqXHR:t,ajaxSettings:s},r))}}},_getPanelForTab:function(t){var n=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+n))}})}(e),function(e,t){}(e)});
(function(W,$){
	W.vs =  W.vs || {};

	W.vs.FlexiCarousel = function(el, opts){ 
			this.element = el || {}; 
			this.items = opts.items || {};
			this.carouselClass= opts.carouselClass || '';
			this.captionClass= opts.captionClass || '';
			this.arrowLeft = opts.arrowLeft || null;
			this.arrowRight = opts.arrowRight || null; 
			this.lightboxSel = opts.lightboxSel || false;
			this.lightboxEl = null;
			this.lightboxCaption = null;
			this.hideOnImageClick = opts.hideOnImageClick || false;
	};

	W.vs.FlexiCarousel.boot = function(){
		$('[data-flexi-carousel]').each(function(k,o){ 
			if(!$(this).data('__FLEXI_CAROUSEL__')){
				$(this).data('__FLEXI_CAROUSEL__', new W.vs.FlexiCarousel(this));
			}
		});
	};

	W.vs.FlexiCarousel.prototype = {
		onClick: function(event){
			var caption = $(event.target).next('').html(); 
			this.element.carousel('pause');  
			this.lightboxEl.addClass('active').show(); 
			this.lightboxCaptionEl.text(caption);
			this.lightboxImageEl.css('background-image',  'url(' + $(event.currentTarget).find('img').attr('src') + ')' );
		}, 
		onHide:function(event){
			console.log('olja')
			this.lightboxEl.removeClass('active').hide(); 
		},
		render: function(){
			var elId = this.element.attr('id'),
				innerEl = this.element.find('.carousel-inner'),
				items = null;
			innerEl = innerEl.length === 0?$('<div class="carousel-inner" role="listbox"></div>').appendTo(this.element):innerEl; 
			items = innerEl.addClass(this.carouselClass).find('.item');
			items = items.length === 0?innerEl.append([].concat(this.items.map(function(v,k){ 
						return '<div class="item '+((k===0)?'active':'')+'"><img src="'+v.src+'"><div class="carousel-caption">'+v.caption+'</div></div>'; 
					}),['<a class="left carousel-control" href="#'+elId+'" role="button" data-slide="prev"><span aria-hidden="true" class="glyphicon-chevron-left">'+this.arrowLeft+'</span></a>',
						'<a class="right carousel-control" href="#'+elId+'" role="button" data-slide="next"><span aria-hidden="true" class="glyphicon-chevron-right">'+this.arrowRight+'</span></a>']).join('')):items; 
			this.element.find('.carousel-caption').addClass(this.captionClass);
		 	if(this.lightboxSel){
				this.lightboxEl = $([
							'<div class="'+this.lightboxSel.substring(1)+'">',
								'<div class="lightbox-overlay">',
								'</div>',
								'<div class="lightbox-container">',
									'<div class="lightbox-image"></div>',
									'<div class="lightbox-caption"></div>',
								'</div>',
							'</div>'
						].join('')).appendTo(this.element).hide();
				this.lightboxCaptionEl = this.lightboxEl.find('.lightbox-caption');
				this.lightboxImageEl = this.lightboxEl.find('.lightbox-image');
				$('.item').on('click', $.proxy(this.onClick, this));
				$('.lightbox').on('click', $.proxy(this.onHide, this));
				if(this.hideOnImageClick){
					$('.lightbox-container').on('click', function(e){
						e.stopPropagation();
					});
				}
			}
			this.element.on('swiperight', $.proxy(this.onSwipeRight, this));
			this.element.on('swipeleft', $.proxy(this.onSwipeLeft, this));  
		},
		onSwipeLeft: function(el){
			this.element.carousel('next');
		},
		onSwipeRight: function(el){
			this.element.carousel('prev');
		}
	};

	$.fn.FlexiCarousel = function(options){
		return this.each(function(){ 
			$(this).data('__FLEXI_CAROUSEL__', (p = new W.vs.FlexiCarousel($(this), options)).render());
		});
	};

	$(document).ready(function(){
		W.vs.FlexiCarousel.boot(); 
	});

})(window,jQuery);
