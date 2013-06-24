Ext.define('Ext.ux.ListOptions', {
    mixins: ['Ext.mixin.Observable'],
    xtype : 'listopt',
    requires: [
        'Ext.Anim'
    ],

    config: {
        /**
        * Selector to use to get the dynamically created List Options Ext.Element (where the menu options are held)
        * Once created the List Options element will be used again and again.
        */
        optionsSelector: 'x-list-options',

        /**
        * An array of objects to be applied to the 'listOptionsTpl' to create the
        * menu
        */
        menuOptions: [],

        /**
        * Selector to use to get individual List Options within the created Ext.Element
        * This is used when attaching event handlers to the menu options
        */
        menuOptionSelector: 'x-menu-option',

        /**
        * XTemplate to use to create the List Options view
        */
        menuOptionsTpl: new Ext.XTemplate(
            '<ul class="x-button">',
                '<tpl for=".">',
                    '<li class="x-menu-option">',
                        '<a>',
                            '<span class="x-button-icon x-shown {iconCls}">',
                            '</span>',
                        '</a>',
                    '</li>',
                '</tpl>',
            '</ul>'
        ).compile(),

        /**
        * CSS Class that is applied to the tapped Menu Option while it is being touched
        */
        menuOptionPressedClass: 'x-menu-option-pressed',

        /**
        * Set to a function that takes in 2 arguments - your initial 'menuOptions' config option and the current
        * item's Model instance
        * The function must return either the original 'menuOptions' variable or a revised one
        */
        menuOptionDataFilter: null,

        /**
        * Animation used to reveal the List Options
        */
        revealAnimation: {
            reverse: false,
            type: 'slide',
            duration: 500
        },

        /**
        * The direction the List Item will slide to reveal the List Options
        * Possible values: 'left', 'right' and 'both'
        * setting to 'both' means it will be decided by the direction of the User's swipe if 'triggerEvent' is set to 'itemswipe'
        */
        revealDirection: 'both',

        /**
        * Distance (in pixels) a User must swipe before triggering the List Options to be displayed.
        * Set to -1 to disable threshold checks
        */
        swipeThreshold: 30,

        /**
        * The direction the user must swipe to reveal the menu
        * Only applicable when 'triggerEvent' is set to 'itemswipe'
        */
        swipeDirection: 'both',

        /**
        * Ext.DataView event used to trigger the menu reveal
        * Usual values are 'itemswipe', 'itemtap', 'itemdoubletap'
        * Notes:
        * itemswipe: see configs 'swipeThreshold' & 'swipeDirection'
        */
        triggerEvent: 'itemswipe',

        /**
        * Stops the List from scrolling when a List Options menu is about to be opened
        */
        stopScrollOnShow: true,

        /**
        * Decides whether the visible List Options menu is hidden when the List is scrolled
        */
        hideOnScroll: true,

        /**
        * Decides whether multiple List Options can be visible at once
        */
        allowMultiple: false,

        /**
        * Decides whether sound effects are played as List Options open
        * Defaults to false.
        */
        enableSoundEffects: false,

        openSoundEffectURL: 'sounds/open.wav',

        closeSoundEffectURL: ''
    },

    constructor: function(config) {
        this.initConfig(config);
        this.callParent(arguments);
    },

    init: function (parent) {
        this.parent = parent;
        this.parent.on(this.getTriggerEvent(), this.onItemSwipe, this);

        this.parent.on({
            destroy: this.onListDestroy,
            scope: this
        });

        //AFTERRENDER
        this.onAfterRender();

        // this.parent.addEvents({
        //     'menuoptiontap': true,
        //     'listoptionsopen': true,
        //     'listoptionsclose': true,
        //     'beforelistoptionstap': true
        // });
    },

    /**
    * Destroy listeners when destroying list
    */
    onListDestroy: function () {
        this.parent.removeListener(this.getTriggerEvent(), this.onItemSwipe, this);
        this.parent.removeListener('afterrender', this.onAfterRender, this);
        this.parent.getScrollable().getScroller().removeListener('scrollstart', this.hideOptionsMenu, this);
    },

    /**
    * Handles the 'afterrender' event
    * Attaches the handler to the List's scroller
    */
    onAfterRender: function () {
        if (this.getHideOnScroll()) {
            this.parent.getScrollable().getScroller().on({
                scrollstart: Ext.bind(this.hideOptionsMenu, this, [], false),
                scope: this
            });
        }

        // add plugin class to the list so its special styles aren't applied globally
        this.parent.addCls('x-list-options-plugin');
    },

    /**
    * Handler for the List's 'itemswipe' event
    * Hides any visible List Options
    * Caches the List Item we're working with
    * Sets some styles needed for it to look right
    * Shows the List Options
    * @param {Object} dataView
    * @param {Object} index
    * @param {Object} item
    * @param {Object} e
    */
    onItemSwipe: function (dataView, index, target, record, eventObject) {
        // check we're over the 'swipethreshold'
        if (this.revealAllowed(eventObject.direction, eventObject.distance)) {

            // set the direction of the reveal
            this.itemSwipeRevealDirection(eventObject.direction);

            // cache the current List Item's elements for easy use later
            this.activeListItemRecord = dataView.getStore().getAt(index);

            var activeEl = Ext.get(target.id); //dataView.getAt(index);

            this.activeListElement = activeEl;

            if (!this.getAllowMultiple()) {
                // hide any visible List Options
                this.hideOptionsMenu();
            }

            activeEl.setVisibilityMode(Ext.Element.VISIBILITY);

            // Show the item's List Options
            this.doShowOptionsMenu(activeEl);
        }
    },

    /**
    * Decide whether the List Options are allowed to be revealed based on the config options
    * Only relevant for 'itemswipe' event because this event has all the config options
    * @param {Object} direction
    * @param {Object} distance
    */
    revealAllowed: function (direction, distance) {
        var allowed = true;
        if (this.getTriggerEvent() === 'itemswipe') {
            // check swipe is long enough
            // check direction of swipe is correct
            allowed = (distance >= this.getSwipeThreshold() && (direction === this.getSwipeDirection() || this.getSwipeDirection() === 'both')) || this.getSwipeThreshold() < 0;
        }
        return allowed;
    },

    /**
    * Decide the direction the reveal animation will go
    * this.getRevealDirection() config can only be 'both' when triggerEvent is 'itemswipe' in which case
    * the direction of the swipe is used
    * @param {Object} direction
    */
    itemSwipeRevealDirection: function (direction) {
        var dir = this.getRevealDirection();
        if (this.getRevealDirection() === 'both' && this.getTriggerEvent() === 'itemswipe') {
            dir = direction;
        }

        Ext.apply(this.getRevealAnimation(), {
            direction: dir
        });
    },

    /**
    * Hides the List Options menu for the specified record or, if that is not defined, hides all List Options
    * @param {Object} record - A record
    */
    hideOptionsMenu: function (record) {
        if (record) {
            var node = this.parent.getNode(record),
                listOptions = Ext.get(node).next('.' + this.getOptionsSelector());

            if (node && listOptions) {
                this.doHideOptionsMenu(Ext.get(node), listOptions);
            }
        } else {
            var multiListOptions = this.parent.element.select('.' + this.getOptionsSelector());

            for (var i = 0; i < multiListOptions.elements.length; i++) {
                this.doHideOptionsMenu(Ext.get(multiListOptions.elements[i]).prev('.x-list-item'), Ext.get(multiListOptions.elements[i]), i === 0);
            }
        }
    },

    /**
    * Performs the List Options animation and hide
    * @param {Object} hiddenEl - the List Item that is hidden
    * @param {Object} activeListOptions - the List Options element that is visible
    */
    doHideOptionsMenu: function (hiddenEl, activeListOptions, playSoundEffect) {
        playSoundEffect = Ext.isEmpty(playSoundEffect) ? true : playSoundEffect;

        // reverse the configured animation so it looks like its going back
        Ext.apply(this.getRevealAnimation(), {
            reverse: true
        });

        // Run the animation on the List Item's 'body' Ext.Element
        Ext.Anim.run(hiddenEl, this.getRevealAnimation(), {
            out: false,
            before: function (el, options) {
                // force the List Options to the back
                activeListOptions.setStyle('z-index', '0');

                // show the List Item's 'body' so the animation can be seen
                //hiddenEl.show();
                this.showItem(hiddenEl);

                if (this.getEnableSoundEffects() && !Ext.isEmpty(this.getCloseSoundEffectURL()) && playSoundEffect) {
                    var audio = document.createElement('audio');
                    audio.setAttribute('src', this.getCloseSoundEffectURL());
                    audio.play();
                }
            },
            after: function (el, options) {
                //hiddenEl.show();
                // this.showItem(hiddenEl);

                // remove the ListOptions DIV completely to save some resources
                activeListOptions.destroy();
                Ext.removeNode(Ext.getDom(activeListOptions));

                this.parent.fireEvent('listoptionsclose');
            },
            scope: this
        });
    },

    /**
    * Perform the List Option animation and show
    * @param {Object} listItemEl - the List Item's element to show a menu for
    */
    doShowOptionsMenu: function (listItemEl) {
        if (this.getStopScrollOnShow()) {
            this.parent.getScrollable().getScroller().setDisabled(true);
        }

        // ensure the animation is not reversed
        Ext.apply(this.getRevealAnimation(), {
            reverse: false
        });

        // Do the animation on the current
        Ext.Anim.run(listItemEl, this.getRevealAnimation(), {
            out: true,
            before: function (el, options) {
                // Create the List Options Ext.Element
                this.createOptionsMenu(listItemEl);

                if (this.getEnableSoundEffects() && !Ext.isEmpty(this.getOpenSoundEffectURL())) {
                    var audio = document.createElement('audio');
                    audio.setAttribute('src', this.getOpenSoundEffectURL());
                    audio.play();
                }
            },
            after: function (el, options) {
                //listItemEl.hide(); // hide the List Item
                // this.hideItem(listItemEl);

                this.parent.fireEvent('listoptionsopen');

                // re-enable the scroller
                if (this.getStopScrollOnShow()) {
                    this.parent.getScrollable().getScroller().setDisabled(false);
                }
            },
            scope: this
        });
    },

    /**
    * Used to process the menuOptions data prior to applying it to the menuOptions template
    */
    processMenuOptionsData: function () {
        return (Ext.isFunction(this.getMenuOptionDataFilter())) ? this.getMenuOptionDataFilter()(this.getMenuOptions(), this.activeListItemRecord) : this.getMenuOptions();
    },

    /**
    * Get the existing or create a new List Options Ext.Element and return and cache it
    * @param {Object} listItem
    */
    createOptionsMenu: function (listItemEl) {
        var listItemElHeight = listItemEl.getHeight();

        // Create the List Options element
        this.activeListOptions = Ext.DomHelper.insertAfter(listItemEl, {
            cls: this.getOptionsSelector(),
            html: this.getMenuOptionsTpl().apply(this.processMenuOptionsData())
        }, true).setHeight(listItemElHeight).setStyle('margin-top', (-1 * listItemElHeight) + 'px');

        // Add tap handlers to the List Option's menu items
        var listQueryItems = this.activeListOptions.select('.' + this.getMenuOptionSelector()).elements;
        for(var i=0; i< listQueryItems.length; i++)
        {
            Ext.get(listQueryItems[i]).on({
                touchstart: this.onListOptionTabStart,
                touchend: this.onListOptionTapEnd,
                tapcancel: this.onListOptionTabCancel,
                scope: this
            });
        }

        // attach event handler to options element to close it when tapped
        this.activeListOptions.on({
            tap: Ext.bind(this.doHideOptionsMenu, this, [this.activeListElement, this.activeListOptions], false),
            scope: this
        });

        return this.activeListOptions;
    },

    /**
    * Handler for 'touchstart' event to add the Pressed class
    * @param {Object} e
    * @param {Object} el
    */
    onListOptionTabStart: function (e, el) {
        var menuOption = e.getTarget('.' + this.getMenuOptionSelector());

        // get the menu item's data
        var itemIndex = this.getIndex(menuOption);
        var menuItemData = this.processMenuOptionsData()[itemIndex];
        var recordItem = this.parent.getStore().getAt(itemIndex);

        if (this.parent.fireEvent('beforelistoptionstap', menuItemData, recordItem) === true) {
            this.addPressedClass(e);
        } else {
            this.TapCancelled = true;
        }
    },

    /**
    * Handler for 'tapcancel' event
    * Sets TapCancelled value to stop TapEnd function from executing and removes Pressed class
    * @param {Object} e
    * @param {Object} el
    */
    onListOptionTabCancel: function (e, el) {
        this.TapCancelled = true;
        this.removePressedClass(e);
    },

    /**
    * Handler for the 'tap' event of the individual List Option menu items
    * @param {Object} e
    */
    onListOptionTapEnd: function (e, el) {
        if (!this.TapCancelled) {
            // Remove the Pressed class
            this.removePressedClass(e);

            var menuOption = e.getTarget('.' + this.getMenuOptionSelector());

            // get the menu item's data
            var itemIndex = this.getIndex(menuOption);
            var menuItemData = this.processMenuOptionsData()[itemIndex];
            var recordItem = this.parent.getStore().getAt(itemIndex);

            this.parent.fireEvent('menuoptiontap', menuItemData, recordItem);
        }
        this.TapCancelled = false;

        // stop menu from hiding
        e.stopPropagation();
    },

    /**
    * Adds the Pressed class on the Menu Option
    * @param {Object} e
    */
    addPressedClass: function (e) {
        if (Ext.fly(e.getTarget('.' + this.getMenuOptionSelector()))) {
            Ext.fly(e.getTarget('.' + this.getMenuOptionSelector())).addCls(this.getMenuOptionPressedClass());
        }
    },

    /**
    * Removes the Pressed class on the Menu Option
    * @param {Object} e
    */
    removePressedClass: function (e) {
        if (Ext.fly(e.getTarget('.' + this.getMenuOptionSelector()))) {
            Ext.fly(e.getTarget('.' + this.getMenuOptionSelector())).removeCls(this.getMenuOptionPressedClass());
        }
    },

    /**
    * Helper method to get the index of the List Option that was tapped
    * @param {Object} el - the tapped node
    */
    getIndex: function (el) {
        var listOptions = Ext.get(Ext.get(el).findParent('.' + this.getOptionsSelector())).select('.' + this.getMenuOptionSelector());

        for (var i = 0; i < listOptions.elements.length; i++) {
            if (listOptions.elements[i].id === el.id) {
                return i;
            }
        }
        return -1;
    },
    /**
     * Hides this Component
     * @param {Object/Boolean} animation (optional)
     */
    hideItem: function(item, animation) {
        var hidden = (document.getElementById(item.id).style.visibility == 'hidden');
        if (!hidden) {
            if (animation === undefined || (animation && animation.isComponent)) {
                animation = 'fadeOut';//item.getHideAnimation();
            }
            if (animation) {
                if (animation === true) {
                    animation = 'fadeOut';
                }
                item.onBefore({
                    hiddenchange: 'animateFn',
                    scope: item,
                    single: true,
                    args: [animation]
                });
            }
            item.setVisibility(false);
        }
        return item;
    },

    /**
     * Shows this component
     * @param {Object/Boolean} animation (optional)
     */
    showItem: function(item, animation) {
        var hidden = (document.getElementById(item.id).style.visibility == 'hidden');
        if (hidden || hidden === null) {
            if (animation === true) {
                animation = 'fadeIn';
            }
            else if (animation === undefined || (animation && animation.isComponent)) {
                animation = 'fadeIn';//item.getShowAnimation();
            }

            if (animation) {
                item.onBefore({
                    hiddenchange: 'animateFn',
                    scope: item,
                    single: true,
                    args: [animation]
                });
            }

            item.setVisibility(true);
        }

        return item;
    }

});
