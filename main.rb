#!/usr/bin/env ruby
require 'sinatra'

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
