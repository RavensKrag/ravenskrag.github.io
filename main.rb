#!/usr/bin/env ruby
require 'sinatra'

puts "Sinatra starting soon"
puts "webpage will be available at: http://localhost:4567/"

get '/' do
	send_file 'index.html'
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
