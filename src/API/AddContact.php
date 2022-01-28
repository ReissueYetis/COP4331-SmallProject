
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$reqTime = date('Y-m-d H:i:s');
	$phoneRegex = "/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/";

	$conn = new mysqli("localhost", "MAINUSER", "COP4331Project!", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if ((strlen($inData["phoneNumber"]) > 50) || (strlen($inData["emailAddress"]) > 50) || (strlen($inData["lastName"]) > 50) || (strlen($inData["firstName"]) > 50))
		{
			returnWithError("Field Value Too Large");
		}
		else if ((preg_match($phoneRegex, $inData["phoneNumber"]) == false) && ($inData["phoneNumber"] != ""))
		{
			returnWithError("Phone Number Invalid");
		}
		else
		{
			$stmt = $conn->prepare("SELECT ID FROM Users WHERE ID=?");
			$stmt->bind_param("i", $inData["userID"]);
			$stmt->execute();
			$result = $stmt->get_result();

			if( $row = $result->fetch_assoc()  )
			{
				$stmt = $conn->prepare("INSERT INTO Contacts (DateCreated, FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES (?, ?, ?, ?, ?, ?)");
				$stmt->bind_param("sssssi", $reqTime, $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["emailAddress"], $inData["userID"]);
				$stmt->execute();
				
				$stmt = $conn->prepare("SELECT MAX(ID) maxID FROM Contacts");
				$stmt->execute();
				$result = $stmt->get_result();
				$newID = ($result->fetch_all())[0][0];
				
				returnWithInfo($inData["firstName"], $inData["lastName"], $newID, $inData["phoneNumber"], $inData["emailAddress"], $reqTime, $inData["userID"]);
			}
			else
			{
				returnWithError("Invalid User");
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
		$retValue = '{"id":0,"firstName":"","lastName":"","phoneNumber":"","emailAddress":"","dateCreated":"","userID":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id, $phoneNumber, $emailAddress, $dateCreated, $userID )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phoneNumber":"' . $phoneNumber . '","emailAddress":"' . $emailAddress . '","dateCreated":"' . $dateCreated . '","userID":"' . $userID . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
