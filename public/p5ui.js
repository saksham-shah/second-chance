/*! p5ui.js pre-v1.0.0 July 15, 2020 - by Saksham Shah */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/core/main.js
/*
Options:
    - width (900)
    - height (600)
    - buffer (0.9): the maximum proportion of the width and height of the screen that can be taken up by the UI
    NOTE: the width and height are NOT pixel values.
    They are just reference values to allow you to size all of the elements appropriately.
    It is recommended to use values with many factors so you can easily divide the screen as needed.

    - popupHeader(30): the height of the header bar in popups
    - popupPadding (5): the padding of the header bar in popups

    - tooltipHeight (25): the height of tooltips
    - tooltipPadding (5): the padding of tooltip text
*/

class P5UI {
    constructor(options) {
        this.screenPosition = {
            x: 0,
            y: 0,
            z: 1
        }

        this.width = options.width || 900;
        this.height = options.height || 600;
        this.buffer = options.buffer || 0.9;

        this.popupHeader = options.popupHeader || 30;
        this.popupPadding = options.popupPadding || 5;

        this.tooltipHeight = options.tooltipHeight || 25;
        this.tooltipPadding = options.tooltipPadding || 5;
        this.tooltipTextSize = this.tooltipHeight - 2 * this.tooltipPadding;

        this.screen = null;
        this.popups = [];

        this.screens = new Map();

        this.labelledElements = new Map();

        this.textboxes = [];

        this.themes = new Map();
        this.theme = 'default';

        this.cursors = {};
        this.sounds = {};
    }

    setupUI() {
        rectMode(CENTER);

        this.resizeUI();

        this.setTheme('default');

        this.cursor = new P5UI.Cursor(this);

        let self = this;

        document.addEventListener('keydown', e => {
            if (e.key == 'Tab' || e.key == 'Alt') e.preventDefault();
            self.getActiveScreen().emit('keyType', e);
            self.cursor.showTooltip = false;
        });
    
        canvas.addEventListener('wheel', e => {
            self.getActiveScreen().emit('mouseWheel', e);
            self.cursor.showTooltip = false;
        });

        window.mousePressed = e => {
            self.getActiveScreen().emit('mouseDown', e);
            self.cursor.showTooltip = false;
            window.focus();
            return false;
        }
        
        window.mouseReleased = e => {
            self.getActiveScreen().emit('mouseUp', e);
            return false;
        }
        
        window.keyPressed = e => {
            if (e.key == 'Escape' && this.popups.length > 0) {
                this.closePopup();
                                
            } else {
                self.getActiveScreen().emit('keyDown', e);
                self.cursor.showTooltip = false;
            }
        }
        
        window.keyReleased = e => {
            self.getActiveScreen().emit('keyUp', e);
        }
    }

    addScreen(screenName, options = {}) {
        options.p5ui = this;
        let scr = new P5UI.Screen(options);
        this.screens.set(screenName, scr);
        return scr;
    }

    addPopup(popupName, options = {}) {
        options.p5ui = this;
        let popup = new P5UI.Popup(options);
        this.screens.set(popupName, popup);
        return popup;
    }

    getScreen(screenName) {
        return this.screens.get(screenName);
    }

    setScreen(screenName) {
        let oldScr = this.screen;
        let newScr = this.getScreen(screenName);
        if (newScr == undefined) {
            console.warn(` Failed to change screen - '${screenName}' does not exist.`)
            return;
        }

        this.screen = newScr;

        if (oldScr != null) {
            oldScr._changeScreen(true, oldScr, newScr);
        }

        newScr._changeScreen(false, oldScr, newScr);
        return newScr;
    }

    openPopup(popupName, ...args) {
        let o = this.getScreen(popupName);
        if (o == undefined) {
            console.warn(` Failed to open popup - '${popupName}' does not exist.`)
            return;
        }

        let oldScr = this.getActiveScreen();
        this.popups.push(o);
        
        oldScr._changeScreen(true, oldScr, o);
        o._changeScreen(false, oldScr, o);

        o.onDisplay(...args);
    }

    closePopup() {
        if (this.popups.length > 0) {
            let o = this.popups.pop();
            let newScr = this.getActiveScreen();
    
            o._changeScreen(true, o, newScr);
            newScr._changeScreen(false, o, newScr);
        }
    }

    closeAllPopups() {
        while (this.popups.length > 0) {
            this.closePopup();
        }
    }

    getActiveScreen() {
        if (this.popups.length == 0) return this.screen;
        return this.popups[this.popups.length - 1];
    }

    addElement(element, label) {
        this.labelledElements.set(label, element);
    }

    getElement(label) {
        return this.labelledElements.get(label);
    }

    // questionable, need to check to see if this needs to change
    updateUI() {
        this.cursor.update();
        let activeScreen = this.getActiveScreen();
        activeScreen._update(this.cursor.mousePos);
        this.cursor.setMode(activeScreen._getCursorState());
    }

    drawUI() {
        let backgroundColour = this.screen.getColour('background');
        if (backgroundColour != -1) {
            background(backgroundColour);
        } else {
            // clear();
        }
        push();
        translate(this.screenPosition.x, this.screenPosition.y);
        scale(this.screenPosition.z);

        // Draw all the stuff
        this.screen._show();

        if (this.popups.length > 0) {
            noStroke();
            let popup = this.popups[this.popups.length - 1];

            let backgroundColour = popup.getColour('background')
            if (backgroundColour != -1) {
                fill(backgroundColour);
                rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
            }

            popup._show();
        }

        let strokeColour = this.screen.getColour('stroke');
        if (strokeColour != -1) {
            noFill();
            stroke(strokeColour);
            strokeWeight(4);
            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        pop();

        let outerColour = this.screen.getColour('outer');
        if (outerColour != -1) {
            fill(outerColour);
            noStroke();
            rect(width * 0.5, this.screenPosition.y * 0.5, width, this.screenPosition.y);
            rect(width * 0.5, height - this.screenPosition.y * 0.5, width, this.screenPosition.y);
            rect(this.screenPosition.x * 0.5, height * 0.5, this.screenPosition.x, height);
            rect(width - this.screenPosition.x * 0.5, height * 0.5, this.screenPosition.x, height);
        }

        if (this.cursor.timeSinceMovement > 20) {
            let tooltip = this.getActiveScreen().getTooltip();
            if (tooltip.length > 0) {
                this.drawTooltip(tooltip);
            }
        }
    }

    drawTooltip(t) {
        push();

        translate(mouseX + 10, mouseY + 10);
        scale(this.screenPosition.z);

        // Rectangle
        let drawingRect = false;
        noFill();
        let fillColour = this.screen.getColour('fill', 'tooltip', false);
        if (fillColour != -1) {
            fill(fillColour);
            drawingRect = true;
        }

        noStroke();
        let strokeColour = this.screen.getColour('stroke', 'tooltip', false);
        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(1);
            drawingRect = true;
        }

        textSize(this.tooltipTextSize);
        if (drawingRect) {
            let rectWidth = textWidth(t) + 2 * this.tooltipPadding;
            let rectHeight = this.tooltipTextSize + 2 * this.tooltipPadding
            rect(rectWidth * 0.5, rectHeight * 0.5, rectWidth, rectHeight);
        }

        textAlign(LEFT);
        noStroke();
        fill(this.screen.getColour('text', 'tooltip', false));

        text(t, this.tooltipPadding, this.tooltipPadding + this.tooltipTextSize * 5 / 6);

        pop();
    }

    resizeUI() {
        let screenRatio = width / height;
        let desiredRatio = this.width / this.height;

        // The screen is wider than required
        if (screenRatio > desiredRatio) {
            this.screenPosition.z = height / this.height * this.buffer;
        } else {
            this.screenPosition.z = width / this.width * this.buffer;
        }

        this.screenPosition.x = 0.5 * (width - this.width * this.screenPosition.z);
        this.screenPosition.y = 0.5 * (height - this.height * this.screenPosition.z);
    }

    setFont(font) {
        textFont(font);

        for (let t of this.textboxes) {
            t.clipText();
        }
    }

    setCursors(cursors) {
        this.cursors = cursors;
    }

    setSounds(sounds) {
        this.sounds = sounds;
    }

    addTheme(name, styles, setTheme = false) {
        this.themes.set(name, styles);
        if (setTheme) this.setTheme(name);
    }

    setTheme(name) {
        this.theme = name;
        this.resetStyles();
    }

    resetStyles() {
        for (let scr of this.screens.values()) {
            scr._setStyle();
        }
    }

    getStyle(style, type) {
        let styles = this.themes.get(this.theme);
        if (styles == undefined) return;
        if (styles[type] != undefined) {
            if (styles[type][style] != undefined) return styles[type][style];
            console.warn(`Failed to get style - style '${style}' does not exist for ${type} element.`);
        }
    }
}

