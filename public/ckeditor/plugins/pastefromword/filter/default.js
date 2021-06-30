﻿/*
 Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function() {
  function r() {
    return !1;
  }
  var n = CKEDITOR.tools,
    B = CKEDITOR.plugins.pastetools,
    t = B.filters.common,
    k = t.styles,
    C = t.createAttributeStack,
    z = t.lists.getElementIndentation,
    D = ['o:p', 'xml', 'script', 'meta', 'link'],
    E = 'v:arc v:curve v:line v:oval v:polyline v:rect v:roundrect v:group'.split(
      ' '
    ),
    A = {},
    y = 0,
    q = {},
    g,
    p;
  CKEDITOR.plugins.pastetools.filters.word = q;
  CKEDITOR.plugins.pastefromword = q;
  q.rules = function(c, b, d) {
    function e(a) {
      (a.attributes['o:gfxdata'] || 'v:group' === a.parent.name) &&
        l.push(a.attributes.id);
    }
    var f = Boolean(c.match(/mso-list:\s*l\d+\s+level\d+\s+lfo\d+/)),
      l = [],
      w = {
        root: function(a) {
          a.filterChildren(d);
          CKEDITOR.plugins.pastefromword.lists.cleanup(g.createLists(a));
        },
        elementNames: [
          [/^\?xml:namespace$/, ''],
          [/^v:shapetype/, ''],
          [new RegExp(D.join('|')), '']
        ],
        elements: {
          a: function(a) {
            if (a.attributes.name) {
              if ('_GoBack' == a.attributes.name) {
                delete a.name;
                return;
              }
              if (a.attributes.name.match(/^OLE_LINK\d+$/)) {
                delete a.name;
                return;
              }
            }
            if (a.attributes.href && a.attributes.href.match(/#.+$/)) {
              var b = a.attributes.href.match(/#(.+)$/)[1];
              A[b] = a;
            }
            a.attributes.name &&
              A[a.attributes.name] &&
              ((a = A[a.attributes.name]),
              (a.attributes.href = a.attributes.href.replace(
                /.*#(.*)$/,
                '#$1'
              )));
          },
          div: function(a) {
            if (b.plugins.pagebreak && a.attributes['data-cke-pagebreak'])
              return a;
            k.createStyleStack(a, d, b);
          },
          img: function(a) {
            if (a.parent && a.parent.attributes) {
              var b = a.parent.attributes;
              (b = b.style || b.STYLE) &&
                b.match(/mso\-list:\s?Ignore/) &&
                (a.attributes['cke-ignored'] = !0);
            }
            k.mapCommonStyles(a);
            a.attributes.src &&
              a.attributes.src.match(/^file:\/\//) &&
              a.attributes.alt &&
              a.attributes.alt.match(/^https?:\/\//) &&
              (a.attributes.src = a.attributes.alt);
            a = a.attributes['v:shapes']
              ? a.attributes['v:shapes'].split(' ')
              : [];
            b = CKEDITOR.tools.array.every(a, function(a) {
              return -1 < l.indexOf(a);
            });
            if (a.length && b) return !1;
          },
          p: function(a) {
            a.filterChildren(d);
            if (
              a.attributes.style &&
              a.attributes.style.match(/display:\s*none/i)
            )
              return !1;
            if (g.thisIsAListItem(b, a))
              p.isEdgeListItem(b, a) && p.cleanupEdgeListItem(a),
                g.convertToFakeListItem(b, a),
                n.array.reduce(
                  a.children,
                  function(a, b) {
                    'p' === b.name &&
                      (0 < a &&
                        new CKEDITOR.htmlParser.element('br').insertBefore(b),
                      b.replaceWithChildren(),
                      (a += 1));
                    return a;
                  },
                  0
                );
            else {
              var c = a.getAscendant(function(a) {
                  return 'ul' == a.name || 'ol' == a.name;
                }),
                f = n.parseCssText(a.attributes.style);
              c &&
                !c.attributes['cke-list-level'] &&
                f['mso-list'] &&
                f['mso-list'].match(/level/) &&
                (c.attributes['cke-list-level'] = f['mso-list'].match(
                  /level(\d+)/
                )[1]);
              b.config.enterMode == CKEDITOR.ENTER_BR &&
                (delete a.name, a.add(new CKEDITOR.htmlParser.element('br')));
            }
            k.createStyleStack(a, d, b);
          },
          pre: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          h1: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          h2: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          h3: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          h4: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          h5: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          h6: function(a) {
            g.thisIsAListItem(b, a) && g.convertToFakeListItem(b, a);
            k.createStyleStack(a, d, b);
          },
          font: function(a) {
            if (a.getHtml().match(/^\s*$/))
              return (
                a.parent.type === CKEDITOR.NODE_ELEMENT &&
                  new CKEDITOR.htmlParser.text(' ').insertAfter(a),
                !1
              );
            b &&
              !0 === b.config.pasteFromWordRemoveFontStyles &&
              a.attributes.size &&
              delete a.attributes.size;
            CKEDITOR.dtd.tr[a.parent.name] &&
            CKEDITOR.tools.arrayCompare(
              CKEDITOR.tools.object.keys(a.attributes),
              ['class', 'style']
            )
              ? k.createStyleStack(a, d, b)
              : C(a, d);
          },
          ul: function(a) {
            if (f)
              return (
                'li' == a.parent.name &&
                  0 === n.indexOf(a.parent.children, a) &&
                  k.setStyle(a.parent, 'list-style-type', 'none'),
                g.dissolveList(a),
                !1
              );
          },
          li: function(a) {
            p.correctLevelShift(a);
            f &&
              ((a.attributes.style = k.normalizedStyles(a, b)),
              k.pushStylesLower(a));
          },
          ol: function(a) {
            if (f)
              return (
                'li' == a.parent.name &&
                  0 === n.indexOf(a.parent.children, a) &&
                  k.setStyle(a.parent, 'list-style-type', 'none'),
                g.dissolveList(a),
                !1
              );
          },
          span: function(a) {
            a.filterChildren(d);
            a.attributes.style = k.normalizedStyles(a, b);
            if (
              !a.attributes.style ||
              a.attributes.style.match(/^mso\-bookmark:OLE_LINK\d+$/) ||
              a.getHtml().match(/^(\s|&nbsp;)+$/)
            )
              return t.elements.replaceWithChildren(a), !1;
            a.attributes.style.match(/FONT-FAMILY:\s*Symbol/i) &&
              a.forEach(
                function(a) {
                  a.value = a.value.replace(/&nbsp;/g, '');
                },
                CKEDITOR.NODE_TEXT,
                !0
              );
            k.createStyleStack(a, d, b);
          },
          'v:imagedata': r,
          'v:shape': function(a) {
            var b = !1;
            if (null === a.getFirst('v:imagedata')) e(a);
            else {
              a.parent.find(function(c) {
                'img' == c.name &&
                  c.attributes &&
                  c.attributes['v:shapes'] == a.attributes.id &&
                  (b = !0);
              }, !0);
              if (b) return !1;
              var c = '';
              'v:group' === a.parent.name
                ? e(a)
                : (a.forEach(
                    function(a) {
                      a.attributes &&
                        a.attributes.src &&
                        (c = a.attributes.src);
                    },
                    CKEDITOR.NODE_ELEMENT,
                    !0
                  ),
                  a.filterChildren(d),
                  (a.name = 'img'),
                  (a.attributes.src = a.attributes.src || c),
                  delete a.attributes.type);
            }
          },
          style: function() {
            return !1;
          },
          object: function(a) {
            return !(!a.attributes || !a.attributes.data);
          },
          br: function(a) {
            if (
              b.plugins.pagebreak &&
              ((a = n.parseCssText(a.attributes.style, !0)),
              'always' === a['page-break-before'] ||
                'page' === a['break-before'])
            )
              return (
                (a = CKEDITOR.plugins.pagebreak.createElement(b)),
                CKEDITOR.htmlParser.fragment.fromHtml(a.getOuterHtml())
                  .children[0]
              );
          }
        },
        attributes: {
          style: function(a, c) {
            return k.normalizedStyles(c, b) || !1;
          },
          class: function(a) {
            a = a.replace(
              /(el\d+)|(font\d+)|msonormal|msolistparagraph\w*/gi,
              ''
            );
            return '' === a ? !1 : a;
          },
          cellspacing: r,
          cellpadding: r,
          border: r,
          'v:shapes': r,
          'o:spid': r
        },
        comment: function(a) {
          a.match(/\[if.* supportFields.*\]/) && y++;
          '[endif]' == a && (y = 0 < y ? y - 1 : 0);
          return !1;
        },
        text: function(a, b) {
          if (y) return '';
          var c = b.parent && b.parent.parent;
          return c &&
            c.attributes &&
            c.attributes.style &&
            c.attributes.style.match(/mso-list:\s*ignore/i)
            ? a.replace(/&nbsp;/g, ' ')
            : a;
        }
      };
    n.array.forEach(E, function(a) {
      w.elements[a] = e;
    });
    return w;
  };
  q.lists = {
    thisIsAListItem: function(c, b) {
      return p.isEdgeListItem(c, b) ||
        (b.attributes.style &&
          b.attributes.style.match(/mso\-list:\s?l\d/) &&
          'li' !== b.parent.name) ||
        b.attributes['cke-dissolved'] ||
        b.getHtml().match(/<!\-\-\[if !supportLists]\-\->/)
        ? !0
        : !1;
    },
    convertToFakeListItem: function(c, b) {
      p.isDegenerateListItem(c, b) && p.assignListLevels(c, b);
      this.getListItemInfo(b);
      if (!b.attributes['cke-dissolved']) {
        var d;
        b.forEach(function(b) {
          !d &&
            'img' == b.name &&
            b.attributes['cke-ignored'] &&
            '*' == b.attributes.alt &&
            ((d = '·'), b.remove());
        }, CKEDITOR.NODE_ELEMENT);
        b.forEach(function(b) {
          d || b.value.match(/^ /) || (d = b.value);
        }, CKEDITOR.NODE_TEXT);
        if ('undefined' == typeof d) return;
        b.attributes['cke-symbol'] = d.replace(/(?: |&nbsp;).*$/, '');
        g.removeSymbolText(b);
      }
      var e = b.attributes && n.parseCssText(b.attributes.style);
      if (e['margin-left']) {
        var f = e['margin-left'],
          l = b.attributes['cke-list-level'];
        (f = Math.max(CKEDITOR.tools.convertToPx(f) - 40 * l, 0))
          ? (e['margin-left'] = f + 'px')
          : delete e['margin-left'];
        b.attributes.style = CKEDITOR.tools.writeCssText(e);
      }
      b.name = 'cke:li';
    },
    convertToRealListItems: function(c) {
      var b = [];
      c.forEach(
        function(c) {
          'cke:li' == c.name && ((c.name = 'li'), b.push(c));
        },
        CKEDITOR.NODE_ELEMENT,
        !1
      );
      return b;
    },
    removeSymbolText: function(c) {
      var b = c.attributes['cke-symbol'],
        d = c.findOne(function(c) {
          return c.value && -1 < c.value.indexOf(b);
        }, !0),
        e;
      d &&
        ((d.value = d.value.replace(b, '')),
        (e = d.parent),
        e.getHtml().match(/^(\s|&nbsp;)*$/) && e !== c
          ? e.remove()
          : d.value || d.remove());
    },
    setListSymbol: function(c, b, d) {
      d = d || 1;
      var e = n.parseCssText(c.attributes.style);
      if ('ol' == c.name) {
        if (c.attributes.type || e['list-style-type']) return;
        var f = {
            '[ivx]': 'lower-roman',
            '[IVX]': 'upper-roman',
            '[a-z]': 'lower-alpha',
            '[A-Z]': 'upper-alpha',
            '\\d': 'decimal'
          },
          l;
        for (l in f)
          if (g.getSubsectionSymbol(b).match(new RegExp(l))) {
            e['list-style-type'] = f[l];
            break;
          }
        c.attributes['cke-list-style-type'] = e['list-style-type'];
      } else
        (f = { '·': 'disc', o: 'circle', '§': 'square' }),
          !e['list-style-type'] && f[b] && (e['list-style-type'] = f[b]);
      g.setListSymbol.removeRedundancies(e, d);
      (c.attributes.style = CKEDITOR.tools.writeCssText(e)) ||
        delete c.attributes.style;
    },
    setListStart: function(c) {
      for (var b = [], d = 0, e = 0; e < c.children.length; e++)
        b.push(c.children[e].attributes['cke-symbol'] || '');
      b[0] || d++;
      switch (c.attributes['cke-list-style-type']) {
        case 'lower-roman':
        case 'upper-roman':
          c.attributes.start = g.toArabic(g.getSubsectionSymbol(b[d])) - d;
          break;
        case 'lower-alpha':
        case 'upper-alpha':
          c.attributes.start =
            g
              .getSubsectionSymbol(b[d])
              .replace(/\W/g, '')
              .toLowerCase()
              .charCodeAt(0) -
            96 -
            d;
          break;
        case 'decimal':
          c.attributes.start =
            parseInt(g.getSubsectionSymbol(b[d]), 10) - d || 1;
      }
      '1' == c.attributes.start && delete c.attributes.start;
      delete c.attributes['cke-list-style-type'];
    },
    numbering: {
      toNumber: function(c, b) {
        function d(b) {
          b = b.toUpperCase();
          for (var c = 1, d = 1; 0 < b.length; d *= 26)
            (c +=
              'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(b.charAt(b.length - 1)) * d),
              (b = b.substr(0, b.length - 1));
          return c;
        }
        function e(b) {
          var c = [
            [1e3, 'M'],
            [900, 'CM'],
            [500, 'D'],
            [400, 'CD'],
            [100, 'C'],
            [90, 'XC'],
            [50, 'L'],
            [40, 'XL'],
            [10, 'X'],
            [9, 'IX'],
            [5, 'V'],
            [4, 'IV'],
            [1, 'I']
          ];
          b = b.toUpperCase();
          for (var d = c.length, a = 0, e = 0; e < d; ++e)
            for (
              var g = c[e], u = g[1].length;
              b.substr(0, u) == g[1];
              b = b.substr(u)
            )
              a += g[0];
          return a;
        }
        return 'decimal' == b
          ? Number(c)
          : 'upper-roman' == b || 'lower-roman' == b
          ? e(c.toUpperCase())
          : 'lower-alpha' == b || 'upper-alpha' == b
          ? d(c)
          : 1;
      },
      getStyle: function(c) {
        c = c.slice(0, 1);
        var b = {
          i: 'lower-roman',
          v: 'lower-roman',
          x: 'lower-roman',
          l: 'lower-roman',
          m: 'lower-roman',
          I: 'upper-roman',
          V: 'upper-roman',
          X: 'upper-roman',
          L: 'upper-roman',
          M: 'upper-roman'
        }[c];
        b ||
          ((b = 'decimal'),
          c.match(/[a-z]/) && (b = 'lower-alpha'),
          c.match(/[A-Z]/) && (b = 'upper-alpha'));
        return b;
      }
    },
    getSubsectionSymbol: function(c) {
      return (c.match(/([\da-zA-Z]+).?$/) || ['placeholder', '1'])[1];
    },
    setListDir: function(c) {
      var b = 0,
        d = 0;
      c.forEach(function(c) {
        'li' == c.name &&
          ('rtl' == (c.attributes.dir || c.attributes.DIR || '').toLowerCase()
            ? d++
            : b++);
      }, CKEDITOR.ELEMENT_NODE);
      d > b && (c.attributes.dir = 'rtl');
    },
    createList: function(c) {
      return (c.attributes['cke-symbol'].match(/([\da-np-zA-NP-Z]).?/) || [])[1]
        ? new CKEDITOR.htmlParser.element('ol')
        : new CKEDITOR.htmlParser.element('ul');
    },
    createLists: function(c) {
      function b(b) {
        return CKEDITOR.tools.array.reduce(
          b,
          function(b, a) {
            if (a.attributes && a.attributes.style)
              var c = CKEDITOR.tools.parseCssText(a.attributes.style)[
                'margin-left'
              ];
            return c ? b + parseInt(c, 10) : b;
          },
          0
        );
      }
      var d,
        e,
        f,
        l = g.convertToRealListItems(c);
      if (0 === l.length) return [];
      var k = g.groupLists(l);
      for (c = 0; c < k.length; c++) {
        var a = k[c],
          h = a[0];
        for (f = 0; f < a.length; f++)
          if (1 == a[f].attributes['cke-list-level']) {
            h = a[f];
            break;
          }
        var h = [g.createList(h)],
          m = h[0],
          u = [h[0]];
        m.insertBefore(a[0]);
        for (f = 0; f < a.length; f++) {
          d = a[f];
          for (e = d.attributes['cke-list-level']; e > h.length; ) {
            var v = g.createList(d),
              x = m.children;
            0 < x.length
              ? x[x.length - 1].add(v)
              : ((x = new CKEDITOR.htmlParser.element('li', {
                  style: 'list-style-type:none'
                })),
                x.add(v),
                m.add(x));
            h.push(v);
            u.push(v);
            m = v;
            e == h.length && g.setListSymbol(v, d.attributes['cke-symbol'], e);
          }
          for (; e < h.length; )
            h.pop(),
              (m = h[h.length - 1]),
              e == h.length &&
                g.setListSymbol(m, d.attributes['cke-symbol'], e);
          d.remove();
          m.add(d);
        }
        h[0].children.length &&
          ((f = h[0].children[0].attributes['cke-symbol']),
          !f &&
            1 < h[0].children.length &&
            (f = h[0].children[1].attributes['cke-symbol']),
          f && g.setListSymbol(h[0], f));
        for (f = 0; f < u.length; f++) g.setListStart(u[f]);
        for (f = 0; f < a.length; f++) this.determineListItemValue(a[f]);
      }
      CKEDITOR.tools.array.forEach(l, function(a) {
        for (var c = [], d = a.parent; d; )
          'li' === d.name && c.push(d), (d = d.parent);
        var c = b(c),
          e;
        c &&
          ((a.attributes = a.attributes || {}),
          (d = CKEDITOR.tools.parseCssText(a.attributes.style)),
          (e = d['margin-left'] || 0),
          (e = Math.max(parseInt(e, 10) - c, 0))
            ? (d['margin-left'] = e + 'px')
            : delete d['margin-left'],
          (a.attributes.style = CKEDITOR.tools.writeCssText(d)));
      });
      return l;
    },
    cleanup: function(c) {
      var b = [
          'cke-list-level',
          'cke-symbol',
          'cke-list-id',
          'cke-indentation',
          'cke-dissolved'
        ],
        d,
        e;
      for (d = 0; d < c.length; d++)
        for (e = 0; e < b.length; e++) delete c[d].attributes[b[e]];
    },
    determineListItemValue: function(c) {
      if ('ol' === c.parent.name) {
        var b = this.calculateValue(c),
          d = c.attributes['cke-symbol'].match(/[a-z0-9]+/gi),
          e;
        d &&
          ((d = d[d.length - 1]),
          (e =
            c.parent.attributes['cke-list-style-type'] ||
            this.numbering.getStyle(d)),
          (d = this.numbering.toNumber(d, e)),
          d !== b && (c.attributes.value = d));
      }
    },
    calculateValue: function(c) {
      if (!c.parent) return 1;
      var b = c.parent;
      c = c.getIndex();
      var d = null,
        e,
        f,
        g;
      for (g = c; 0 <= g && null === d; g--)
        (f = b.children[g]),
          f.attributes &&
            void 0 !== f.attributes.value &&
            ((e = g), (d = parseInt(f.attributes.value, 10)));
      null === d &&
        ((d =
          void 0 !== b.attributes.start ? parseInt(b.attributes.start, 10) : 1),
        (e = 0));
      return d + (c - e);
    },
    dissolveList: function(c) {
      function b(a) {
        return 50 <= a
          ? 'l' + b(a - 50)
          : 40 <= a
          ? 'xl' + b(a - 40)
          : 10 <= a
          ? 'x' + b(a - 10)
          : 9 == a
          ? 'ix'
          : 5 <= a
          ? 'v' + b(a - 5)
          : 4 == a
          ? 'iv'
          : 1 <= a
          ? 'i' + b(a - 1)
          : '';
      }
      function d(a, b) {
        function c(b, d) {
          return b && b.parent
            ? a(b.parent)
              ? c(b.parent, d + 1)
              : c(b.parent, d)
            : d;
        }
        return c(b, 0);
      }
      var e = function(b) {
          return function(a) {
            return a.name == b;
          };
        },
        f = function(b) {
          return e('ul')(b) || e('ol')(b);
        },
        g = CKEDITOR.tools.array,
        w = [],
        a,
        h;
      c.forEach(
        function(b) {
          w.push(b);
        },
        CKEDITOR.NODE_ELEMENT,
        !1
      );
      a = g.filter(w, e('li'));
      var m = g.filter(w, f);
      g.forEach(m, function(a) {
        var c = a.attributes.type,
          h = parseInt(a.attributes.start, 10) || 1,
          m = d(f, a) + 1;
        c || (c = n.parseCssText(a.attributes.style)['list-style-type']);
        g.forEach(g.filter(a.children, e('li')), function(d, e) {
          var f;
          switch (c) {
            case 'disc':
              f = '·';
              break;
            case 'circle':
              f = 'o';
              break;
            case 'square':
              f = '§';
              break;
            case '1':
            case 'decimal':
              f = h + e + '.';
              break;
            case 'a':
            case 'lower-alpha':
              f = String.fromCharCode(97 + h - 1 + e) + '.';
              break;
            case 'A':
            case 'upper-alpha':
              f = String.fromCharCode(65 + h - 1 + e) + '.';
              break;
            case 'i':
            case 'lower-roman':
              f = b(h + e) + '.';
              break;
            case 'I':
            case 'upper-roman':
              f = b(h + e).toUpperCase() + '.';
              break;
            default:
              f = 'ul' == a.name ? '·' : h + e + '.';
          }
          d.attributes['cke-symbol'] = f;
          d.attributes['cke-list-level'] = m;
        });
      });
      a = g.reduce(
        a,
        function(b, a) {
          var c = a.children[0];
          if (
            c &&
            c.name &&
            c.attributes.style &&
            c.attributes.style.match(/mso-list:/i)
          ) {
            k.pushStylesLower(a, { 'list-style-type': !0, display: !0 });
            var d = n.parseCssText(c.attributes.style, !0);
            k.setStyle(a, 'mso-list', d['mso-list'], !0);
            k.setStyle(c, 'mso-list', '');
            delete a['cke-list-level'];
            (c = d.display ? 'display' : d.DISPLAY ? 'DISPLAY' : '') &&
              k.setStyle(a, 'display', d[c], !0);
          }
          if (1 === a.children.length && f(a.children[0])) return b;
          a.name = 'p';
          a.attributes['cke-dissolved'] = !0;
          b.push(a);
          return b;
        },
        []
      );
      for (h = a.length - 1; 0 <= h; h--) a[h].insertAfter(c);
      for (h = m.length - 1; 0 <= h; h--) delete m[h].name;
    },
    groupLists: function(c) {
      var b,
        d,
        e = [[c[0]]],
        f = e[0];
      d = c[0];
      d.attributes['cke-indentation'] = d.attributes['cke-indentation'] || z(d);
      for (b = 1; b < c.length; b++) {
        d = c[b];
        var l = c[b - 1];
        d.attributes['cke-indentation'] =
          d.attributes['cke-indentation'] || z(d);
        d.previous !== l && (g.chopDiscontinuousLists(f, e), e.push((f = [])));
        f.push(d);
      }
      g.chopDiscontinuousLists(f, e);
      return e;
    },
    chopDiscontinuousLists: function(c, b) {
      for (var d = {}, e = [[]], f, l = 0; l < c.length; l++) {
        var k = d[c[l].attributes['cke-list-level']],
          a = this.getListItemInfo(c[l]),
          h,
          m;
        k
          ? ((m = k.type.match(/alpha/) && 7 == k.index ? 'alpha' : m),
            (m =
              'o' == c[l].attributes['cke-symbol'] && 14 == k.index
                ? 'alpha'
                : m),
            (h = g.getSymbolInfo(c[l].attributes['cke-symbol'], m)),
            (a = this.getListItemInfo(c[l])),
            (k.type != h.type ||
              (f && a.id != f.id && !this.isAListContinuation(c[l]))) &&
              e.push([]))
          : (h = g.getSymbolInfo(c[l].attributes['cke-symbol']));
        for (
          f = parseInt(c[l].attributes['cke-list-level'], 10) + 1;
          20 > f;
          f++
        )
          d[f] && delete d[f];
        d[c[l].attributes['cke-list-level']] = h;
        e[e.length - 1].push(c[l]);
        f = a;
      }
      [].splice.apply(b, [].concat([n.indexOf(b, c), 1], e));
    },
    isAListContinuation: function(c) {
      var b = c;
      do
        if ((b = b.previous) && b.type === CKEDITOR.NODE_ELEMENT) {
          if (void 0 === b.attributes['cke-list-level']) break;
          if (b.attributes['cke-list-level'] === c.attributes['cke-list-level'])
            return b.attributes['cke-list-id'] === c.attributes['cke-list-id'];
        }
      while (b);
      return !1;
    },
    toArabic: function(c) {
      return c.match(/[ivxl]/i)
        ? c.match(/^l/i)
          ? 50 + g.toArabic(c.slice(1))
          : c.match(/^lx/i)
          ? 40 + g.toArabic(c.slice(1))
          : c.match(/^x/i)
          ? 10 + g.toArabic(c.slice(1))
          : c.match(/^ix/i)
          ? 9 + g.toArabic(c.slice(2))
          : c.match(/^v/i)
          ? 5 + g.toArabic(c.slice(1))
          : c.match(/^iv/i)
          ? 4 + g.toArabic(c.slice(2))
          : c.match(/^i/i)
          ? 1 + g.toArabic(c.slice(1))
          : g.toArabic(c.slice(1))
        : 0;
    },
    getSymbolInfo: function(c, b) {
      var d = c.toUpperCase() == c ? 'upper-' : 'lower-',
        e = { '·': ['disc', -1], o: ['circle', -2], '§': ['square', -3] };
      if (c in e || (b && b.match(/(disc|circle|square)/)))
        return { index: e[c][1], type: e[c][0] };
      if (c.match(/\d/))
        return {
          index: c ? parseInt(g.getSubsectionSymbol(c), 10) : 0,
          type: 'decimal'
        };
      c = c.replace(/\W/g, '').toLowerCase();
      return (!b && c.match(/[ivxl]+/i)) || (b && 'alpha' != b) || 'roman' == b
        ? { index: g.toArabic(c), type: d + 'roman' }
        : c.match(/[a-z]/i)
        ? { index: c.charCodeAt(0) - 97, type: d + 'alpha' }
        : { index: -1, type: 'disc' };
    },
    getListItemInfo: function(c) {
      if (void 0 !== c.attributes['cke-list-id'])
        return {
          id: c.attributes['cke-list-id'],
          level: c.attributes['cke-list-level']
        };
      var b = n.parseCssText(c.attributes.style)['mso-list'],
        d = { id: '0', level: '1' };
      b &&
        ((b += ' '),
        (d.level = b.match(/level(.+?)\s+/)[1]),
        (d.id = b.match(/l(\d+?)\s+/)[1]));
      c.attributes['cke-list-level'] =
        void 0 !== c.attributes['cke-list-level']
          ? c.attributes['cke-list-level']
          : d.level;
      c.attributes['cke-list-id'] = d.id;
      return d;
    }
  };
  g = q.lists;
  q.heuristics = {
    isEdgeListItem: function(c, b) {
      if (!CKEDITOR.env.edge || !c.config.pasteFromWord_heuristicsEdgeList)
        return !1;
      var d = '';
      b.forEach &&
        b.forEach(function(b) {
          d += b.value;
        }, CKEDITOR.NODE_TEXT);
      return d.match(/^(?: |&nbsp;)*\(?[a-zA-Z0-9]+?[\.\)](?: |&nbsp;){2,}/)
        ? !0
        : p.isDegenerateListItem(c, b);
    },
    cleanupEdgeListItem: function(c) {
      var b = !1;
      c.forEach(function(c) {
        b ||
          ((c.value = c.value.replace(/^(?:&nbsp;|[\s])+/, '')),
          c.value.length && (b = !0));
      }, CKEDITOR.NODE_TEXT);
    },
    isDegenerateListItem: function(c, b) {
      return (
        !!b.attributes['cke-list-level'] ||
        (b.attributes.style &&
          !b.attributes.style.match(/mso\-list/) &&
          !!b.find(function(c) {
            if (
              c.type == CKEDITOR.NODE_ELEMENT &&
              b.name.match(/h\d/i) &&
              c.getHtml().match(/^[a-zA-Z0-9]+?[\.\)]$/)
            )
              return !0;
            var e = n.parseCssText(c.attributes && c.attributes.style, !0);
            if (!e) return !1;
            var f = e['font-family'] || '';
            return (
              ((e.font || e['font-size'] || '').match(/7pt/i) &&
                !!c.previous) ||
              f.match(/symbol/i)
            );
          }, !0).length)
      );
    },
    assignListLevels: function(c, b) {
      if (!b.attributes || void 0 === b.attributes['cke-list-level']) {
        for (
          var d = [z(b)], e = [b], f = [], g = CKEDITOR.tools.array, k = g.map;
          b.next &&
          b.next.attributes &&
          !b.next.attributes['cke-list-level'] &&
          p.isDegenerateListItem(c, b.next);

        )
          (b = b.next), d.push(z(b)), e.push(b);
        var a = k(d, function(a, b) {
            return 0 === b ? 0 : a - d[b - 1];
          }),
          h = this.guessIndentationStep(
            g.filter(d, function(a) {
              return 0 !== a;
            })
          ),
          f = k(d, function(a) {
            return Math.round(a / h);
          });
        -1 !== g.indexOf(f, 0) &&
          (f = k(f, function(a) {
            return a + 1;
          }));
        g.forEach(e, function(a, b) {
          a.attributes['cke-list-level'] = f[b];
        });
        return { indents: d, levels: f, diffs: a };
      }
    },
    guessIndentationStep: function(c) {
      return c.length ? Math.min.apply(null, c) : null;
    },
    correctLevelShift: function(c) {
      if (this.isShifted(c)) {
        var b = CKEDITOR.tools.array.filter(c.children, function(b) {
            return 'ul' == b.name || 'ol' == b.name;
          }),
          d = CKEDITOR.tools.array.reduce(
            b,
            function(b, c) {
              return (c.children &&
              1 == c.children.length &&
              p.isShifted(c.children[0])
                ? [c]
                : c.children
              ).concat(b);
            },
            []
          );
        CKEDITOR.tools.array.forEach(b, function(b) {
          b.remove();
        });
        CKEDITOR.tools.array.forEach(d, function(b) {
          c.add(b);
        });
        delete c.name;
      }
    },
    isShifted: function(c) {
      return 'li' !== c.name
        ? !1
        : 0 ===
            CKEDITOR.tools.array.filter(c.children, function(b) {
              return b.name &&
                ('ul' == b.name ||
                  'ol' == b.name ||
                  ('p' == b.name && 0 === b.children.length))
                ? !1
                : !0;
            }).length;
    }
  };
  p = q.heuristics;
  g.setListSymbol.removeRedundancies = function(c, b) {
    ((1 === b && 'disc' === c['list-style-type']) ||
      'decimal' === c['list-style-type']) &&
      delete c['list-style-type'];
  };
  CKEDITOR.cleanWord = CKEDITOR.pasteFilters.word = B.createFilter({
    rules: [t.rules, q.rules],
    additionalTransforms: function(c) {
      CKEDITOR.plugins.clipboard.isCustomDataTypesSupported &&
        (c = t.styles.inliner
          .inline(c)
          .getBody()
          .getHtml());
      return c.replace(/<!\[/g, '\x3c!--[').replace(/\]>/g, ']--\x3e');
    }
  });
  CKEDITOR.config.pasteFromWord_heuristicsEdgeList = !0;
})();
