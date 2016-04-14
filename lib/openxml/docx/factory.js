'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = factory;

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attr(node, name) {
	return node ? node.attr(name) : undefined;
}

function factory(wXml, doc, parent, more) {
	var tag = wXml.localName,
	    swap;

	var extended = factory.extend.apply(factory, arguments);

	if (extended) return extended;else if ('document' == tag) return new (require('./model/document'))(wXml, doc, parent);else if ('styles' == tag) return new (require('./model/documentStyles'))(wXml, doc);else if ('abstractNum' == tag) return new (require('./model/style/numberingDefinition'))(wXml, doc);else if ('num' == tag) return new (require('./model/style/list'))(wXml, doc);else if ('style' == tag) {
		switch (wXml.attr('w:type')) {
			case 'paragraph':
				return new (require('./model/style/paragraph'))(wXml, doc);
			case 'character':
				return new (require('./model/style/inline'))(wXml, doc);
			case 'table':
				return new (require('./model/style/table'))(wXml, doc);
			case 'numbering':
				return new (require('./model/style/numbering'))(wXml, doc);
		}
	} else if ('docDefaults' == tag) return new (require('./model/style/document'))(wXml, doc);else if ('body' == tag) return new (require('./model/body'))(wXml, doc, parent);else if ('p' == tag) {
		var styleId = attr(wXml.$1('>pPr>pStyle'), 'w:val'),
		    style = doc.style.get(styleId);
		if (wXml.$1('>pPr>numPr') || style && style.getNumId() != -1) return new (require('./model/list'))(wXml, doc, parent);

		if (style && style.getOutlineLevel() != -1) return new (require('./model/heading'))(wXml, doc, parent);

		return new (require('./model/paragraph'))(wXml, doc, parent);
	} else if ('r' == tag) {
		var style = doc.style.get(attr(wXml.$1('>rPr>rStyle'), 'w:val'));
		if (style && style.getOutlineLevel() != -1) return new (require('./model/headingInline'))(wXml, doc, parent);else if (wXml.childNodes.length == 1 || wXml.childNodes == 2 && wXml.firstChild.localName == 'rPr') {
			switch (wXml.lastChild.localName) {
				case 'fldChar':
				case 'instrText':
					return factory(wXml.lastChild, doc, parent);
			}
		}

		return new (require('./model/inline'))(wXml, doc, parent);
	} else if ('instrText' == tag) return new (require('./model/fieldInstruct'))(wXml, doc, parent);else if ('t' == tag) return new (require('./model/text'))(wXml, doc, parent);else if ('sym' == tag && wXml.parentNode.localName == 'r') return new (require('./model/symbol'))(wXml, doc, parent);else if ('softHyphen' == tag && wXml.parentNode.localName == 'r') return new (require('./model/softHyphen'))(wXml, doc, parent);else if ('noBreakHyphen' == tag && wXml.parentNode.localName == 'r') return new (require('./model/noBreakHyphen'))(wXml, doc, parent);else if ('tab' == tag && wXml.parentNode.localName == 'r') return new (require('./model/tab'))(wXml, doc, parent);else if ('fldSimple' == tag) return new (require('./model/fieldSimple'))(wXml, doc, parent);else if ('fldChar' == tag) {
		switch (wXml.attr('w:fldCharType')) {
			case 'begin':
				return new (require('./model/fieldBegin'))(wXml, doc, parent);
				break;
			case 'end':
				return new (require('./model/fieldEnd'))(wXml, doc, parent);
				break;
			case 'separate':
				return new (require('./model/fieldSeparate'))(wXml, doc, parent);
				break;
		}
	} else if ('tbl' == tag) return new (require('./model/table'))(wXml, doc, parent);else if ('tr' == tag) return new (require('./model/row'))(wXml, doc, parent);else if ('tc' == tag) return new (require('./model/cell'))(wXml, doc, parent);else if ('br' == tag) return new (require('./model/br'))(wXml, doc, parent);else if ('hyperlink' == tag && 'p' == wXml.parentNode.localName) return new (require('./model/hyperlink'))(wXml, doc, parent);else if ('AlternateContent' == tag) return new (require('./model/drawingAnchor'))(wXml, doc, parent);else if ('wsp' == tag) return new (require('./model/shape'))(wXml, doc, parent);else if ('inline' == tag) {
		var type = wXml.$1('>graphic>graphicData').attr('uri').split('/').pop();
		switch (type) {
			case 'picture':
				return new (require('./model/image'))(wXml, doc, parent);
			case 'diagram':
				return new (require('./model/diagram'))(wXml, doc, parent);
			case 'chart':
				return new (require('./model/chart'))(wXml, doc, parent);
			default:
				console.error('inline ' + type + ' is not suppored yet.');
		}
	} else if ('sdt' == tag) {
		var elBinding = wXml.$1('>sdtPr>dataBinding');
		if (elBinding) {
			//properties
			var path = attr(elBinding, 'w:xpath'),
			    d = path.split(/[\/\:\[]/),
			    name = (d.pop(), d.pop());
			return new (require('./model/documentProperty'))(wXml, doc, parent, name);
		} else {
			//controls
			var elType = wXml.$1('>sdtPr').$1("text, picture, docPartList, comboBox, dropDownList, date, checkbox");
			tag = elType ? elType.localName : 'richtext';

			extended = factory.extendControl.apply(factory, [tag].concat(Array.prototype.slice.call(arguments)));

			if (extended) return extended;else if ('text' == tag) return new (require('./model/control/text'))(wXml, doc, parent);else if ('picture' == tag) return new (require('./model/control/picture'))(wXml, doc, parent);else if ('docPartList' == tag) return new (require('./model/control/gallery'))(wXml, doc, parent);else if ('comboBox' == tag) return new (require('./model/control/combobox'))(wXml, doc, parent);else if ('dropDownList' == tag) return new (require('./model/control/dropdown'))(wXml, doc, parent);else if ('date' == tag) return new (require('./model/control/date'))(wXml, doc, parent);else if ('checkbox' == tag) return new (require('./model/control/checkbox'))(wXml, doc, parent);else if ('richtext' == tag) return new (require('./model/control/richtext'))(wXml, doc, parent);
		}
	} else if ('bookmarkStart' == tag) return new (require('./model/bookmarkStart'))(wXml, doc, parent);else if ('bookmarkEnd' == tag) return new (require('./model/bookmarkEnd'))(wXml, doc, parent);else if ('oMathPara' == tag) return new (require('./model/equation'))(wXml, doc, parent);else if ('object' == tag) return new (require('./model/OLE'))(wXml, doc, parent);else if ('sectPr' == tag) return new (require('./model/section'))(wXml, doc, parent);

	return new _model2.default(wXml, doc, parent);
}

/**
* you can extend control
*/
factory.extendControl = function (type, wXml, doc, parent) {};

factory.extend = function () {};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vcGVueG1sL2RvY3gvZmFjdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFNd0I7O0FBTnhCOzs7Ozs7QUFFQSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW1CLElBQW5CLEVBQXdCO0FBQ3ZCLFFBQU8sT0FBSyxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQUwsR0FBcUIsU0FBckIsQ0FEZ0I7Q0FBeEI7O0FBSWUsU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCLEdBQXZCLEVBQTRCLE1BQTVCLEVBQW9DLElBQXBDLEVBQXlDO0FBQ3ZELEtBQUksTUFBSSxLQUFLLFNBQUw7S0FBZ0IsSUFBeEIsQ0FEdUQ7O0FBR3ZELEtBQUksV0FBUyxRQUFRLE1BQVIsZ0JBQWtCLFNBQWxCLENBQVQsQ0FIbUQ7O0FBS3ZELEtBQUcsUUFBSCxFQUNDLE9BQU8sUUFBUCxDQURELEtBRUssSUFBRyxjQUFZLEdBQVosRUFDUCxPQUFPLEtBQUssUUFBUSxrQkFBUixFQUFMLENBQWtDLElBQWxDLEVBQXVDLEdBQXZDLEVBQTRDLE1BQTVDLENBQVAsQ0FESSxLQUVBLElBQUcsWUFBVSxHQUFWLEVBQ1AsT0FBTyxLQUFLLFFBQVEsd0JBQVIsRUFBTCxDQUF3QyxJQUF4QyxFQUE2QyxHQUE3QyxDQUFQLENBREksS0FFQSxJQUFHLGlCQUFlLEdBQWYsRUFDUCxPQUFPLEtBQUssUUFBUSxtQ0FBUixFQUFMLENBQW1ELElBQW5ELEVBQXdELEdBQXhELENBQVAsQ0FESSxLQUVBLElBQUcsU0FBTyxHQUFQLEVBQ1AsT0FBTyxLQUFLLFFBQVEsb0JBQVIsRUFBTCxDQUFvQyxJQUFwQyxFQUF5QyxHQUF6QyxDQUFQLENBREksS0FFQSxJQUFHLFdBQVMsR0FBVCxFQUFhO0FBQ3BCLFVBQU8sS0FBSyxJQUFMLENBQVUsUUFBVixDQUFQO0FBQ0EsUUFBSyxXQUFMO0FBQ0MsV0FBTyxLQUFLLFFBQVEseUJBQVIsRUFBTCxDQUF5QyxJQUF6QyxFQUE4QyxH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UCxPQUFPLEtBQUssUUFBUSxxQkFBUixFQUFMLENBQXFDLElBQXJDLEVBQTBDLEdBQTFDLEVBQThDLE1BQTlDLENBQVAsQ0FESSxLQUVBLElBQUcsZUFBYSxHQUFiLEVBQ1AsT0FBTyxLQUFLLFFBQVEsa0JBQVIsRUFBTCxDQUFrQyxJQUFsQyxFQUF1QyxHQUF2QyxFQUEyQyxNQUEzQyxDQUFQLENBREksS0FFQSxJQUFHLFlBQVUsR0FBVixFQUNQLE9BQU8sS0FBSyxRQUFRLGFBQVIsRUFBTCxDQUE2QixJQUE3QixFQUFrQyxHQUFsQyxFQUFzQyxNQUF0QyxDQUFQLENBREksS0FFQSxJQUFHLFlBQVUsR0FBVixFQUNQLE9BQU8sS0FBSyxRQUFRLGlCQUFSLEVBQUwsQ0FBaUMsSUFBakMsRUFBc0MsR0FBdEMsRUFBMEMsTUFBMUMsQ0FBUCxDQURJOztBQUdMLFFBQU8sb0JBQVUsSUFBVixFQUFlLEdBQWYsRUFBbUIsTUFBbkIsQ0FBUCxDQXJKdUQ7Q0FBekM7Ozs7O0FBMkpmLFFBQVEsYUFBUixHQUFzQixVQUFTLElBQVQsRUFBYyxJQUFkLEVBQW1CLEdBQW5CLEVBQXVCLE1BQXZCLEVBQThCLEVBQTlCOztBQUV0QixRQUFRLE1BQVIsR0FBZSxZQUFVLEVBQVYiLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2RlbCBmcm9tICcuL21vZGVsJ1xuXG5mdW5jdGlvbiBhdHRyKG5vZGUsbmFtZSl7XG5cdHJldHVybiBub2RlP25vZGUuYXR0cihuYW1lKTp1bmRlZmluZWRcbn1cblxuZXhwb3J0IGRlZmF1bHRcdGZ1bmN0aW9uIGZhY3Rvcnkod1htbCwgZG9jLCBwYXJlbnQsIG1vcmUpe1xuXHR2YXIgdGFnPXdYbWwubG9jYWxOYW1lLCBzd2FwO1xuXHRcblx0bGV0IGV4dGVuZGVkPWZhY3RvcnkuZXh0ZW5kKC4uLmFyZ3VtZW50cylcblx0XG5cdGlmKGV4dGVuZGVkKVxuXHRcdHJldHVybiBleHRlbmRlZFxuXHRlbHNlIGlmKCdkb2N1bWVudCc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2RvY3VtZW50JykpKHdYbWwsZG9jLCBwYXJlbnQpXG5cdGVsc2UgaWYoJ3N0eWxlcyc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2RvY3VtZW50U3R5bGVzJykpKHdYbWwsZG9jKVxuXHRlbHNlIGlmKCdhYnN0cmFjdE51bSc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N0eWxlL251bWJlcmluZ0RlZmluaXRpb24nKSkod1htbCxkb2MpXG5cdGVsc2UgaWYoJ251bSc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N0eWxlL2xpc3QnKSkod1htbCxkb2MpXG5cdGVsc2UgaWYoJ3N0eWxlJz09dGFnKXtcblx0XHRzd2l0Y2god1htbC5hdHRyKCd3OnR5cGUnKSl7XG5cdFx0Y2FzZSAncGFyYWdyYXBoJzpcblx0XHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvc3R5bGUvcGFyYWdyYXBoJykpKHdYbWwsZG9jKVxuXHRcdGNhc2UgJ2NoYXJhY3Rlcic6XG5cdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N0eWxlL2lubGluZScpKSh3WG1sLGRvYylcblx0XHRjYXNlICd0YWJsZSc6XG5cdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N0eWxlL3RhYmxlJykpKHdYbWwsZG9jKVxuXHRcdGNhc2UgJ251bWJlcmluZyc6XG5cdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N0eWxlL251bWJlcmluZycpKSh3WG1sLGRvYylcblx0XHR9XG5cdH1lbHNlIGlmKCdkb2NEZWZhdWx0cyc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N0eWxlL2RvY3VtZW50JykpKHdYbWwsZG9jKVxuXHRlbHNlIGlmKCdib2R5Jz09dGFnKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvYm9keScpKSh3WG1sLGRvYywgcGFyZW50KVxuXHRlbHNlIGlmKCdwJz09dGFnKXtcblx0XHR2YXIgc3R5bGVJZD1hdHRyKHdYbWwuJDEoJz5wUHI+cFN0eWxlJyksJ3c6dmFsJyksIHN0eWxlPWRvYy5zdHlsZS5nZXQoc3R5bGVJZClcblx0XHRpZih3WG1sLiQxKCc+cFByPm51bVByJykgfHwgKHN0eWxlICYmIHN0eWxlLmdldE51bUlkKCkhPS0xKSlcblx0XHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvbGlzdCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cblx0XHRpZihzdHlsZSAmJiBzdHlsZS5nZXRPdXRsaW5lTGV2ZWwoKSE9LTEpXG5cdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2hlYWRpbmcnKSkod1htbCxkb2MsIHBhcmVudClcblxuXG5cblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3BhcmFncmFwaCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdH1lbHNlIGlmKCdyJz09dGFnKXtcblx0XHR2YXIgc3R5bGU9ZG9jLnN0eWxlLmdldChhdHRyKHdYbWwuJDEoJz5yUHI+clN0eWxlJyksJ3c6dmFsJykpXG5cdFx0aWYoc3R5bGUgJiYgc3R5bGUuZ2V0T3V0bGluZUxldmVsKCkhPS0xKVxuXHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9oZWFkaW5nSW5saW5lJykpKHdYbWwsZG9jLHBhcmVudClcblx0XHRlbHNlIGlmKHdYbWwuY2hpbGROb2Rlcy5sZW5ndGg9PTEgfHwgKHdYbWwuY2hpbGROb2Rlcz09MiAmJiB3WG1sLmZpcnN0Q2hpbGQubG9jYWxOYW1lPT0nclByJykpe1xuXHRcdFx0c3dpdGNoKHdYbWwubGFzdENoaWxkLmxvY2FsTmFtZSl7XG5cdFx0XHRjYXNlICdmbGRDaGFyJzpcblx0XHRcdGNhc2UgJ2luc3RyVGV4dCc6XG5cdFx0XHRcdHJldHVybiBmYWN0b3J5KHdYbWwubGFzdENoaWxkLGRvYyxwYXJlbnQpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9pbmxpbmUnKSkod1htbCxkb2MscGFyZW50KVxuXHR9ZWxzZSBpZignaW5zdHJUZXh0Jz09dGFnKVxuXHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9maWVsZEluc3RydWN0JykpKHdYbWwsIGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ3QnPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC90ZXh0JykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZignc3ltJz09dGFnICYmIHdYbWwucGFyZW50Tm9kZS5sb2NhbE5hbWU9PSdyJylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3N5bWJvbCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ3NvZnRIeXBoZW4nPT10YWcgJiYgd1htbC5wYXJlbnROb2RlLmxvY2FsTmFtZT09J3InKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvc29mdEh5cGhlbicpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ25vQnJlYWtIeXBoZW4nPT10YWcgJiYgd1htbC5wYXJlbnROb2RlLmxvY2FsTmFtZT09J3InKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvbm9CcmVha0h5cGhlbicpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ3RhYic9PXRhZyAmJiB3WG1sLnBhcmVudE5vZGUubG9jYWxOYW1lPT0ncicpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC90YWInKSkod1htbCxkb2MscGFyZW50KVxuXHRlbHNlIGlmKCdmbGRTaW1wbGUnPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9maWVsZFNpbXBsZScpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ2ZsZENoYXInPT10YWcpe1xuXHRcdHN3aXRjaCh3WG1sLmF0dHIoJ3c6ZmxkQ2hhclR5cGUnKSl7XG5cdFx0Y2FzZSAnYmVnaW4nOlxuXHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9maWVsZEJlZ2luJykpKHdYbWwsZG9jLHBhcmVudClcblx0XHRicmVha1xuXHRcdGNhc2UgJ2VuZCc6XG5cdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2ZpZWxkRW5kJykpKHdYbWwsZG9jLHBhcmVudClcblx0XHRicmVha1xuXHRcdGNhc2UgJ3NlcGFyYXRlJzpcblx0XHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvZmllbGRTZXBhcmF0ZScpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0YnJlYWtcblx0XHR9XG5cdH1lbHNlIGlmKCd0YmwnPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC90YWJsZScpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ3RyJz09dGFnKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvcm93JykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZigndGMnPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9jZWxsJykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZignYnInPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9icicpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ2h5cGVybGluayc9PXRhZyAmJiAncCc9PXdYbWwucGFyZW50Tm9kZS5sb2NhbE5hbWUpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9oeXBlcmxpbmsnKSkod1htbCxkb2MscGFyZW50KVxuXHRlbHNlIGlmKCdBbHRlcm5hdGVDb250ZW50Jz09dGFnKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvZHJhd2luZ0FuY2hvcicpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ3dzcCc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL3NoYXBlJykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZignaW5saW5lJz09dGFnKXtcblx0XHR2YXIgdHlwZT13WG1sLiQxKCc+Z3JhcGhpYz5ncmFwaGljRGF0YScpLmF0dHIoJ3VyaScpLnNwbGl0KCcvJykucG9wKClcblx0XHRzd2l0Y2godHlwZSl7XG5cdFx0Y2FzZSAncGljdHVyZSc6XG5cdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2ltYWdlJykpKHdYbWwsZG9jLHBhcmVudClcblx0XHRjYXNlICdkaWFncmFtJzpcblx0XHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvZGlhZ3JhbScpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0Y2FzZSAnY2hhcnQnOlxuXHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9jaGFydCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0ZGVmYXVsdDpcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ2lubGluZSAnK3R5cGUgKycgaXMgbm90IHN1cHBvcmVkIHlldC4nKVxuXHRcdH1cblx0fWVsc2UgaWYoJ3NkdCc9PXRhZyl7XG5cdFx0dmFyIGVsQmluZGluZz13WG1sLiQxKCc+c2R0UHI+ZGF0YUJpbmRpbmcnKVxuXHRcdGlmKGVsQmluZGluZyl7Ly9wcm9wZXJ0aWVzXG5cdFx0XHR2YXIgcGF0aD1hdHRyKGVsQmluZGluZywgJ3c6eHBhdGgnKSxcblx0XHRcdFx0ZD1wYXRoLnNwbGl0KC9bXFwvXFw6XFxbXS8pLFxuXHRcdFx0XHRuYW1lPShkLnBvcCgpLGQucG9wKCkpO1xuXHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9kb2N1bWVudFByb3BlcnR5JykpKHdYbWwsZG9jLHBhcmVudCwgbmFtZSlcblx0XHR9ZWxzZSB7Ly9jb250cm9sc1xuXHRcdFx0dmFyIGVsVHlwZT13WG1sLiQxKCc+c2R0UHInKS4kMShcInRleHQsIHBpY3R1cmUsIGRvY1BhcnRMaXN0LCBjb21ib0JveCwgZHJvcERvd25MaXN0LCBkYXRlLCBjaGVja2JveFwiKVxuXHRcdFx0dGFnPWVsVHlwZSA/IGVsVHlwZS5sb2NhbE5hbWUgOiAncmljaHRleHQnXG5cdFx0XHRcblx0XHRcdGV4dGVuZGVkPWZhY3RvcnkuZXh0ZW5kQ29udHJvbCh0YWcsLi4uYXJndW1lbnRzKVxuXHRcdFx0XG5cdFx0XHRpZihleHRlbmRlZClcblx0XHRcdFx0cmV0dXJuIGV4dGVuZGVkXG5cdFx0XHRlbHNlIGlmKCd0ZXh0Jz09dGFnKVxuXHRcdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2NvbnRyb2wvdGV4dCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0XHRlbHNlIGlmKCdwaWN0dXJlJz09dGFnKVxuXHRcdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2NvbnRyb2wvcGljdHVyZScpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0XHRlbHNlIGlmKCdkb2NQYXJ0TGlzdCc9PXRhZylcblx0XHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9jb250cm9sL2dhbGxlcnknKSkod1htbCxkb2MscGFyZW50KVxuXHRcdFx0ZWxzZSBpZignY29tYm9Cb3gnPT10YWcpXG5cdFx0XHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvY29udHJvbC9jb21ib2JveCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0XHRlbHNlIGlmKCdkcm9wRG93bkxpc3QnPT10YWcpXG5cdFx0XHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvY29udHJvbC9kcm9wZG93bicpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0XHRlbHNlIGlmKCdkYXRlJz09dGFnKVxuXHRcdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2NvbnRyb2wvZGF0ZScpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdFx0XHRlbHNlIGlmKCdjaGVja2JveCc9PXRhZylcblx0XHRcdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9jb250cm9sL2NoZWNrYm94JykpKHdYbWwsZG9jLHBhcmVudClcblx0XHRcdGVsc2UgaWYoJ3JpY2h0ZXh0Jz09dGFnKVxuXHRcdFx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2NvbnRyb2wvcmljaHRleHQnKSkod1htbCxkb2MscGFyZW50KVxuXHRcdH1cblx0fWVsc2UgaWYoJ2Jvb2ttYXJrU3RhcnQnPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9ib29rbWFya1N0YXJ0JykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZignYm9va21hcmtFbmQnPT10YWcpXG5cdFx0cmV0dXJuIG5ldyAocmVxdWlyZSgnLi9tb2RlbC9ib29rbWFya0VuZCcpKSh3WG1sLGRvYyxwYXJlbnQpXG5cdGVsc2UgaWYoJ29NYXRoUGFyYSc9PXRhZylcblx0XHRyZXR1cm4gbmV3IChyZXF1aXJlKCcuL21vZGVsL2VxdWF0aW9uJykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZignb2JqZWN0Jz09dGFnKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvT0xFJykpKHdYbWwsZG9jLHBhcmVudClcblx0ZWxzZSBpZignc2VjdFByJz09dGFnKVxuXHRcdHJldHVybiBuZXcgKHJlcXVpcmUoJy4vbW9kZWwvc2VjdGlvbicpKSh3WG1sLGRvYyxwYXJlbnQpXG5cblx0cmV0dXJuIG5ldyBNb2RlbCh3WG1sLGRvYyxwYXJlbnQpXG59XG5cbi8qKlxuKiB5b3UgY2FuIGV4dGVuZCBjb250cm9sXG4qL1xuZmFjdG9yeS5leHRlbmRDb250cm9sPWZ1bmN0aW9uKHR5cGUsd1htbCxkb2MscGFyZW50KXt9XG5cbmZhY3RvcnkuZXh0ZW5kPWZ1bmN0aW9uKCl7fVxuIl19