/* harmony default export */ var main = (P5UI);
// CONCATENATED MODULE: ./src/core/element.js
/*
Options:
    - label: if provided, the element can later be referenced using this label
    - hidden (false): whether the element starts off as hidden
    - tooltip: if provided, this tooltip will be displayed when the element is hovered over
        - String: the static string will be used as the tooltip
        - Function: the function will be called and if a value is returned, it will be used as the tooltip

    - text (''): the text displayed on the button
    - drawBox (true): Whether to draw the actual rectangle

    - onDisplay: callback when the popup is displayed

    - callbacks
        - update(): Called every frame before the screen is drawn
        - draw(): Called before the UI elements are drawn
        - postDraw(): Called after the UI elements are drawn
        - changeScreen(leavingScreen, oldScreen, newScreen): Called when the screen changes
        - getCursorState(state): Determines what the cursor should look like (called every frame)
*/



main.Element = class Element {
    constructor(options = {}, type) {
        this.pos = options.position || { x: 0, y: 0 };
        this.p5ui = options.p5ui;
        this.type = type;

        this.hidden = options.hidden == undefined ? false : options.hidden;
        this.disabled = options.disabled == undefined ? this.hidden : options.disabled;

        this.parent = null;
        this.children = [];

        this.styleName = options.style;

        this.mousePos = { x: 0, y: 0 };

        this.tooltip = options.tooltip == undefined ? null : options.tooltip;

        this.events = new Map();

        this.userDefinedEvents = {
            update: options.update,
            draw: options.draw,
            postDraw: options.postDraw,
            getCursorState: options.getCursorState,
            changeScreen: options.changeScreen
        }

        this.label = options.label;
    }

    emit(eventName, e) {
        if (this.disabled) return;

        for (let element of this.children) {
            element.emit(eventName, e);
        }

        if (this[eventName] != undefined) {
            this[eventName](e);
        }

        if (this.events.has(eventName)) {
            this.events.get(eventName)(e, this);
        }
    }

    on(eventName, callback) {
        this.events.set(eventName, callback);
        return this;
    }

    hide(hidden, disabled) {
        if (hidden != undefined) {
            this.hidden = hidden;
        } else {
            this.hidden = !this.hidden;
        }

        if (disabled != undefined) {
            this.disable(disabled);
        } else {
            this.disable(this.hidden);
        }

        return this;
    }

    disable(disabled) {
        if (disabled != undefined) {
            this.disabled = disabled;
        } else {
            this.disabled = !this.disabled;
        }

        return this;
    }

    addChild(element) {
        this.children.push(element);
        element.parent = this;

        if (element.label != undefined) {
            this.p5ui.addElement(element, element.label)
        }
    }

    getElements() {
        return this.children;
    }

    getParent() {
        if (this.parent) return this.parent;
        return undefined;
    }

    // update
    _update(mousePos) {
        if (this.pos.x != 0 || this.pos.y != 0) {
            this.mousePos = {
                x: mousePos.x - this.pos.x,
                y: mousePos.y - this.pos.y
            }
        } else {
            this.mousePos = mousePos;
        }

        if (this.disabled) return;

        for (let element of this.children) {
            element._update(this.mousePos);
        }

        this.update(this.mousePos);

        if (this.userDefinedEvents.update != undefined) {
            this.userDefinedEvents.update();
        }
    }

    update() {}

    isHovered() { return false; }

    // cursor state
    _getCursorState() {
        if (this.disabled) return;
        let state;

        for (let element of this.children) {
            if (state == undefined) {
                state = element._getCursorState();
            }
        }

        if (this.userDefinedEvents.getCursorState != undefined) {
            let overriddenState = this.userDefinedEvents.getCursorState(state);
            if (overriddenState != undefined) return overriddenState;
        }

        let overriddenState = this.getCursorState(state);
        if (overriddenState != undefined) return overriddenState;
        return state;
    }

    getCursorState() {}

    _changeScreen(leavingScreen, oldScr, newScr) {
        for (let element of this.children) {
            element._changeScreen(leavingScreen, oldScr, newScr);
        }

        this.changeScreen(leavingScreen, oldScr, newScr);

        if (this.userDefinedEvents.changeScreen != undefined) {
            this.userDefinedEvents.changeScreen(leavingScreen, oldScr, newScr);
        }
    }

    changeScreen() {}

    // show
    _show() {
        if (this.hidden) return;
        push();
        if (this.pos.x != 0 || this.pos.y != 0) {
            translate(this.pos.x, this.pos.y);
        }

        this.show();

        if (this.userDefinedEvents.draw != undefined) {
            this.userDefinedEvents.draw();
        }

        for (let element of this.children) {
            element._show();
        }

        this.postShow();

        if (this.userDefinedEvents.postDraw != undefined) {
            this.userDefinedEvents.postDraw();
        }

        pop();
    }

    show() {}

    postShow() {}

    _setStyle(parentColour = 'default') {
        let styleName = this.styleName || parentColour;

        this.style = this.p5ui.getStyle(styleName, this.type);

        for (let element of this.children) {
            element._setStyle(styleName);
        }
    }

    getColour(key, modifier, allowDefault = true) {
        if (this.style == undefined) return -1;

        if (modifier != undefined) {
            if (this.style[modifier] != undefined && this.style[modifier][key] != undefined) {
                return this.style[modifier][key];
            }

            if (!allowDefault) return -1;
        }

        if (this.style[key] != undefined) return this.style[key];

        return -1;
    }

    getTooltip() {
        if (this.hidden) return '';

        for (let element of this.children) {
            let tt = element.getTooltip();
            if (tt.length > 0) return tt;
        }

        if (this.tooltip && this.showTooltip()) {
            let t = this.tooltip;
            if (t instanceof Function) t = t();

            if (t) return t;
        }

        return '';
    }

    showTooltip() { return this.isHovered(this.mousePos) }

    /**
     * @typedef {object} UIPosition
     * @property {number} x
     * @property {number} y
     */

    /**
     * Called when the button is clicked
     * @typedef {function(Button, *)} onClick
     * @callback onClick
     * @param {Button} clickedButton
     * @param {*} target The target passed via the options object
     */

    /**
     * Adds a button to the element
     * @param {UIPosition} pos The position of the centre of the button
     * @param {Object} [options] Options object
     * @param {number} [options.width=200] The width of the button
     * @param {number} [options.height=100] The height of the button
     * @param {string} [options.style=default] The style of the button
     * @param {string} [options.text] The text displayed on the button
     * @param {number} [options.textSize=50] The size of the button text
     * @param {onClick} [options.onClick] Called when the button is clicked
     */

    addButton(options) {
        options.p5ui = this.p5ui;
        let element = new main.Button(options);
        this.addChild(element);
        return this;
    }

    addContainer(options) {
        options.p5ui = this.p5ui;
        let element = new main.Container(options);
        this.addChild(element);
        return this;
    }

    addTextbox(options) {
        options.p5ui = this.p5ui;
        let element = new main.Textbox(options);
        this.addChild(element);
        this.p5ui.textboxes.push(element);
        return this;
    }

    addChatbox(options) {
        options.p5ui = this.p5ui;
        let element = new main.Chatbox(options);
        this.addChild(element);
        return this;
    }

    addTable(options) {
        options.p5ui = this.p5ui;
        let element = new main.Table(options);
        this.addChild(element);
        return this;
    }

    addCheckbox(options) {
        options.p5ui = this.p5ui;
        let element = new main.Checkbox(options);
        this.addChild(element);
        return this;
    }

    addSlider(options) {
        options.p5ui = this.p5ui;
        let element = new main.Slider(options);
        this.addChild(element);
        return this;
    }
}

/* harmony default export */ var core_element = (main.Element);
// CONCATENATED MODULE: ./src/core/cursor.js


main.Cursor = class Cursor {
    constructor(p5ui) {
        this.p5ui = p5ui;

        this.onScreen = false;
        this.mode = 'default';
        this.img = 'default';

        this.mousePos = { x: 0, y: 0 };
        this.timeSinceMovement = 0;
        this.showTooltip = false;
    }

    update() {
        let newPos = this.getScreenPos();

        if (!mouseIsPressed && newPos.x == this.mousePos.x && newPos.y == this.mousePos.y) {
            if (this.showTooltip) {
                this.timeSinceMovement++;
            } else {
                this.timeSinceMovement = 0;
            }
        } else {
            this.timeSinceMovement = 0;
            this.showTooltip = true;
        }

        this.mousePos = newPos;

        if (this.isOnScreen()) {
            if (!this.onScreen) {
                this.onScreen = true;
                cursor(this.img);
            }
        } else {
            if (this.onScreen) {
                this.onScreen = false;
                cursor('default')
            }
        }
    }

    setMode(mode = 'default') {
        if (mode == this.mode) return;
        this.mode = mode;
        this.img = this.p5ui.cursors[mode];
        if (this.img == undefined) this.img = mode;
        if (this.onScreen) cursor(this.img);
    }

    isOnScreen() {
        return mouseX > this.p5ui.screenPosition.x
            && mouseY > this.p5ui.screenPosition.y
            && mouseX < width - this.p5ui.screenPosition.x
            && mouseY < height - this.p5ui.screenPosition.y;
    }

    getScreenPos() {
        return {
            x: (mouseX - this.p5ui.screenPosition.x) / this.p5ui.screenPosition.z,
            y: (mouseY - this.p5ui.screenPosition.y) / this.p5ui.screenPosition.z
        }
    }
}

