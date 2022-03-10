# CONTACTS Web App

This repo contains the project documents for my Devmountain Foundations capstone project, a contacts web app.

The planning documents are at https://github.com/johager/foundations-capstone-docs

## Project Description
This is a contacts web app that supports an arbitrary number of phone numbers, email addresses, and physical addresses for each contact. Clicking on the phone data will launch a phone call, clicking on the email data will launch your email app, and clicking on the address data will launch Google maps. Each contact can also have a free-form note area which supports basic HTML for simple formatting. Contacts can be assigned to user-defined groups.

## Technology

__Front End__ - JavaScript, HTML, CSS, axios

__Back End__ - NodeJS, express, sequelize, PostgreSQL

## Local Installation

After cloning the repo, execute the following:

npm init -y  
npm i express  
npm i bcryptjs  
npm i dotenv  
npm i sequelize  
npm i pg pg-hstore  

The .env file should include  
PORT - port for the server  
CONNECTION_STRING - URI for the PostgreSQL database  