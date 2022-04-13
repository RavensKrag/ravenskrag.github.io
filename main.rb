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
  
  
  # send data back to JS on the client
  "<p>ruby to JS</p>"
end
