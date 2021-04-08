import Group from '../graphic/Group';
import ZRImage from '../graphic/Image';
import Circle from '../graphic/shape/Circle';
import Rect from '../graphic/shape/Rect';
import Ellipse from '../graphic/shape/Ellipse';
import Line from '../graphic/shape/Line';
import Path from '../graphic/Path';
import Polygon from '../graphic/shape/Polygon';
import Polyline from '../graphic/shape/Polyline';
import * as matrix from '../core/matrix';
import { createFromString } from './path';
import { extend, defaults, trim, each, map } from '../core/util';
import LinearGradient from '../graphic/LinearGradient';
import TSpan from '../graphic/TSpan';
import { parseXML } from './parseXML';
var DILIMITER_REG = /[\s,]+/;
var nodeParsers;
var SVGParser = (function () {
    function SVGParser() {
        this._defs = {};
        this._root = null;
        this._isDefine = false;
        this._isText = false;
    }
    SVGParser.prototype.parse = function (xml, opt) {
        opt = opt || {};
        var svg = parseXML(xml);
        if (!svg) {
            throw new Error('Illegal svg');
        }
        var root = new Group();
        this._root = root;
        var viewBox = svg.getAttribute('viewBox') || '';
        var width = parseFloat((svg.getAttribute('width') || opt.width));
        var height = parseFloat((svg.getAttribute('height') || opt.height));
        isNaN(width) && (width = null);
        isNaN(height) && (height = null);
        parseAttributes(svg, root, null, true);
        var child = svg.firstChild;
        while (child) {
            this._parseNode(child, root);
            child = child.nextSibling;
        }
        var viewBoxRect;
        var viewBoxTransform;
        if (viewBox) {
            var viewBoxArr = trim(viewBox).split(DILIMITER_REG);
            if (viewBoxArr.length >= 4) {
                viewBoxRect = {
                    x: parseFloat((viewBoxArr[0] || 0)),
                    y: parseFloat((viewBoxArr[1] || 0)),
                    width: parseFloat(viewBoxArr[2]),
                    height: parseFloat(viewBoxArr[3])
                };
            }
        }
        if (viewBoxRect && width != null && height != null) {
            viewBoxTransform = makeViewBoxTransform(viewBoxRect, width, height);
            if (!opt.ignoreViewBox) {
                var elRoot = root;
                root = new Group();
                root.add(elRoot);
                elRoot.scaleX = elRoot.scaleY = viewBoxTransform.scale;
                elRoot.x = viewBoxTransform.x;
                elRoot.y = viewBoxTransform.y;
            }
        }
        if (!opt.ignoreRootClip && width != null && height != null) {
            root.setClipPath(new Rect({
                shape: { x: 0, y: 0, width: width, height: height }
            }));
        }
        return {
            root: root,
            width: width,
            height: height,
            viewBoxRect: viewBoxRect,
            viewBoxTransform: viewBoxTransform
        };
    };
    SVGParser.prototype._parseNode = function (xmlNode, parentGroup) {
        var nodeName = xmlNode.nodeName.toLowerCase();
        if (nodeName === 'defs') {
            this._isDefine = true;
        }
        else if (nodeName === 'text') {
            this._isText = true;
        }
        var el;
        if (this._isDefine) {
            var parser = defineParsers[nodeName];
            if (parser) {
                var def = parser.call(this, xmlNode);
                var id = xmlNode.getAttribute('id');
                if (id) {
                    this._defs[id] = def;
                }
            }
        }
        else {
            var parser = nodeParsers[nodeName];
            if (parser) {
                el = parser.call(this, xmlNode, parentGroup);
                parentGroup.add(el);
            }
        }
        if (el) {
            var child = xmlNode.firstChild;
            while (child) {
                if (child.nodeType === 1) {
                    this._parseNode(child, el);
                }
                if (child.nodeType === 3 && this._isText) {
                    this._parseText(child, el);
                }
                child = child.nextSibling;
            }
        }
        if (nodeName === 'defs') {
            this._isDefine = false;
        }
        else if (nodeName === 'text') {
            this._isText = false;
        }
    };
    SVGParser.prototype._parseText = function (xmlNode, parentGroup) {
        if (xmlNode.nodeType === 1) {
            var dx = xmlNode.getAttribute('dx') || 0;
            var dy = xmlNode.getAttribute('dy') || 0;
            this._textX += parseFloat(dx);
            this._textY += parseFloat(dy);
        }
        var text = new TSpan({
            style: {
                text: xmlNode.textContent
            },
            x: this._textX || 0,
            y: this._textY || 0
        });
        inheritStyle(parentGroup, text);
        parseAttributes(xmlNode, text, this._defs);
        var textStyle = text.style;
        var fontSize = textStyle.fontSize;
        if (fontSize && fontSize < 9) {
            textStyle.fontSize = 9;
            text.scaleX *= fontSize / 9;
            text.scaleY *= fontSize / 9;
        }
        var font = (textStyle.fontSize || textStyle.fontFamily) && [
            textStyle.fontStyle,
            textStyle.fontWeight,
            (textStyle.fontSize || 12) + 'px',
            textStyle.fontFamily || 'sans-serif'
        ].join(' ');
        textStyle.font = font;
        var rect = text.getBoundingRect();
        this._textX += rect.width;
        parentGroup.add(text);
        return text;
    };
    SVGParser.internalField = (function () {
        nodeParsers = {
            'g': function (xmlNode, parentGroup) {
                var g = new Group();
                inheritStyle(parentGroup, g);
                parseAttributes(xmlNode, g, this._defs);
                return g;
            },
            'rect': function (xmlNode, parentGroup) {
                var rect = new Rect();
                inheritStyle(parentGroup, rect);
                parseAttributes(xmlNode, rect, this._defs);
                rect.setShape({
                    x: parseFloat(xmlNode.getAttribute('x') || '0'),
                    y: parseFloat(xmlNode.getAttribute('y') || '0'),
                    width: parseFloat(xmlNode.getAttribute('width') || '0'),
                    height: parseFloat(xmlNode.getAttribute('height') || '0')
                });
                return rect;
            },
            'circle': function (xmlNode, parentGroup) {
                var circle = new Circle();
                inheritStyle(parentGroup, circle);
                parseAttributes(xmlNode, circle, this._defs);
                circle.setShape({
                    cx: parseFloat(xmlNode.getAttribute('cx') || '0'),
                    cy: parseFloat(xmlNode.getAttribute('cy') || '0'),
                    r: parseFloat(xmlNode.getAttribute('r') || '0')
                });
                return circle;
            },
            'line': function (xmlNode, parentGroup) {
                var line = new Line();
                inheritStyle(parentGroup, line);
                parseAttributes(xmlNode, line, this._defs);
                line.setShape({
                    x1: parseFloat(xmlNode.getAttribute('x1') || '0'),
                    y1: parseFloat(xmlNode.getAttribute('y1') || '0'),
                    x2: parseFloat(xmlNode.getAttribute('x2') || '0'),
                    y2: parseFloat(xmlNode.getAttribute('y2') || '0')
                });
                return line;
            },
            'ellipse': function (xmlNode, parentGroup) {
                var ellipse = new Ellipse();
                inheritStyle(parentGroup, ellipse);
                parseAttributes(xmlNode, ellipse, this._defs);
                ellipse.setShape({
                    cx: parseFloat(xmlNode.getAttribute('cx') || '0'),
                    cy: parseFloat(xmlNode.getAttribute('cy') || '0'),
                    rx: parseFloat(xmlNode.getAttribute('rx') || '0'),
                    ry: parseFloat(xmlNode.getAttribute('ry') || '0')
                });
                return ellipse;
            },
            'polygon': function (xmlNode, parentGroup) {
                var pointsStr = xmlNode.getAttribute('points');
                var pointsArr;
                if (pointsStr) {
                    pointsArr = parsePoints(pointsStr);
                }
                var polygon = new Polygon({
                    shape: {
                        points: pointsArr || []
                    }
                });
                inheritStyle(parentGroup, polygon);
                parseAttributes(xmlNode, polygon, this._defs);
                return polygon;
            },
            'polyline': function (xmlNode, parentGroup) {
                var path = new Path();
                inheritStyle(parentGroup, path);
                parseAttributes(xmlNode, path, this._defs);
                var pointsStr = xmlNode.getAttribute('points');
                var pointsArr;
                if (pointsStr) {
                    pointsArr = parsePoints(pointsStr);
                }
                var polyline = new Polyline({
                    shape: {
                        points: pointsArr || []
                    }
                });
                return polyline;
            },
            'image': function (xmlNode, parentGroup) {
                var img = new ZRImage();
                inheritStyle(parentGroup, img);
                parseAttributes(xmlNode, img, this._defs);
                img.setStyle({
                    image: xmlNode.getAttribute('xlink:href'),
                    x: +xmlNode.getAttribute('x'),
                    y: +xmlNode.getAttribute('y'),
                    width: +xmlNode.getAttribute('width'),
                    height: +xmlNode.getAttribute('height')
                });
                return img;
            },
            'text': function (xmlNode, parentGroup) {
                var x = xmlNode.getAttribute('x') || '0';
                var y = xmlNode.getAttribute('y') || '0';
                var dx = xmlNode.getAttribute('dx') || '0';
                var dy = xmlNode.getAttribute('dy') || '0';
                this._textX = parseFloat(x) + parseFloat(dx);
                this._textY = parseFloat(y) + parseFloat(dy);
                var g = new Group();
                inheritStyle(parentGroup, g);
                parseAttributes(xmlNode, g, this._defs);
                return g;
            },
            'tspan': function (xmlNode, parentGroup) {
                var x = xmlNode.getAttribute('x');
                var y = xmlNode.getAttribute('y');
                if (x != null) {
                    this._textX = parseFloat(x);
                }
                if (y != null) {
                    this._textY = parseFloat(y);
                }
                var dx = xmlNode.getAttribute('dx') || 0;
                var dy = xmlNode.getAttribute('dy') || 0;
                var g = new Group();
                inheritStyle(parentGroup, g);
                parseAttributes(xmlNode, g, this._defs);
                this._textX += dx;
                this._textY += dy;
                return g;
            },
            'path': function (xmlNode, parentGroup) {
                var d = xmlNode.getAttribute('d') || '';
                var path = createFromString(d);
                inheritStyle(parentGroup, path);
                parseAttributes(xmlNode, path, this._defs);
                return path;
            }
        };
    })();
    return SVGParser;
}());
var defineParsers = {
    'lineargradient': function (xmlNode) {
        var x1 = parseInt(xmlNode.getAttribute('x1') || '0', 10);
        var y1 = parseInt(xmlNode.getAttribute('y1') || '0', 10);
        var x2 = parseInt(xmlNode.getAttribute('x2') || '10', 10);
        var y2 = parseInt(xmlNode.getAttribute('y2') || '0', 10);
        var gradient = new LinearGradient(x1, y1, x2, y2);
        _parseGradientColorStops(xmlNode, gradient);
        return gradient;
    }
};
function _parseGradientColorStops(xmlNode, gradient) {
    var stop = xmlNode.firstChild;
    while (stop) {
        if (stop.nodeType === 1) {
            var offsetStr = stop.getAttribute('offset');
            var offset = void 0;
            if (offsetStr.indexOf('%') > 0) {
                offset = parseInt(offsetStr, 10) / 100;
            }
            else if (offsetStr) {
                offset = parseFloat(offsetStr);
            }
            else {
                offset = 0;
            }
            var stopColor = stop.getAttribute('stop-color') || '#000000';
            gradient.colorStops.push({
                offset: offset,
                color: stopColor
            });
        }
        stop = stop.nextSibling;
    }
}
function inheritStyle(parent, child) {
    if (parent && parent.__inheritedStyle) {
        if (!child.__inheritedStyle) {
            child.__inheritedStyle = {};
        }
        defaults(child.__inheritedStyle, parent.__inheritedStyle);
    }
}
function parsePoints(pointsString) {
    var list = trim(pointsString).split(DILIMITER_REG);
    var points = [];
    for (var i = 0; i < list.length; i += 2) {
        var x = parseFloat(list[i]);
        var y = parseFloat(list[i + 1]);
        points.push([x, y]);
    }
    return points;
}
var attributesMap = {
    'fill': 'fill',
    'stroke': 'stroke',
    'stroke-width': 'lineWidth',
    'opacity': 'opacity',
    'fill-opacity': 'fillOpacity',
    'stroke-opacity': 'strokeOpacity',
    'stroke-dasharray': 'lineDash',
    'stroke-dashoffset': 'lineDashOffset',
    'stroke-linecap': 'lineCap',
    'stroke-linejoin': 'lineJoin',
    'stroke-miterlimit': 'miterLimit',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-style': 'fontStyle',
    'font-weight': 'fontWeight',
    'text-align': 'textAlign',
    'alignment-baseline': 'textBaseline'
};
function parseAttributes(xmlNode, el, defs, onlyInlineStyle) {
    var disp = el;
    var zrStyle = disp.__inheritedStyle || {};
    if (xmlNode.nodeType === 1) {
        parseTransformAttribute(xmlNode, el);
        extend(zrStyle, parseStyleAttribute(xmlNode));
        if (!onlyInlineStyle) {
            for (var svgAttrName in attributesMap) {
                if (attributesMap.hasOwnProperty(svgAttrName)) {
                    var attrValue = xmlNode.getAttribute(svgAttrName);
                    if (attrValue != null) {
                        zrStyle[attributesMap[svgAttrName]] = attrValue;
                    }
                }
            }
        }
    }
    disp.style = disp.style || {};
    zrStyle.fill != null && (disp.style.fill = getPaint(zrStyle.fill, defs));
    zrStyle.stroke != null && (disp.style.stroke = getPaint(zrStyle.stroke, defs));
    each([
        'lineWidth', 'opacity', 'fillOpacity', 'strokeOpacity', 'miterLimit', 'fontSize'
    ], function (propName) {
        zrStyle[propName] != null && (disp.style[propName] = parseFloat(zrStyle[propName]));
    });
    if (!zrStyle.textBaseline || zrStyle.textBaseline === 'auto') {
        zrStyle.textBaseline = 'alphabetic';
    }
    if (zrStyle.textBaseline === 'alphabetic') {
        zrStyle.textBaseline = 'bottom';
    }
    if (zrStyle.textAlign === 'start') {
        zrStyle.textAlign = 'left';
    }
    if (zrStyle.textAlign === 'end') {
        zrStyle.textAlign = 'right';
    }
    each(['lineDashOffset', 'lineCap', 'lineJoin',
        'fontWeight', 'fontFamily', 'fontStyle', 'textAlign', 'textBaseline'
    ], function (propName) {
        zrStyle[propName] != null && (disp.style[propName] = zrStyle[propName]);
    });
    if (zrStyle.lineDash) {
        disp.style.lineDash = map(trim(zrStyle.lineDash).split(DILIMITER_REG), function (str) {
            return parseFloat(str);
        });
    }
    disp.__inheritedStyle = zrStyle;
}
var urlRegex = /url\(\s*#(.*?)\)/;
function getPaint(str, defs) {
    var urlMatch = defs && str && str.match(urlRegex);
    if (urlMatch) {
        var url = trim(urlMatch[1]);
        var def = defs[url];
        return def;
    }
    return str;
}
var transformRegex = /(translate|scale|rotate|skewX|skewY|matrix)\(([\-\s0-9\.e,]*)\)/g;
function parseTransformAttribute(xmlNode, node) {
    var transform = xmlNode.getAttribute('transform');
    if (transform) {
        transform = transform.replace(/,/g, ' ');
        var transformOps_1 = [];
        var m = null;
        transform.replace(transformRegex, function (str, type, value) {
            transformOps_1.push(type, value);
            return '';
        });
        for (var i = transformOps_1.length - 1; i > 0; i -= 2) {
            var value = transformOps_1[i];
            var type = transformOps_1[i - 1];
            var valueArr = void 0;
            m = m || matrix.create();
            switch (type) {
                case 'translate':
                    valueArr = trim(value).split(DILIMITER_REG);
                    matrix.translate(m, m, [parseFloat(valueArr[0]), parseFloat(valueArr[1] || '0')]);
                    break;
                case 'scale':
                    valueArr = trim(value).split(DILIMITER_REG);
                    matrix.scale(m, m, [parseFloat(valueArr[0]), parseFloat(valueArr[1] || valueArr[0])]);
                    break;
                case 'rotate':
                    valueArr = trim(value).split(DILIMITER_REG);
                    matrix.rotate(m, m, parseFloat(valueArr[0]));
                    break;
                case 'skew':
                    valueArr = trim(value).split(DILIMITER_REG);
                    console.warn('Skew transform is not supported yet');
                    break;
                case 'matrix':
                    valueArr = trim(value).split(DILIMITER_REG);
                    m[0] = parseFloat(valueArr[0]);
                    m[1] = parseFloat(valueArr[1]);
                    m[2] = parseFloat(valueArr[2]);
                    m[3] = parseFloat(valueArr[3]);
                    m[4] = parseFloat(valueArr[4]);
                    m[5] = parseFloat(valueArr[5]);
                    break;
            }
        }
        node.setLocalTransform(m);
    }
}
var styleRegex = /([^\s:;]+)\s*:\s*([^:;]+)/g;
function parseStyleAttribute(xmlNode) {
    var style = xmlNode.getAttribute('style');
    var result = {};
    if (!style) {
        return result;
    }
    var styleList = {};
    styleRegex.lastIndex = 0;
    var styleRegResult;
    while ((styleRegResult = styleRegex.exec(style)) != null) {
        styleList[styleRegResult[1]] = styleRegResult[2];
    }
    for (var svgAttrName in attributesMap) {
        if (attributesMap.hasOwnProperty(svgAttrName) && styleList[svgAttrName] != null) {
            result[attributesMap[svgAttrName]] = styleList[svgAttrName];
        }
    }
    return result;
}
export function makeViewBoxTransform(viewBoxRect, width, height) {
    var scaleX = width / viewBoxRect.width;
    var scaleY = height / viewBoxRect.height;
    var scale = Math.min(scaleX, scaleY);
    return {
        scale: scale,
        x: -(viewBoxRect.x + viewBoxRect.width / 2) * scale + width / 2,
        y: -(viewBoxRect.y + viewBoxRect.height / 2) * scale + height / 2
    };
}
export function parseSVG(xml, opt) {
    var parser = new SVGParser();
    return parser.parse(xml, opt);
}
export { parseXML };
