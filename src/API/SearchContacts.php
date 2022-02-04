<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "MAINUSER", "COP4331Project!", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE
		(FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber Like ? OR EmailAddress LIKE ?) AND UserID=? LIMIT 20");
		$contactSearch = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssssi", $contactSearch, $contactSearch, $contactSearch, $contactSearch, $inData["userId"]);
		$stmt->execute();

		$result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["ID"] . '"';
			$searchResults .= '"' . $row["FirstName"] . '"';
			$searchResults .= '"' . $row["LastName"] . '"';
			$searchResults .= '"' . $row["PhoneNumber"] . '"';
			$searchResults .= '"' . $row["EmailAddress"] . '"';
			$searchResults .= '"' . $row["DateCreated"] . '"';
			$searchResults .= '"' . $row["UserID"] . '"';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
		$conn->close();
	}



	// Functions

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

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
