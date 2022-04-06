#!/usr/bin/env ruby

require 'nokogiri'
require 'yaml'

data = [
      "live.js",
      "editor.js",
      "https://cdn.jsdelivr.net/npm/@editorjs/header@2.3.2",
      "https://cdn.jsdelivr.net/npm/@editorjs/paragraph@2.3.2",
    ]

File.open("./js_paths.yaml", "w") do |f|
	f.print YAML.dump(data)
end


f = File.read('index.html')
script_tag = '<script type="text/javascript" src="live.js"></script>'

doc = Nokogiri::HTML(f)

doc.css('head').children.last
.add_next_sibling "  #{script_tag}\n" # add proper indentation

require 'irb'
binding.irb

doc.to_s


