#!/usr/bin/env ruby

require 'nokogiri'



f = File.read('index.html')
script_tag = '<script type="text/javascript" src="live.js"></script>'

doc = Nokogiri::HTML(f)

doc.css('head').children.last
.add_next_sibling "  #{script_tag}\n" # add proper indentation

require 'irb'
binding.irb

doc.to_s