/* harmony default export */ var core_cursor = (main.Cursor);
// CONCATENATED MODULE: ./src/elements/button.js
/*
Options:
    - width (200)
    - height (100)
    - colour ('default')

    - text (''): the text displayed on the button
    - textSize (50): the size of the button text

    - onClick: callback when the button is clicked
*/




main.Button = class Button extends core_element {
    constructor(options = {}) {
        super(options, 'button');

        this.width = options.width || 200;
        this.height = options.height || 100;

        this.text = options.text || '';
        this.tSize = options.textSize || 50;

        this.onClick = options.onClick || (() => {});
        this.target = options.target || {};

        // this.colour = options.colour || 'default';

        this.hovered = false;

        this.clickPos = null;
    }

    update() {
        if (this.isHovered()) {
            if (!this.hovered) {
                this.hovered = true;
                this.p5ui.sounds.hover.play();
            }
        } else {
            this.hovered = false;
        }
    }

    getCursorState() {
        if (this.hovered) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        this.clickPos = this.mousePos;
    }

    mouseUp(e) {
        if (e.button != 0) return;
        if (this.hovered && this.isHovered(this.clickPos)) {
            this.click();
            return true;
        }
        return false;
    }

    click() {
        this.onClick(this, this.target);
        this.p5ui.sounds.click.play();
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > -this.width * 0.5
            && mousePos.y > -this.height * 0.5
            && mousePos.x < this.width * 0.5
            && mousePos.y < this.height * 0.5;
    }

    show() {
        let fillColour;
        if (this.hovered) {
            fillColour = this.getColour('fill', 'hover');
        } else {
            fillColour = this.getColour('fill');
        }

        if (fillColour != -1) {
            fill(fillColour)
        } else {
            noFill();
        }

        let strokeColour;
        if (this.hovered) {
            strokeColour = this.getColour('stroke', 'hover');
        } else {
            strokeColour = this.getColour('stroke');
        }

        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(5);
        } else {
            noStroke();
        }

        rect(0, 0, this.width, this.height);

        textAlign(CENTER);
        textSize(this.tSize);

        if (this.hovered) {
            fill(this.getColour('text', 'hover'));
        } else {
            fill(this.getColour('text'));
        }
        noStroke();

        let t = this.text;
        if (t instanceof Function) t = t(this, this.target);
        text(t, 0, this.tSize / 3);
    }
}

/* harmony default export */ var elements_button = (main.Button);
// CONCATENATED MODULE: ./src/elements/chatbox.js
/*
Options:
    - width (400): the width of the chatbox, including the scroll bar
    - height (250): the height of the whole chatbox
    - lineHeight (25): the height of each line of text
    - padding (5): text padding
    - colour ('lobby')

    - scrollbarWidth (0): The width of the scroll bar (0 means no scrolling)
*/




main.Chatbox = class Chatbox extends core_element {
    constructor(options = {}) {
        super(options, 'chatbox');

        this.padding = options.padding || 5;

        this.width = options.width || 400;

        this.lineHeight = options.lineHeight || 25;
        this.textSize = this.lineHeight - 2 * this.padding;

        this.height = options.height || 250;
        this.maxLines = Math.floor(this.height / this.lineHeight);
        
        // this.colour = options.colour || 'lobby';

        this.scrollbar = null;
        this.scrollbarWidth = options.scrollbarWidth || 0;
        if (this.scrollbarWidth > 0) {
            let options = {
                position: { x: this.width - this.scrollbarWidth, y: 0 },
                p5ui: this.p5ui,
                barWidth: this.scrollbarWidth,
                reverseScroll: true
            };

            this.scrollbar = new main.Scrollbar(this.height, this.maxLines, 'lines', 'displayStart', options);
            this.addChild(this.scrollbar);
        }
        
        this.width -= this.scrollbarWidth;
        this.textW = this.width - 2 * this.padding;

        this.lines = [];

        this.displayStart = 0;
    }

    addText(txt, bold) {
        let textLines = wrapText(txt, this.textSize, this.textW);
        for (let line of textLines) {
            this.lines.unshift({ text: line, bold: bold });
        }
        if (this.scrollbar) this.scrollbar.scroll(-this.displayStart);
    }

    toggleScrollbar(bool) {
        if (!this.scrollbar) return;
        this.displayStart = 0;
        this.scrollbar.toggleScrollbar(bool);
        this.scrollbar.calculateScrollbar();
    }

    clear() {
        this.lines = [];
        this.displayStart = 0;
        if (this.scrollbar) this.scrollbar.calculateScrollbar();
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > 0
            && mousePos.y > -this.height
            && mousePos.x < this.width + (this.scrollbar ? this.scrollbar.barWidth : 0)
            && mousePos.y < 0;
    }

    // changeScreen(leavingScreen) {
    //     if (leavingScreen) {
    //         this.hide(true);
    //     } else {
    //         this.hide(false);
    //     }
    // }

    show() {
        let linesToDisplay = Math.min(this.lines.length, this.maxLines);
        let start = this.displayStart;
        if (start + linesToDisplay > this.lines.length) start = 0;

        let colour = {
            fill: {
                default: this.getColour('fill'),
                bold: this.getColour('fill', 'bold')
            },
            stroke: {
                default: this.getColour('stroke'),
                bold: this.getColour('stroke', 'bold')
            },
            text: {
                default: this.getColour('text'),
                bold: this.getColour('text', 'bold')
            }
        }

        textAlign(LEFT);
        textSize(this.textSize);

        for (let i = this.displayStart; i < this.displayStart + linesToDisplay; i++) {
            let line = this.lines[i];
            if (line.text == '') continue;
            push();
            translate(0, -this.lineHeight * (i - this.displayStart));

            // Rectangle
            let drawingRect = false;
            let fillColour, strokeColour;

            noFill();
            if (line.bold) {
                fillColour = colour.fill.bold;
            } else {
                fillColour = colour.fill.default;
            }

            if (fillColour != -1) {
                fill(fillColour);
                drawingRect = true;
            }

            noStroke();
            if (line.bold) {
                strokeColour = colour.stroke.bold;
            } else {
                strokeColour = colour.stroke.default;
            }

            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
                drawingRect = true;
            }

            if (drawingRect) {
                let thisLineWidth = textWidth(line.text) + 2 * this.padding;
                rect(thisLineWidth * 0.5, -this.lineHeight * 0.5, thisLineWidth, this.lineHeight);
            }

            // Text
            noStroke();

            if (line.bold) {
                fill(colour.text.bold);
            } else {
                fill(colour.text.default);
            }

            text(line.text, this.padding, - 0.5 * this.lineHeight + this.textSize / 3);

            pop();
        }
    }
}

