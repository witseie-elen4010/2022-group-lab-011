# Code template followed
All coding conventions for both javascripts and html follow the guidlines set by W3schools.
Javascript: (https://www.w3schools.com/js/js_conventions.asp)
html: (https://www.w3schools.com/html/html5_syntax.asp)

## General
## Code Format
Operators: single space before and after operators
Commas: Single space after but not before comma

## SQL
## Naming Conventions
Primary key: labled as, id
Foreign key: tablename_id
Variables, columns: lowercase with underscores

## Code order
SELECT
FROM
WHERE
GROUP BY
ORDER BY
LIMIT

## JavaScript
## Naming Conventions
Variables: camelCase, begin with letter
Global variables: UPPERCASE
Constants: UPPERCASE
Files: All lowercase


- Statements should not end in a semi-colon
- Compound Statements
    - Put the opening bracket at the end of the first line
    - Use one space before the opening bracket
    - Put the closing bracket on a new line, without leading spaces
    - Do not end a complex statement with a semicolon
  ```sh
  function myFunction(myVar) {
   return myVar * 2;
  }
  ```
- Keep line length < 80 characters and where possible seperate after an operator or comma

## HTML
- To access JavaScripts in HTML use below format
  ```sh
  <script src="myscript.js"></script>
  ```
- Declare docuement typ with the first line of code
  ```sh
  <!DOCTYPE html>
  ```
- Use lowercase element names
- Close all HTML elements even when not required
- Use lowercase attribute names
- Always quote attribute values
- Always specify alt, width, and height for images
- When assigining attributes do not use spaces around the equal signs
- For readability, add blank lines to separate large or logical code blocks
  ```sh
  <body>

  <h1>Example h1</h1>

  <h2>Example h2</h2>
  <p>Example of multipe Sentences.
  Here is a line seperated by a comma,
  followed by the the final line.</p>

  </body>
  ```
- For lists and tables make use of two spaces for indentation
- Always include <title>, <html>, <body> and <head> tags
- Set the viewport for mobile access
  ```sh
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- Use below format to link style sheets
  ```sh
  <link rel="stylesheet" href="styles.css">
  ```
- CSS rules format
    - Put the opening bracket at the end of the first line
    - Use one space before the opening bracket
    - Put the closing bracket on a new line, without leading spaces
  ```sh
  body {
    background-color: lightgrey;
    font-family: "Arial Black", Helvetica, sans-serif;
    font-size: 16em;
    color: red;
  }

  
  ```

