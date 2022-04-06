#!/usr/bin/env ruby
require 'bundler'
Bundler.require

puts "Sinatra starting soon"
puts "webpage will be available at: http://localhost:4567/"






# 
# send webpage
# 
get '/' do
  f = File.read('index.html')
  script_tag = '<script type="text/javascript" src="live.js"></script>'
  
  doc = Nokogiri::HTML(f)
  
  doc.css('head')
  .children.last
  .add_next_sibling "  #{script_tag}\n" # add proper indentation
  
  doc.to_html
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


# 
# JSON REST API endpoint
# 