function wrapText(txt, tSize, lineWidth) {
    push();
    textSize(tSize);
    let words = txt.split(' ');
    let line = '', lines = [], testLine = '', testWidth;
    while (words.length > 0) {
        let word = words.splice(0, 1)[0];
        testLine = line + word;
        if (words.length > 0) testLine += ' ';
        testWidth = textWidth(testLine);
        if (testWidth > lineWidth) {
            if (line == '') {
                let [wordToAdd, remainingWord] = resizeWord(word, lineWidth);
                lines.push(wordToAdd);
                if (remainingWord.length > 0) {
                    words.unshift(remainingWord);
                }
            } else {
                lines.push(line);
                line = '';
                words.unshift(word);
            }
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    pop();
    return lines;
}

function resizeWord(word, lineWidth) {
    if (textWidth(word) <= lineWidth) return [word, ''];

    let i = 0, partialWord = '';
    while (i < word.length && textWidth(partialWord + word[i]) <= lineWidth) {
        partialWord += word[i];
        i++;
    }

    return [partialWord, word.substring(i)];
}

/* harmony default export */ var chatbox = (main.Chatbox);
// CONCATENATED MODULE: ./src/elements/checkbox.js
/*
Options:
    - size (20)
    - colour ('default')

    - value (false): starting value of the checkbox

    - onClick: callback when the checkbox is clicked
*/




main.Checkbox = class Checkbox extends core_element {
    constructor(options = {}) {
        super(options, 'checkbox');

        this.size = options.size || 30;
        
        this.value = options.value == undefined ? false : options.value;

        this.onClick = options.onClick || (() => {});

        this.hovered = false;
    }

    update() {
        if (this.isHovered()) {
            if (!this.hovered) {
                this.hovered = true;
                this.p5ui.sounds.hover.play();
            }
        } else {
            this.hovered = false;
        }
    }

    getCursorState() {
        if (this.hovered) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        if (this.hovered) {
            this.value = !this.value;
            this.onClick(this.value);
            this.p5ui.sounds.click.play();
        }
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > -this.size * 0.5
            && mousePos.y > -this.size * 0.5
            && mousePos.x < this.size * 0.5
            && mousePos.y < this.size * 0.5;
    }

    setValue(value) {
        this.value = value;
    }

    show() {
        const colour = {
            fill: 255,
            stroke: 20,
            hover: {
                fill: 150,
                stroke: 20
            },
            checked: {
                fill: 20,
                stroke: 255
            },
            hoverchecked: {
                fill: 50,
                stroke: 150
            }
        }

        let self = this;

        function getColour(key) {
            let c = -1;
            if (self.hovered) {
                if (self.value) {
                    c = self.getColour(key, 'hoverchecked', false);
    
                    if (c == -1) {
                        c = self.getColour(key, 'checked', false);
                    }
                }
                if (c == -1) {
                    c = self.getColour(key, 'hover');
                }
            } else if (self.value) {
                c = self.getColour(key, 'checked');
            } else {
                c = self.getColour(key);
            }
            return c;
        }
        
        noFill();
        noStroke();
        let drawRect = false;

        let fillColour = getColour('fill');
        let strokeColour = getColour('stroke');

        if (fillColour != -1) {
            fill(fillColour);
            drawRect = true;
        }

        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(2);
            drawRect = true;
        }

        if (drawRect) {
            rect(0, 0, this.size, this.size);
        }

        if (!this.value) return;

        let tickColour = getColour('tick');
        if (tickColour != -1) {
            stroke(tickColour);
        }

        if ((tickColour != -1 || strokeColour != -1) && tickColour != -2) {
            noFill();
            strokeWeight(this.size / 6);
            beginShape();
            vertex(-this.size * 0.3, 0);
            vertex(-this.size * 0.15, this.size * 0.15);
            vertex(this.size * 0.3, -this.size * 0.3);
            endShape();
        }

        // if (this.hovered) {
        //     if (this.value) {
        //         fillColour = this.getColour('fill', 'hoverchecked', false);
        //         strokeColour = this.getColour('stroke', 'hoverchecked', false);

        //         if (fillColour == -1) {
        //             fillColour = this.getColour('fill', 'checked');
        //         }

        //         if (strokeColour == -1) {
        //             fillCstrokeColourolour = this.getColour('stroke', 'checked');
        //         }
        //     } else {
        //         fillColour = this.getColour('fill', 'hover');
        //         strokeColour = this.getColour('stroke', 'hover');
        //     }
        // } else if (this.value) {
        //     fillColour = this.getColour('fill', 'checked');
        //     strokeColour = this.getColour('stroke', 'checked');
        // } else {
        //     fillColour = this.getColour('fill');
        //     strokeColour = this.getColour('stroke');
        // }

        
    }
}

/* harmony default export */ var elements_checkbox = (main.Checkbox);
// CONCATENATED MODULE: ./src/elements/closebutton.js



main.CloseButton = class CloseButton extends elements_button {
    constructor(popup) {
        let y = -popup.header * 0.5;
        let x = popup.width + y;

        let options = {
            position: { x, y },
            p5ui: popup.p5ui,
            width: popup.textSize,
            height: popup.textSize,
            onClick: () => popup.p5ui.closePopup()
        }

        super(options);

        this.type = 'closebutton'
    }

    show() {
        let fillColour;
        if (this.hovered) {
            fillColour = this.getColour('fill', 'hover');
        } else {
            fillColour = this.getColour('fill');
        }

        if (fillColour != -1) {
            fill(fillColour)
        } else {
            noFill();
        }

        let strokeColour;
        if (this.hovered) {
            strokeColour = this.getColour('stroke', 'hover');
        } else {
            strokeColour = this.getColour('stroke');
        }

        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(2);
        } else {
            noStroke();
        }

        rect(0, 0, this.width, this.height);

        strokeWeight(2);
        if (this.hovered) {
            stroke(this.getColour('cross', 'hover'));
        } else {
            stroke(this.getColour('cross'));
        }

        let lineDiagonal = this.width * 0.3;

        line(-lineDiagonal, lineDiagonal, lineDiagonal, -lineDiagonal);
        line(lineDiagonal, lineDiagonal, -lineDiagonal, -lineDiagonal);
    }
}

/* harmony default export */ var closebutton = (main.CloseButton);
// CONCATENATED MODULE: ./src/elements/container.js
/*
Options:
    - width (300)
    - height (200)
    - colour ('lobbychat')

    - text (''): the text displayed in the header of the container
    - header (25): the height of the header
    - padding (5): the padding of the text in the header
*/




main.Container = class Container extends core_element {
    constructor(options) {
        super(options, 'container');

        this.width = options.width || 300;
        this.height = options.height || 200;

        this.text = options.text || '';
        this.padding = options.padding || 5;
        this.header = options.header || 25;
        this.textSize = this.header - 2 * this.padding;

        // this.colour = options.colour || 'lobbychat';

        this.clickPos = { x: 0, y: 0 };
        this.mousePressed = false;
    }

    mouseUp(e) {
        this.mousePressed = false;
    }

    isHovered(mousePos = this.mousePos) {
        if (this.text.length == 0) return false;

        return mousePos.x > 0
            && mousePos.y > -this.header
            && mousePos.x < this.width
            && mousePos.y < 0;
    }

    show() {
        if (this.width > 0 && this.height > 0) {
            let fillColour = this.getColour('fill');
            if (fillColour != -1) {
                fill(fillColour);
            } else {
                noFill();
            }

            let strokeColour = this.getColour('stroke');
            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
            } else {
                noStroke();
            }

            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        if (this.header > 0 && this.text.length > 0) {
            let headerColour = this.getColour('header');
            if (headerColour != -1) {
                fill(headerColour);

                rect(this.width * 0.5, -this.header * 0.5, this.width, this.header);
            }

            textAlign(CENTER);
            textSize(this.textSize);
            noStroke();
            fill(this.getColour('text'));

            text(this.text, this.width * 0.5, - this.header * 0.5 + this.textSize / 3);
        }
    }
}

/* harmony default export */ var container = (main.Container);
// CONCATENATED MODULE: ./src/elements/overlay.js
/*
Options:
    - width (p5ui.width)
    - height (p5ui.height)
    - colour ('default')

    - text (''): the text displayed on the button
    - drawBox (true): whether to draw the actual rectangle

    - onDisplay: callback when the popup is displayed
*/




main.Popup = class Popup extends core_element {
    constructor(options = {}) {
        let w = options.width || options.p5ui.width;
        let h = options.height || options.p5ui.height;
        options.position = { x: (options.p5ui.width - w) * 0.5, y: (options.p5ui.height - h) * 0.5 };
        
        super(options, 'popup');

        this.width = w;
        this.height = h;
        this.text = options.text || '';
        this.drawBox = options.drawBox == false ? false : true;

        this.header = this.p5ui.popupHeader;
        this.textSize = this.header - 2 * this.p5ui.popupPadding;

        // this.colour = options.colour || 'default';

        this.onDisplay = options.onDisplay || (() => {});

        if (this.text.length > 0) {
            this.addChild(new main.CloseButton(this));
        }
    }

    show() {
        if (this.drawBox) {
            // let fillColour = this.getColour('fill');
            // if (fillColour != -1) {
            //     fill(fillColour);
            // } else {
            //     noFill();
            // }

            // let strokeColour = this.getColour('stroke');
            // if (strokeColour != -1) {
            //     stroke(strokeColour);
            //     strokeWeight(1);
            // } else {
            //     noStroke();
            // }

            // rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        if (this.text.length > 0) {
            let fillColour = this.getColour('fill');
            if (fillColour != -1) {
                fill(fillColour);
            } else {
                noFill();
            }

            // let strokeColour = this.getColour('stroke');
            // if (strokeColour != -1) {
            //     stroke(strokeColour);
            //     strokeWeight(1);
            // } else {
                noStroke();
            // }

            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);

            let headerColour = this.getColour('header');
            if (headerColour != -1) {
                fill(headerColour);

                rect(this.width * 0.5, -this.header * 0.5, this.width, this.header);
            }

            textAlign(CENTER);
            textSize(this.textSize);
            noStroke();
            fill(this.getColour('text'));

            text(this.text, this.width * 0.5, - this.header * 0.5 + this.textSize / 3);
        }
    }

    postShow() {
        if (this.text.length > 0) {
            noFill();
            let strokeColour = this.getColour('stroke');
            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
            } else {
                noStroke();
            }

            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);

            let headerColour = this.getColour('header');
            if (headerColour != -1) {
            //     fill(headerColour);

                rect(this.width * 0.5, -this.header * 0.5, this.width, this.header);
            }
        }
    }
}

/* harmony default export */ var overlay = (main.Popup);
// CONCATENATED MODULE: ./src/elements/screen.js



main.Screen = class Screen extends core_element {
    constructor(options) {
        super(options, 'screen');
    }

    isHovered() {
        return this.p5ui.cursor.isOnScreen();
    }
}

/* harmony default export */ var screen = (main.Screen);
// CONCATENATED MODULE: ./src/elements/scrollbar.js



