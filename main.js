//include external modules (express, mysql and json config)
const express = require('express');
const mysql = require('mysql');
//starts an express application
const app = express();
const conf = require('./conf.json');

// Unchanging string variable that holds the query for the search bar
const SEARCHTABLE_QUERY = 'SELECT * FROM `crime_by_ward_in_bristol` where ward_name LIKE ?'
// string variable used to take user selection and turn it into a custom query
let selection = ''
// string variable used to create a custom database query from the users selection
let CUSTOM_QUERY = 'select ward_name, time_period, '

// Defines the engine to ejs for the app
app.set('view engine','ejs')
app.use(express.static('static'))

//calls function when get request is called, route is '', parsing request as a function parameter
app.get('', function (request, response) {
//displays the index view with query
  response.render('index', request.query)
})

//calls function when get request is called, route is '/index.html', passing request as a function parameter
app.get('/index.html', function (request, response) {
  //displays the index view with query
  response.render('index', request.query)
})

//calls function when get request is called, route is '/map.html', passing request as a function parameter
app.get("/map.html",function(request, response) {
  connection.query(QUERY, function(err, rows, fields) {
    //if error is true return ser
      if (err) {
        console.error('Connection error: ', err.message)}
      //displays the map view
      else {
        response.render("map", { results: rows, lat: request.query.lat, lon: request.query.lon });
      }
    });
});
  
//calls function when get request is called, route is '/crimedata.html', passing request as a function parameter
app.get('/crimedata.html', function (request, response) {
  //displays the crimedata view with query
  response.render('crimedata', request.query)
})

//calls function when get request is called, route is '/report.html', passing request as a function parameter
app.get('/report.html', function (request, response) {
  //displayes the report view with query
  response.render('report', request.query)
})

//Returns user enviroment, string set to 'dev' when false
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Creates connection to mysql database with data from conf file, dependent on user enviroment
const connection = mysql.createConnection(conf[process.env.NODE_ENV].database);

//Attempts connection to database calling function passing mysqlerror parameter
connection.connect(function (err) {
  //if err is true execute
  if (err) {
    // return error meesage to console
    console.error('Connection error: ', err.message)
  } else {
    // return connection meesage to console
    console.log('Connected as: ', connection.threadId)
  }
})

//When searchtable is called send a query to the database to return records with similar ward names
//calls function when get request is called, route is '/searchtable.html', passing request into function
app.get('/searchtable', function (request, response) {
  //sends query to database calling function passing mysqlerror, rows and fields parameters
  connection.query(SEARCHTABLE_QUERY, ['%' + request.query.search + '%'], function (err, rows, fields) {
    //if error is true
    if (err) {
      //return internal server error message
      response.status(500)
      response.send(err)
    } else {
      // displays the searchtable view passing rows data from query
      response.render('SearchTable', { rows })
    }
  })
})

// user can order table to get most relevant data to them more quickly, this will benefit all use cases

