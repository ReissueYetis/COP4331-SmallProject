
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
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
			$stmt = $conn->prepare("SELECT ID, UserID, DateCreated FROM Contacts WHERE ID=?");
			$stmt->bind_param("i", $inData["id"]);
			$stmt->execute();
			$result = $stmt->get_result();

			if( $row = $result->fetch_assoc()  )
			{
				$userID = $row['UserID'];
				$dateCreated = $row['DateCreated'];
				$updatedID = $row['ID'];
				$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, EmailAddress=? WHERE ID=?");
				$stmt->bind_param("ssssi", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["emailAddress"], $inData["id"]);
				$stmt->execute();
				
				returnWithInfo($inData["firstName"], $inData["lastName"], $updatedID, $inData["phoneNumber"], $inData["emailAddress"], $dateCreated, $userID);
			}
			else
			{
				returnWithError("Invalid Contact");
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