main.Scrollbar = class Scrollbar extends core_element {
    constructor(height, maxRows, rowContents, scrollProperty, options = {}) {
        super(options, 'scrollbar');

        this.height = height;
        this.maxRows = maxRows;

        this.rowContents = rowContents;
        this.scrollProperty = scrollProperty;

        this.rowWidth = options.rowWidth || 0;
        this.barWidth = options.barWidth || 10;

        // this.colour = options.colour || 'default';

        this.scrollDirection = options.reverseScroll ? -1 : 1;
        this.scrollPosition = 0;
        this.scrollHeight = 1;
        this.scrollY = 0;

        this.hovered = false;
        this.mousePressed = false;
        this.clickStart = 0;
        this.positionAtClick = 0;
    }

    update(e) {
        this.hovered = this.isHovered() || this.mousePressed;

        if (this.mousePressed) {
            let numRows = this.parent[this.rowContents].length;
            let rowsToDisplay = Math.min(numRows, this.maxRows);

            let offset = (this.mousePos.y - this.clickStart) * this.scrollDirection;
            let up = offset > 0;
            let flooredOffset = Math.floor(Math.abs(offset) * numRows / this.height);
            if (!up) flooredOffset *= -1;

            let newPos = this.positionAtClick + flooredOffset;
            if (newPos < 0) newPos = 0;
            if (newPos > numRows - rowsToDisplay) newPos = numRows - rowsToDisplay;

            this.parent[this.scrollProperty] = newPos;

            this.calculateScrollbar();
        }
    }

    mouseDown(e) {
        if (this.scrollHeight == 1) return;
        if (this.isHovered()) {
            this.mousePressed = true;
            this.clickStart = this.mousePos.y;
            this.positionAtClick = this.parent[this.scrollProperty];
        }
    }

    mouseWheel(e) {
        if (this.mousePressed) return;
        if (this.parent.isHovered()) this.scroll(e.deltaY / 100 * this.scrollDirection);
    }

    mouseUp(e) {
        this.mousePressed = false;
    }

    scroll(offset) {
        if (this.hidden) return;
        let numRows = this.parent[this.rowContents].length;

        this.parent[this.scrollProperty] += offset;
        let rowsToDisplay = Math.min(numRows, this.maxRows);

        if (this.parent[this.scrollProperty] < 0) {
            offset -= this.parent[this.scrollProperty];
            this.parent[this.scrollProperty] = 0;

        } else if (this.parent[this.scrollProperty] > numRows - rowsToDisplay) {
            offset += numRows - rowsToDisplay - this.parent[this.scrollProperty];
            this.parent[this.scrollProperty] = numRows - rowsToDisplay;
        }

        this.calculateScrollbar();
    }

    calculateScrollbar() {
        if (this.hidden) return;
        let numRows = this.parent[this.rowContents].length;
        if (numRows == 0) {
            this.scrollHeight = 1;
            this.scrollY = 0;
            this.mousePressed = false;
            return;
        }

        this.scrollHeight = Math.min(this.maxRows / numRows, 1);
        if (this.scrollHeight == 1) this.mousePressed = false;
        this.scrollY = this.parent[this.scrollProperty] / numRows * this.scrollDirection;
    }

    toggleScrollbar(bool) {
        this.hide(bool);
        if (this.hidden) this.mousePressed = false;
        this.calculateScrollbar();
    }

    isHovered(mousePos = this.mousePos) {
        let y = mousePos.y * this.scrollDirection;

        return mousePos.x > 0
            && y > this.scrollY * this.height * this.scrollDirection
            && mousePos.x < this.barWidth
            && y < this.scrollY * this.height * this.scrollDirection + this.scrollHeight * this.height;
    }

    reset() {
        this.parent[this.scrollProperty] = 0;
        this.calculateScrollbar();
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.mousePressed = false;
        }
    }

    show() {
        push();
        if (this.scrollHeight < 1) {
            let fillColour;
            if (this.hovered) {
                fillColour = this.getColour('fill', 'hover');
            } else {
                fillColour = this.getColour('fill');
            }

            if (fillColour != -1) {
                fill(fillColour)
            } else {
                noFill();
            }

            let strokeColour;
            if (this.hovered) {
                strokeColour = this.getColour('stroke', 'hover');
            } else {
                strokeColour = this.getColour('stroke');
            }

            if (strokeColour != -1) {
                stroke(strokeColour);
                strokeWeight(1);
            } else {
                noStroke();
            }

            let x = 0
            let y = this.scrollY * this.height
            let w = this.barWidth;
            let h = this.scrollHeight * this.height

            rect(x + w * 0.5, y + h * 0.5 * this.scrollDirection, w, h);
        }

        pop();
    }
}

/* harmony default export */ var scrollbar = (main.Scrollbar);
// CONCATENATED MODULE: ./src/elements/slider.js
/*
Options:
    - width (300): the width of the slider on screen
    - height (10): the thickness of the slider line
    - radius (30): the radius of the slider circle
    - colour ('default')

    - textSize (0): the size of the text displaying the value (0 means no text)

    - min (0): the minimum value (inclusive)
    - max (1): the maximum value (inclusive)
    - value (0.5 * (min + max)): the starting value
    - increment (1): the increment that the slider goes up in

    - onMove: callback when the slider is moved
    - onRelease: callback when the user lets go of the slider
*/




main.Slider = class Slider extends core_element {
    constructor(options = {}) {
        super(options, 'slider');

        this.width = options.width || 300;
        this.height = options.height || 10;
        this.radius = options.radius || 20;

        this.textSize = options.textSize || 0;

        this.min = options.min || 0;
        this.max = options.max || 1;

        if (this.max < this.min) {
            console.error(`Slider: max value (${this.max}) is less than min value (${this.min}).`);
        }

        this.value = options.value == undefined ? (this.max + this.min) / 2 : options.value;
        if (this.value < this.min) this.value = this.min;
        if (this.value > this.max) this.value = this.max;

        this.calculateXPosition();
        // this.xPosition = this.valueToCoordinate(this.value);

        this.increment = options.increment || 1;
        this.scrollSpeed = options.scrollSpeed || this.increment;

        this.onMove = options.onMove || (() => {});
        this.onRelease = options.onRelease || (() => {});

        this.hovered = false;
        this.mouseIsPressed = false;
        this.clickStart = 0;
    }

    update() {
        if (this.isHovered() || this.mouseIsPressed) {
            if (!this.hovered) {
                this.hovered = true;
                this.p5ui.sounds.hover.play();
            }
        } else {
            this.hovered = false;
        }

        if (this.mouseIsPressed) {
            let percent = this.mousePos.x / this.width + 0.5;

            let value = percent * (this.max - this.min) + this.min;
            value = Math.round(value / this.increment) * this.increment;

            this.setValue(value);

            // if (value < this.min) value = this.min;
            // if (value > this.max) value = this.max;

            // if (this.value != value) {
            //     this.value = value;
            //     this.calculateXPosition();
            //     this.onMove(this.value);
            // }
        }
    }

    getCursorState() {
        if (this.hovered) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        if (this.isHovered()) {
            this.mouseIsPressed = true;
            this.clickStart = this.mousePos.x;
        }
    }

    mouseUp(e) {
        if (e.button != 0) return;
        if (this.mouseIsPressed) {
            this.mouseIsPressed = false;
            this.onRelease(this.value);
            this.p5ui.sounds.click.play();
        }
    }

    mouseWheel(e) {
        if (this.mouseIsPressed || !this.isHovered()) return;
        let value = this.value - e.deltaY * this.scrollSpeed / 100;

        this.setValue(value);

        // if (value < this.min) value = this.min;
        // if (value > this.max) value = this.max;

        // if (this.value != value) {
        //     this.value = value;
        //     this.calculateXPosition();
        //     this.onMove(this.value);
        // }
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > -this.width * 0.5 - this.radius
            && mousePos.y > -this.radius
            && mousePos.x < this.width * 0.5 + this.radius
            && mousePos.y < this.radius
    }

    calculateXPosition() {
        let percent = (this.value - this.min) / (this.max - this.min);
        this.xPosition = this.width * (percent - 0.5);
    }

    setValue(value) {
        if (value < this.min) value = this.min;
        if (value > this.max) value = this.max;

        if (this.value != value) {
            this.value = value;
            this.calculateXPosition();
            this.onMove(this.value);
        }
    }

    show() {
        let lineColour, circleColour, textColour;

        // Line
        if (this.hovered) {
            lineColour = this.getColour('line', 'hover');
        } else {
            lineColour = this.getColour('line');
        }

        if (lineColour != -1) {
            stroke(lineColour);
            noFill();
            strokeWeight(this.height);
            line(-this.width * 0.5, 0, this.width * 0.5, 0);
        }

        // Circle
        if (this.hovered) {
            circleColour = this.getColour('circle', 'hover');
        } else {
            circleColour = this.getColour('circle');
        }

        if (circleColour != -1) {
            fill(circleColour);
            noStroke();
            ellipse(this.xPosition, 0, this.radius * 2);
        }

        // Text
        if (this.textSize == 0) return;

        if (this.hovered) {
            textColour = this.getColour('text', 'hover');
        } else {
            textColour = this.getColour('text');
        }

        fill(textColour);
        noStroke();
        textSize(this.textSize);
        textAlign(CENTER);

        text(this.value, this.xPosition, this.textSize / 3);
    }
}

