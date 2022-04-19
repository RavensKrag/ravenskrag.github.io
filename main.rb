#!/usr/bin/env ruby
require 'bundler'
Bundler.require

require "sinatra/reloader" if development?
require 'yaml'

puts "Sinatra starting soon"
puts "webpage will be available at: http://localhost:4567/"


# add tag with proper indentation and newline
def add_tag(node, tag_html_string, indent:2)
  node.add_next_sibling(" "*indent + "#{tag_html_string}\n")
end



# 
# send webpage
# 
set :public_folder, __dir__ + '/docs'

get '/' do
  f = File.read('./docs/index.html')
  
  doc = Nokogiri::HTML(f)
  
  doc.css('head').children.last.tap do |node|
    YAML.load_file('./js_paths.yaml')
    .reverse_each do |src|
      script_tag = '<script type="text/javascript" src="' + src + '"></script>'
      add_tag node, script_tag
    end
  end
  
  script_tag = '<script src="./index.js"></script>'
  doc.css('body').children.last.tap do |node|
    add_tag node, script_tag
  end
  
  
  doc.to_html
end


# 
# JSON REST API endpoint
# 

post '/api/foo' do
  # parse arguments sent via AJAX call from the client
  p params['key']
  p params['data']
  
  params['data']&.tap do |html_string|
    filepath = './docs/index.html'
    
    f = File.read(filepath)
    doc = Nokogiri::HTML(f)
    
    doc.at_css('#content .copy.content').tap do |source_node|
    # TODO: figure out selector programatically in JS and pass to ruby
    
      # parse the HTML
      doc_fragment = Nokogiri::HTML(html_string)
      
      # parsing adds extra tags like <html> and <body>
      # so we need to get just the core document fragment
      doc_fragment = doc_fragment.at_css('body').children[0]
      
      # remove 'contenteditable' attribute
      doc_fragment.remove_attribute 'contenteditable'
      
      # replace original node with new node
      source_node.replace doc_fragment
      
    end
    
    puts doc.to_html
    
    File.write(filepath, doc.to_html)
  end
  
  # send data back to JS on the client
  "<p>ruby to JS</p>"
end
