
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$reqTime = date('Y-m-d H:i:s');

	$conn = new mysqli("localhost", "MAINUSER", "COP4331Project!", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if ((strlen($inData["password"]) > 64) || (strlen($inData["login"]) > 64) || (strlen($inData["lastName"]) > 64) || (strlen($inData["firstName"]) > 64))
		{
			returnWithError("Field Value Too Large");
		}
		else
		{
			$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
			$stmt->bind_param("ss", $inData["login"], $inData["password"]);
			$stmt->execute();
			$result = $stmt->get_result();

			if( $row = $result->fetch_assoc()  )
			{
				returnWithError("Login Name Taken");
			}
			else
			{
				$stmt = $conn->prepare("INSERT INTO Users (DateCreated, FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?, ?)");
				$stmt->bind_param("sssss", $reqTime, $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
				$stmt->execute();
				
				$stmt = $conn->prepare("SELECT MAX(ID) maxID FROM Users");
				$stmt->execute();
				$result = $stmt->get_result();
				$newID = ($result->fetch_all())[0][0];
				
				returnWithInfo( $inData["firstName"], $inData["lastName"], $newID );
			}
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