/* harmony default export */ var slider = (main.Slider);
// CONCATENATED MODULE: ./src/elements/table.js
/*
Options:
    - width (800): The width of the table, including the scroll bar
    - columnWidths ([]): Array of widths of each column (empty array means each column has equal width)
    NOTE: If columnWidths is provided, the width property will be overridden by the total width of the columns

    - height (300): the height of the table, excluding the header row
    - rowHeight (30): the height of each row
    - padding (5): text padding
    - colour ('lobbies')

    - scrollbarWidth (0): The width of the scroll bar (0 means no scrolling)

    - onClick: callback when an item in the table is clicked

    - columnTitles: array of the titles of each column
    - columnFunctions: functions to get the data of each item in the table
    (may be replaced with columnData)
*/




main.Table = class Table extends core_element {
    constructor(options = {}) {
        super(options, 'table');

        this.padding = options.padding || 5;

        this.width = options.width || 800;

        this.rowHeight = options.rowHeight || 30;
        this.textSize = this.rowHeight - 2 * this.padding;

        this.height = options.height || 300;
        this.maxRows = Math.floor(this.height / this.rowHeight);

        // this.colour = options.colour || 'lobbies';

        this.scrollbar = null;
        this.scrollbarWidth = options.scrollbarWidth || 0;
        if (this.scrollbarWidth > 0) {
            let options = {
                position: { x: this.width - this.scrollbarWidth, y: 0 },
                p5ui: this.p5ui,
                barWidth: this.scrollbarWidth
            };

            this.scrollbar = new main.Scrollbar(this.height, this.maxRows, 'rows', 'displayStart', options);
            this.addChild(this.scrollbar);
        }

        this.columnWidths = options.columnWidths || [];
        this.columnTitles = options.columnTitles || [];
        this.columnData = options.columnData || [];

        if (this.columnData.length == 0) throw new Error('Table must have at least one column');

        if (this.columnWidths.length == 0) {
            let columnWidth = (this.width - this.scrollbarWidth) / this.columnData.length;
            for (let i = 0; i < this.columnData.length; i++) {
                this.columnWidths.push(columnWidth);
            }
        }

        this.width = this.scrollbarWidth;
        for (let i = 0; i < this.columnWidths.length; i++) {
            this.width += this.columnWidths[i];
        }

        this.onClick = options.onClick || (() => {});
        this.hasClick = true;
        if (options.onClick == undefined) {
            this.hasClick = false;
        }
        
        this.rows = [];

        this.displayStart = 0;
        this.hoveredRow = -1;
    }

    update() {
        if (this.hasClick) {
            let newHoveredRow = this.getHoveredRow();

            if (newHoveredRow != -1) {
                if (this.hoveredRow != newHoveredRow) {
                    this.p5ui.sounds.hover.play();
                }
            }

            this.hoveredRow = newHoveredRow;
        }
    }

    getCursorState() {
        if (this.hoveredRow != -1) return 'pointer';
    }

    mouseDown(e) {
        if (e.button != 0) return;
        this.clickedRow = this.hoveredRow;
    }

    mouseUp(e) {
        if (e.button != 0) return;
        if (this.hoveredRow == -1) return;
        if (this.hoveredRow == this.clickedRow) {
            this.onClick(this.rows[this.hoveredRow]);
            this.p5ui.sounds.click.play();
            return true;
        }
        return false;
    }

    addItem(item) {
        this.rows.push(item);
        if (this.scrollbar) this.scrollbar.calculateScrollbar();
    }

    clear() {
        this.rows = [];
        this.displayStart = 0;
        if (this.scrollbar) this.scrollbar.calculateScrollbar();
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > 0
            && mousePos.y > 0
            && mousePos.x < this.width
            && mousePos.y < this.height;
    }

    getHoveredRow(mousePos = this.mousePos) {
        if (mousePos.x < 0 || mousePos.x > this.width - this.scrollbarWidth || mousePos.y < 0 || mousePos.y > this.height) return -1;

        let rowsToDisplay = Math.min(this.rows.length, this.maxRows);
        let start = this.displayStart;
        if (start + rowsToDisplay > this.rows.length) start = 0;

        let hoveredRow = Math.floor(mousePos.y / this.rowHeight) + this.displayStart;
        if (hoveredRow >= this.rows.length) hoveredRow = -1;

        return hoveredRow;
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.hoveredRow = -1;
        }
    }

    show() {
        noStroke();
        textSize(this.textSize);

        // Header
        let headerColour = this.getColour('fill', 'header');
        if (headerColour != -1) {
            fill(headerColour);
            rect(this.width * 0.5, -this.rowHeight * 0.5, this.width, this.rowHeight);
        }

        textAlign(CENTER);
        fill(this.getColour('text', 'header'));

        let x = 0;
        for (let i = 0; i < this.columnData.length && i < this.columnTitles.length; i++) {
            let tx = x;
            if (i == 0) {
                textAlign(LEFT);
                tx += this.padding;
            } else {
                if (i == 1) textAlign(CENTER);
                tx += this.columnWidths[i] * 0.5
            }

            let t = this.columnTitles[i];
            if (textWidth(t) > this.columnWidths[i] - 2 * this.padding) {
                // TODO: Change this to work with non-monochromatic fonts
                let numChars = Math.floor((this.columnWidths[i] - 2 * this.padding) / textWidth(' ')) - 3;
                t = t.substring(0, numChars) + '...';
            }

            text(t, tx, -this.rowHeight * 0.5 + this.textSize / 3);

            x += this.columnWidths[i];
        }

        // Main
        let rowsToDisplay = Math.min(this.rows.length, this.maxRows);
        let start = this.displayStart;
        if (start + rowsToDisplay > this.rows.length) start = 0;

        let fillColour = this.getColour('fill');
        if (fillColour != -1) {
            fill(fillColour);
            rect(this.width * 0.5, this.height * 0.5, this.width, this.height);
        }

        let w = this.width - this.scrollbarWidth;
        let alternateColour = this.getColour('fill', 'alternate');
        if (alternateColour != -1 && alternateColour != fillColour) {
            fill(alternateColour);
            for (let i = 1 - this.displayStart % 2; i < this.maxRows; i += 2) {
                let y = i * this.rowHeight;
                rect(w * 0.5, y + this.rowHeight * 0.5, w, this.rowHeight);
            }
        }

        if (this.hoveredRow >= start && this.hoveredRow < start + rowsToDisplay) {
            let hoverColour = this.getColour('fill', 'hover');
            if (hoverColour != -1) {
                fill(hoverColour);
                rect(w * 0.5, this.rowHeight * (this.hoveredRow - this.displayStart) + this.rowHeight * 0.5, w, this.rowHeight);
            }
        }

        // Text
        let textColours = {
            default: this.getColour('text'),
            alternate: this.getColour('text', 'alternate'),
            hover: this.getColour('text', 'hover'),
        }
        let y = 0;
        for (let i = this.displayStart; i < this.displayStart + rowsToDisplay; i++) {
            if (i == this.hoveredRow && textColours.hover != -1) {
                fill(textColours.hover);
            } else if (i % 2 == 1 && textColours.alternate != -1) {
                fill(textColours.alternate);
            } else {
                fill(textColours.default);
            }

            let x = 0;
            for (let j = 0; j < this.columnData.length; j++) {
                let tx = x;
                if (j == 0) {
                    textAlign(LEFT);
                    tx += this.padding;
                } else {
                    if (j == 1) textAlign(CENTER);
                    tx += this.columnWidths[j] * 0.5
                }

                let t = this.rows[i][this.columnData[j]];
                if (t instanceof Function) t = t(this.rows[i]);
                if (textWidth(t) > this.columnWidths[j] - 2 * this.padding) {
                    let numChars = Math.floor((this.columnWidths[j] - 2 * this.padding) / textWidth(' ')) - 3;
                    t = t.substring(0, numChars) + '...';
                }

                text(t, tx, y + this.rowHeight * 0.5 + this.textSize / 3);

                x += this.columnWidths[j];
            }
            y += this.rowHeight;
        }
    }

    postShow() {
        let strokeColour = this.getColour('stroke');
        // Edges
        if (strokeColour != -1) {
            stroke(strokeColour);
            noFill();
            strokeWeight(1);

            let h = this.height + this.rowHeight;

            rect(this.width * 0.5, -this.rowHeight + h * 0.5, this.width, h)

            // for (let i = 0; i < this.maxRows; i++) {
            //     let y = i * this.rowHeight;
            //     line(0, y, this.totalWidth - 1, y);
            // }
        }
    }
}