//calls function when get request is called, route is '/optiontable.html', passing request as a function parameter
app.get('/optiontable', function (request, response) {
  //if array index 0 is equal to 0 
  if (request.query.crimedatabuttons[0] === '0') {
    // change variable selection to 0
    selection = '0'
    // add "all_crime_number" to the custom query
    CUSTOM_QUERY = CUSTOM_QUERY + 'all_crime_number '
  } else {
    // change variable selection to 1
    selection = '1'
    // add "all_crime_permille" to the custom query
    CUSTOM_QUERY = CUSTOM_QUERY + 'all_crimes_permille '
  }
  // for loop from 0 to user's selection of buttons array length
  for (let i = 0; i <= request.query.crimedatabuttons.length; i++) {
    // if index i value in the array = 2 (string)
    if (request.query.crimedatabuttons[i] === '2') {
      // if selection variable = 0 (string)
      if (selection === '0') {
        // add "violent & sexual offences number" to the custom query (with correct sql syntax)
        CUSTOM_QUERY = CUSTOM_QUERY + [', `violent_&_sexual_offences_number` ']
      } else {
        // add "violent & sexual offences permille" to the custom query (with correct sql syntax)
        CUSTOM_QUERY = CUSTOM_QUERY + [', `violent_&_sexual_offences_permille` ']
      }
      // exit loop
      break
    }
  }
// for loop from 0 to user's selection of buttons array length
  for (let i = 0; i <= request.query.crimedatabuttons.length; i++) {
    // if index i value in the array = 2 (string)
    if (request.query.crimedatabuttons[i] === '3') {
      // if selection variable = 0 (string)
      if (selection === '0') {
        CUSTOM_QUERY = CUSTOM_QUERY + ', burglary_number '
      } else {
        // add "burglary permille" to the custom query (with correct sql syntax)
        CUSTOM_QUERY = CUSTOM_QUERY + ', burglary_permille '
      }
      // exit loop
      break
    }
  }

// add the end of the query for custom query with correct syntax 
  // if last value in array is a 4 as a string
  if (request.query.endquery === '4') {
    //add ward crime data ordered by asc
    CUSTOM_QUERY = CUSTOM_QUERY + 'from isd.crime_by_ward_in_bristol ORDER BY ward_name ASC;'
    }
  if (request.query.endquery === '5') {
    //add ward crime data ordered by asc
    CUSTOM_QUERY = CUSTOM_QUERY + 'from isd.crime_by_ward_in_bristol ORDER BY time_period ASC;'
    }
  if (request.query.endquery === '6') {
    CUSTOM_QUERY = CUSTOM_QUERY + 'from isd.crime_by_ward_in_bristol ORDER BY time_period DESC;'
    }
  if (request.query.endquery === '7') {
    if (selection === '0') {
      CUSTOM_QUERY = CUSTOM_QUERY + 'from isd.crime_by_ward_in_bristol ORDER BY all_crime_number DESC;'
    }
    else{
      CUSTOM_QUERY = CUSTOM_QUERY + 'from isd.crime_by_ward_in_bristol ORDER BY all_crime_permille DESC;'
    }
    }
  console.log(CUSTOM_QUERY)
  //sends query(custom query variable) to database calling function passing mysqlerror, rows and fields as parameters
  connection.query(CUSTOM_QUERY, function (err, rows, fields) {
    //if error is true
    if (err) {
      //custom query variable goes back to original value
      CUSTOM_QUERY = 'select ward_name, time_period, '
      //return internal server error message
      response.status(500)
      response.send(err)
    } else {
      // display optiontable view with rows data
      response.render('optiontable', { rows })
      //custom query variable goes back to original value
      CUSTOM_QUERY = 'select ward_name, time_period, '
    }
  })
})

//calls function when get request is called, route is '/report', passing request into function
app.get('/report', function (request, response) {
  // creates custom update query from user data from request and stores in custom query variable
  // was previously connected to a seperate table (for data security and reliability) but to ensure functionality when marking has changed to the ODB table
  CUSTOM_QUERY = 'UPDATE crime_by_ward_in_bristol SET ' + request.query.Crime + ' = ' + request.query.Crime + '+1 WHERE ward_name = ' + "'" + request.query.Ward + "'" + ' and time_period = ' + "'" + request.query.Time + "'" + ';'
  //sends query(custom query variable) to database calling function passing mysqlerror as parameter
  connection.query(CUSTOM_QUERY, function (err) {
    //if error is true
    if (err) {
      //custom query variable goes back to original value
      CUSTOM_QUERY = 'select ward_name, time_period, '
      //return internal server error message
      response.status(500)
      response.send(err)
    } else {
      //custom query variable goes back to original value
      CUSTOM_QUERY = 'select ward_name, time_period, '
      //display success view
      response.render('success')
    }
  })
})



// starts server using data from json configuration file
app.listen(conf[process.env.NODE_ENV].port)
//returns to console what port the application responds to on dependent on json configuration file
console.log('Listening on port %s', conf[process.env.NODE_ENV].port)
