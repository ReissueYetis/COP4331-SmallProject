<?php
	$inData = getRequestInfo();

	$contactId = $inData["contactId"];
	$deletedContact = "";

	$conn = new mysqli("localhost", "MAINUSER", "COP4331Project!", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// Search to see if an account
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
		$stmt->bind_param("i", $contactId);
		$stmt->execute();
		returnWithInfo( $inData['ID'] );
		$result = $stmt->get_result();
		// If search result comes up, delete account
		if( $row = $result->fetch_assoc() )
		{
			$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
			$stmt->bind_param("i", $contactId);

			$stmt->execute();
		}
		else
		{
			returnWithError( "No Record Found" );
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $id )
	{
		$retValue = '{"ID":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