/* harmony default export */ var table = (main.Table);
// CONCATENATED MODULE: ./src/elements/textbox.js
/*
Options:
    - width (400)
    - height (25)
    - padding (5): text padding
    - colour ('default')

    - value (''): the starting value of the textbox
    - default (''): the text displayed when the textbox is unfocused and empty
    - maxLength (0): the maximum character limit of the textbox (0 means no limit)

    - onSubmit: callback when the Enter key is pressed
    - onFocus: callback when the textbox is focused
    - onBlur: callback when the textbox loses focus

    - clickToFocus (true): whether the textbox can be clicked to focus it
    - allowEmptySubmit (false): whether an empty value can be submitted
    - clearOnSubmit (true): whether the value should be cleared when the Enter key is pressed
    - blurOnSubmit (true): whether the textbox should lose focus when the Enter key is pressed
*/




main.Textbox = class Textbox extends core_element {
    constructor(options = {}) {
        super(options, 'textbox');

        this.padding = options.padding || 5;

        this.width = options.width || 400;
        this.textW = this.width - 2 * this.padding;

        this.height = options.height || 25;
        this.textSize = this.height - 2 * this.padding;

        this.onSubmit = options.onSubmit || (() => {});
        this.onFocus = options.onFocus || (() => {});
        this.onBlur = options.onBlur || (() => {});

        this.clickToFocus = options.clickToFocus == undefined ? true : options.clickToFocus;
        this.allowEmptySubmit = options.allowEmptySubmit == undefined ? false : options.allowEmptySubmit;        
        this.clearOnSubmit = options.clearOnSubmit == undefined ? true : options.clearOnSubmit;        
        this.blurOnSubmit = options.blurOnSubmit == undefined ? true : options.blurOnSubmit;        

        // this.colour = options.colour || 'default';

        this.default = options.default || '';
        this.value = options.value || '';
        this.maxLength = options.maxLength || 0;

        this.focused = false;
        this.timeSinceMoved = 0;
        this.cursorPos = this.value.length;

        this.visibleText = [0, this.value.length];
        this.visibleTextString = this.value;
        this.visibleTextWidth = 0;
        this.fixedLeft = true;

        // this.selection = false;
        // this.selectedText = [0, 0];
        // this.selectionAnchor = 0;
        this.selectionStart = this.cursorPos;

        this.mousePressed = false;
        this.shiftPressed = false;

        this.keyQueue = [];
        this.pasting = false;
    }

    update() {
        if (!this.focused) return;
        this.timeSinceMoved ++;

        if (!this.pasting) {
            for (let e of this.keyQueue) {
                this.typeKey(e);
            }

            this.keyQueue = [];

            if (this.mousePressed) {
                let currentPos = this.clickPos(this.mousePos);
    
                // if (!this.selection) {
                //     if (currentPos != this.selectionAnchor) {
                //         this.selection = true;
                //         this.selectedText[0] = this.selectionAnchor;
                //         this.selectedText[1] = currentPos;
                //     }
                // }
    
                this.moveCursor(currentPos - this.cursorPos);//, this.shiftPressed || this.selection);
            }
        }
    }

    getCursorState() {
        if (this.isHovered(this.mousePos) && (this.focused || this.clickToFocus)) return 'text';
    }

    mouseDown(e) {
        if (this.isHovered()) {
            if (this.clickToFocus && !this.focused) {
                this.focus();
                this.cursorPos = this.clickPos(this.mousePos);
                this.clipText();
                // this.selection = false;
                this.selectionStart = this.cursorPos;
            }
        } else {
            if (this.focused) this.blur();
        }

        if (!this.focused) return;
        this.mousePressed = true;
        if (!this.shiftPressed) {
            // this.selection = false;
            // this.selectionAnchor = this.clickPos(this.mousePos);
            this.selectionStart = this.clickPos(this.mousePos);
        }
    }

    mouseUp(e) {
        this.mousePressed = false;
    }

    keyType(e) {
        if (!this.focused) return;
        this.keyQueue.push(e);
        this.mousePressed = false;
    }

    keyDown(e) {
        if (e.key == 'Shift') {
            this.shiftPressed = true;
        }
    }

    keyUp(e) {
        if (e.key == 'Shift') this.shiftPressed = false;
    }

    typeKey(e) {
        if (e.key == 'ArrowLeft') {
            if (e.ctrlKey) {
                let i = this.cursorPos;
                let wordStarted = false;
                let wordEnded = false;
                while (!wordEnded) {
                    if (i == 0) {
                        wordEnded = true;
                    } else if (!wordStarted) {
                        if (this.isLetter(i - 1)) wordStarted = true;
                    } else {
                        if (!this.isLetter(i - 1)) wordEnded = true;
                    }
                    i--;
                }
                this.moveCursor(i + 1 - this.cursorPos, e.shiftKey);
            } else {
                this.moveCursor(-1, e.shiftKey);
            }

        } else if (e.key == 'ArrowRight') {
            if (e.ctrlKey) {
                let i = this.cursorPos;
                let wordStarted = false;
                let wordEnded = false;
                let newWordStarted = false;
                while (!newWordStarted) {
                    if (i == this.value.length) {
                        newWordStarted = true;
                    } else if (!wordStarted) {
                        if (this.isLetter(i)) wordStarted = true;
                    } else if (!wordEnded) {
                        if (!this.isLetter(i)) wordEnded = true;
                    } else {
                        if (this.isLetter(i)) newWordStarted = true;
                    }
                    i++;
                }
                this.moveCursor(i - 1 - this.cursorPos, e.shiftKey);
            } else {
                this.moveCursor(1, e.shiftKey);
            }

        } else if (e.key == 'Backspace' && this.value.length > 0) {
            if (this.selectionStart != this.cursorPos) {
                this.removeSelected(false);
            } else if (this.cursorPos > 0) {
                this.value = this.value.substring(0, this.cursorPos - 1) + this.value.substring(this.cursorPos, this.value.length);
                this.cursorPos--;
                this.selectionStart = this.cursorPos;
                this.clipText(false);
            }

        } else if (e.key == 'Delete' && this.value.length > 0) {
            if (this.selectionStart != this.cursorPos) {
                this.removeSelected(true);
            } else if (this.cursorPos < this.value.length) {
                this.value = this.value.substring(0, this.cursorPos) + this.value.substring(this.cursorPos + 1, this.value.length);
                this.clipText(true);
            }

        } else if (e.key == 'Home') {
            this.moveCursor(-this.cursorPos, e.shiftKey);

        } else if (e.key == 'End') {
            this.moveCursor(this.value.length - this.cursorPos, e.shiftKey);

        } else if (e.key == 'Enter') {
            if (this.allowEmptySubmit || this.value.length > 0) this.onSubmit(this.value);

            if (this.clearOnSubmit) this.clear();
            if (this.blurOnSubmit) this.blur();

        } else if (e.key.length == 1) {
            if (!e.ctrlKey) {
                if (this.selectionStart != this.cursorPos) this.removeSelected();
                if (this.maxLength == 0 || this.value.length < this.maxLength) {
                    this.value = this.value.substring(0, this.cursorPos) + e.key + this.value.substring(this.cursorPos, this.value.length);
                    this.cursorPos++;
                    this.selectionStart = this.cursorPos;
                    this.clipText(true);
                }
            } else {
                if (e.key.toLowerCase() == 'a') {
                    this.selection = true;
                    this.cursorPos = this.value.length;
                    this.selectedText = [0, this.value.length];
                    this.selectionStart = 0;

                } else if (navigator.clipboard != undefined) {
                    if (e.key.toLowerCase() == 'c') {
                        let textToCopy = this.value;
                        if (this.selectionStart != this.cursorPos) {
                            textToCopy = this.value.substring(this.selectionStart, this.cursorPos);
                        }
                        navigator.clipboard.writeText(textToCopy);
    
                    } else if (e.key.toLowerCase() == 'v') {
                        if (this.selectionStart != this.cursorPos) this.removeSelected();
                        this.pasting = true;
                        navigator.clipboard.readText().then(copiedText => {
                            let textToPaste = '';
                            let maxPasteLength = this.maxLength - this.value.length;
                            for (let char of copiedText) {
                                if (this.maxLength > 0 && textToPaste.length >= maxPasteLength) continue;
                                if (char == '\n') {
                                    textToPaste += ' ';
                                } else {
                                    textToPaste += char;
                                }
                            }
                            this.value = this.value.substring(0, this.cursorPos) + textToPaste + this.value.substring(this.cursorPos, this.value.length);
                            this.cursorPos += textToPaste.length;
                            this.selectionStart = this.cursorPos;
                            this.clipText(true);
                            this.pasting = false;
                        });
    
                    } else if (e.key.toLowerCase() == 'x') {
                        let textToCopy = this.value;
                        if (this.selectionStart != this.cursorPos) {
                            textToCopy = this.value.substring(this.selectionStart, this.cursorPos);
                            this.removeSelected(true);
                        } else {
                            this.value = '';
                            this.cursorPos = 0;
                            this.selectionStart = this.cursorPos;
                            this.clipText(true);
                        }
                        navigator.clipboard.writeText(textToCopy);
                    }
                }
            }
        }
    }

    moveCursor(offset, select) {
        this.cursorPos += offset;
        
        if (this.cursorPos < 0) {
            offset -= this.cursorPos;
            this.cursorPos = 0;
        } else if (this.cursorPos > this.value.length) {
            offset += this.value.length - this.cursorPos;
            this.cursorPos = this.value.length;
        }

        if (offset != 0) {
            this.timeSinceMoved = 0;
        }

        this.clipText();

        if (!this.mousePressed && !this.shiftPressed) {
            this.selectionStart = this.cursorPos;
        }

        // if (select) {
        //     if (offset != 0) {
        //         if (this.selection) {
        //             this.selectedText[1] = this.cursorPos;
        //             if (this.selectedText[0] == this.selectedText[1]) {
        //                 this.selection = false;
        //             }
        //         } else {
        //             this.selection = true;
        //             this.selectedText[0] = this.cursorPos - offset;
        //             this.selectedText[1] = this.cursorPos;
        //         }
        //     }
        // } else {
        //     this.selection = false;
        // }
    }

    removeSelected(fixLeft) {
        this.selection = false;

        if (this.selectionStart < this.cursorPos) {
            this.value = this.value.substring(0, this.selectionStart) + this.value.substring(this.cursorPos, this.value.length);
            this.cursorPos -= this.cursorPos - this.selectionStart;
            this.clipText(fixLeft);
        } else {
            this.value = this.value.substring(0, this.cursorPos) + this.value.substring(this.selectionStart, this.value.length);
            this.clipText(fixLeft);
        }
        this.selectionStart = this.cursorPos;
    }

    tryClip(fixLeft) {
        let i, partialText = '', partialWidth = 0;
        this.fixedLeft = fixLeft;

        if (fixLeft) {
            i = this.visibleText[0];
            
            while (partialWidth <= this.textW && i < this.value.length) {
                partialText += this.value[i];
                partialWidth = textWidth(partialText);
                if (partialWidth <= this.textW) i++;
            }

            this.visibleText[1] = i;

            if (this.cursorPos > this.visibleText[1]) {
                this.visibleText[1] = this.cursorPos;
                this.tryClip(false);
            } else if (this.visibleText[0] != 0 && this.visibleText[1] == this.value.length) {
                this.tryClip(false);
            }

        } else {
            i = this.visibleText[1] - 1;

            while (partialWidth <= this.textW && i >= 0) {
                partialText = this.value[i] + partialText;
                partialWidth = textWidth(partialText);
                if (partialWidth <= this.textW) i--;
            }

            this.visibleText[0] = i + 1;

            if (this.cursorPos < this.visibleText[0]) {
                this.visibleText[0] = this.cursorPos;
                this.tryClip(true);

            } else if (this.visibleText[0] == 0) {
                this.tryClip(true);
            }
        }
    }

    clipText(fixLeft) {
        if (fixLeft != undefined) this.timeSinceMoved = 0;
        push();
        textSize(this.textSize);

        if (this.visibleText[1] > this.value.length) {
            this.visibleText[1] = this.value.length;
        }

        if (this.cursorPos > this.visibleText[1]) {
            this.visibleText[1] = this.cursorPos;
            this.tryClip(false);

        } else if (this.cursorPos < this.visibleText[0]) {
            this.visibleText[0] = this.cursorPos;
            this.tryClip(true);

        } else if (fixLeft != undefined) {
            this.tryClip(fixLeft);
        } else {
            this.tryClip(this.fixedLeft);
        }

        this.visibleTextString = this.value.substring(this.visibleText[0], this.visibleText[1]);
        this.visibleTextWidth = textWidth(this.visibleTextString);
        pop();
    }

    clickPos(mousePos) {
        let offsetX = mousePos.x - this.padding;
        if (!this.fixedLeft) offsetX += this.visibleTextWidth - this.textW;

        if (offsetX < 0) {
            if (this.visibleText[0] > 0 && frameCount % 5 == 0) return this.visibleText[0] - 1;
            return this.visibleText[0];

        } else if (offsetX < this.visibleTextWidth) {
            let i = this.visibleText[0];
            let partialText = '';
            let partialWidth = 0;

            push()
            textSize(this.textSize);

            while (partialWidth <= offsetX && i < this.visibleText[1]) {
                partialText += this.value[i];
                partialWidth = textWidth(partialText);
                if (partialWidth <= offsetX) i++;
            }

            pop();

            return i;

        } else {
            if (this.visibleText[1] < this.value.length && frameCount % 5 == 0) return this.visibleText[1] + 1;
            return this.visibleText[1];
        }
    }

    isHovered(mousePos = this.mousePos) {
        return mousePos.x > 0
            && mousePos.y > -this.height
            && mousePos.x < this.width
            && mousePos.y < 0
    }

    setValue(value = '') {
        if (this.maxLength > 0) value = value.substr(0, this.maxLength);
        this.timeSinceMoved = 0;
        this.value = value;
        this.cursorPos = value.length;
        this.selectionStart = value.length;

        this.clipText();
    }

    clear() {
        this.setValue();
        // this.value = '';
        // this.timeSinceMoved = 0;
        // this.cursorPos = 0;
        // this.selection = false;
        // this.selectionStart = this.cursorPos;
        
        // this.clipText();
    }

    focus() {
        this.focused = true;
        this.timeSinceMoved = 0;
        this.onFocus();
    }

    blur() {
        this.focused = false;
        this.shiftPressed = false;
        this.mousePressed = false;
        this.onBlur();
    }

    changeScreen(leavingScreen) {
        if (leavingScreen) {
            this.blur();
        }
    }

    show() {
        // Rectangle
        let fillColour = this.getColour('fill');
        if (fillColour != -1) {
            fill(fillColour);
        } else {
            noFill();
        }

        let strokeColour = this.getColour('stroke');
        if (strokeColour != -1) {
            stroke(strokeColour);
            strokeWeight(1);
        } else {
            noStroke();
        }

        rect(this.width * 0.5, -this.height * 0.5, this.width, this.height);

        // Selection
        textSize(this.textSize);

        let selectionColour = this.getColour('selection');
        if (selectionColour != -1) {
            let leftEnd = this.selectionStart;
            let rightEnd = this.cursorPos;
            if (leftEnd > rightEnd) {
                let temp = leftEnd;
                leftEnd = rightEnd;
                rightEnd = temp;
            }
            if (this.selectionStart != this.cursorPos && (leftEnd < this.visibleText[1] && rightEnd > this.visibleText[0])) {
                let selectionStart = Math.max(leftEnd, this.visibleText[0]);
                let selectionEnd = Math.min(rightEnd, this.visibleText[1]);

                let wStart = this.padding;
                if (!this.fixedLeft) wStart += this.textW - this.visibleTextWidth;

                let wLeft = textWidth(this.value.substring(this.visibleText[0], selectionStart));
                let wRight = textWidth(this.value.substring(this.visibleText[0], selectionEnd));

                noStroke();
                fill(selectionColour);
                rect(wStart + (wLeft + wRight) * 0.5, -this.height * 0.5, wRight - wLeft, this.textSize)
            }
        }

        // Text
        textAlign(LEFT);
        noStroke();

        if (this.value.length > 0) {
            fill(this.getColour('text'));
            if (this.fixedLeft) {
                text(this.visibleTextString, this.padding, - 0.5 * this.height + this.textSize / 3);
            } else {
                text(this.visibleTextString, this.padding + this.textW - this.visibleTextWidth, - 0.5 * this.height + this.textSize / 3);
            }
        } else if (!this.focused) {
            let defaultColour = this.getColour('default');
            if (defaultColour != -1) {
                fill(defaultColour);
            } else {
                fill(this.getColour('text'));
            }
            text(this.default, this.padding, - 0.5 * this.height + this.textSize / 3);
        }

        // Cursor
        if (this.focused && this.cursorPos >= this.visibleText[0] && this.cursorPos <= this.visibleText[1] && this.timeSinceMoved % 60 < 30) {
            let w = this.padding + textWidth(this.value.substring(this.visibleText[0], this.cursorPos));
            if (!this.fixedLeft) w += this.textW - this.visibleTextWidth;

            stroke(this.getColour('text'));
            strokeWeight(2);
            line(w, -this.padding, w, -this.padding - this.textSize);
        }
    }

    isLetter(index) {
        let charCode = this.value[index].toLowerCase().charCodeAt()
        return charCode >= 97 && charCode <= 122;
    }
}

/* harmony default export */ var textbox = (main.Textbox);
// CONCATENATED MODULE: ./src/core/init.js


const globalFunctions = ['setupUI', 'addScreen', 'getScreen', 'setScreen', 'addPopup', 'openPopup', 'closePopup', 'closeAllPopups', 'getActiveScreen', 'addElement', 'getElement', 'updateUI', 'drawUI', 'setFont', 'setSounds', 'resizeUI', 'addTheme', 'setTheme', 'setCursors'];

function createUI(options) {
    window.p5ui = new main(options);

    addGlobalFunctions(window.p5ui);
}

function addGlobalFunctions(ui) {
    for (let func of globalFunctions) {
        window[func] = (...args) => ui[func](...args);
    }
}

/* harmony default export */ var init = (createUI);
// CONCATENATED MODULE: ./src/index.js


// Core



// Elements














window.P5UI = main;
window.createUI = init;

/***/ })
/******/ ]);