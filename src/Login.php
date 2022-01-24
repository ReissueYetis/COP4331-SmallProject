<?php
// Andrew Phan
// php for login

  $inData = getRequestInfo();

  $username = "";
  $password = "";
  // Password hash check (not sure how to do)
  //\b[A-Fa-f0-9]{64}\b
  // Use this regex if you want - Addison (I don't know what this means)

  $conn = new mysqli("localhost", "username", "password", "COP4331");

  // If it cannot connect, return with error
  if ($conn->connect_error)
  {
    returnWithError($conn->connect_error);
  }
  // Else it can connect
  else
  {

  }





  // Functions

  // Not sure if this function is correct (I just copied from login.php from LAMP stack example)
  function getRequestInfo()
  {
    return json_decode(file_get_contents('php://input'), true);
  }

  function sendResultInfoAsJson($obj)
  {
    header('Content-type: application/json');
    echo $obj;
  }

  function returnWithError($err)
  {
    $retValue = '{}'
  }

  function returnWithInfo()
?>
