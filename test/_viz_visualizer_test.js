// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.

(function() {
	"use strict";

    var jdls = require('../lib/index');
    var expect = require('expect.js');

	describe("Viz.js Visualizer", function() {
		var graph;
		var details;

		beforeEach(function() {
			var object = {
				a: {
					b: "b"
				}
			};
			graph = new jdls.ObjectGraph("name", object);
			details = new jdls.VizVisualizer();
		});

		it("escapes HTML strings", function() {
			var esc = details.escapeHtml;
			expect(esc("&&")).to.equal("&amp;&amp;");
			expect(esc("<<>>")).to.equal("&lt;&lt;&gt;&gt;");
			expect(esc('""')).to.equal("&quot;&quot;");
			expect(esc("''")).to.equal("&#039;&#039;");
			expect(esc("\n\n")).to.equal("<br /><br />");
			expect(esc("\t\t")).to.equal("    ");
		});

		it("converts nodes (with alternating property colors)", function() {
			var node = new jdls.ObjectNode("name", { a: 1, b: 2, c: 3 });

			expect(details.nodeToViz(node)).to.equal(
					'  "' + node.id() + '" [label=<\n' +
					'    <table border="0" cellborder="0" cellpadding="3" cellspacing="0">\n' +
					'      <th><td port="title" bgcolor="#00668F"><font color="white" point-size="11">name</font></td></th>\n' +
					'      <tr><td port="f0" bgcolor="#E3E3E3" align="left" balign="left">&nbsp;<font color="#333333">a:</font> <font color="#666666">1</font>&nbsp;</td></tr>\n' +
					'      <tr><td port="f1" bgcolor="#FDFDFD" align="left" balign="left">&nbsp;<font color="#333333">b:</font> <font color="#666666">2</font>&nbsp;</td></tr>\n' +
					'      <tr><td port="f2" bgcolor="#E3E3E3" align="left" balign="left">&nbsp;<font color="#333333">c:</font> <font color="#666666">3</font>&nbsp;</td></tr>\n' +
					'      <tr><td port="proto" bgcolor="#0082B6"><font color="white">Object.prototype</font></td></tr>\n' +
					'    </table>\n' +
					'  >];\n'
//				'"' + node.id() + '" [\n' +
//				'label = "<title>name \\{Object\\}| <f0> a: 1| <proto> \\<prototype\\>: Object"\n' +
//				'shape = "record"];\n'
			);
		});

		it("converts edges", function() {
			var edge = graph.edges()[0];
			var fromId = graph.nodes()[0].id();
			var toId = graph.nodes()[1].id();

			expect(details.edgeToViz(edge)).to.equal(
				'"' + fromId + '":f0 -> "' + toId + '":title [];'
			);
		});

		it("converts entire graph", function() {
			var fromNode = graph.nodes()[0];
			var toNode = graph.nodes()[1];
			var edge = graph.edges()[0];

			expect(details.graphToViz(graph)).to.equal(
				'digraph g {\n' +
				'  graph [\n' +
				'    rankdir = "LR"\n' +
				'  ];\n' +
				'  node [\n' +
				'    fontname = "Helvetica"\n' +
				'    fontsize = "10"\n' +
				'    shape = "plaintext"\n' +
				'  ];\n' +
				'  edge [\n' +
				'    color = "#555555"\n' +
				'    arrowsize = "0.8"\n' +
				'  ];\n' +
				'  \n' +
				details.nodeToViz(fromNode) +
				details.nodeToViz(toNode) +
				details.edgeToViz(edge) +
				'}\n'
			);
		});

		it("renders 'viz' format to svg", function() {
 			var svg = details.vizToSvg("digraph { a -> b; }");
 			expect(svg).to.contain("Generated by graphviz");
		});

	});

}());