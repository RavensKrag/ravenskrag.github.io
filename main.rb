#!/usr/bin/env ruby
require 'bundler'
Bundler.require

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
get '/' do
  f = File.read('index.html')
  script_tag = 
  
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

get '/*.js' do |js_file|
  send_file "#{js_file}.js"
end

get '/profile_pic.png' do
  send_file 'profile_pic.png'
end

get '/style.css' do
  send_file 'style.css'
end

get '/semantic/*' do |name|
  send_file "semantic/#{name}"
end

get '/editorjs/*' do |name|
  send_file "editorjs/#{name}"
end


# 
# JSON REST API endpoint
# 
