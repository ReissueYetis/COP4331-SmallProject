<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$finalResults = "";
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
				$finalResults .= ",";
			}
			$finalResults .= "{";

			$searchCount++;
			$searchResults .= '"ID": ' . $row["ID"] . ',';
			$searchResults .= '"FirstName": "' . $row["FirstName"] . '",';
			$searchResults .= '"LastName": "' . $row["LastName"] . '",';
			$searchResults .= '"PhoneNumber": "' . $row["PhoneNumber"] . '",';
			$searchResults .= '"EmailAddress": "' . $row["EmailAddress"] . '",';
			$searchResults .= '"DateCreated": "' . $row["DateCreated"] . '",';
			$searchResults .= '"UserID": ' . $row["UserID"];

			$finalResults .= $searchResults . "}";
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $finalResults );
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
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $finalResults )
	{
		// $retValue = '{' . $searchResults . ',"error":""}';
		$retValue = '{"results":[' . $finalResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
