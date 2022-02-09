<?php

        $inData = getRequestInfo();

        $conn = new mysqli("localhost", "MAINUSER", "COP4331Project!", "COP4331");
        if( $conn->connect_error ) {
                returnWithError( $conn->connect_error );
        } else {
                $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
                $stmt->bind_param("ss", $inData["login"], $inData["password"]);
                $stmt->execute();
                $result = $stmt->get_result();
                if( $row = $result->fetch_assoc()  ) {
                        $stmt = $conn->prepare("DELETE FROM Users WHERE Login=? AND Password=?");
                        $stmt->bind_param("ss", $inData["login"], $inData["password"]);
                        $stmt->execute();
                        $result = $stmt->get_result();
                        returnWithInfo( $inData["login"], $inData["password"]);
                } else {
                        ReturnWithError("Invalid account");
                }
        }
        $stmt->close();
        $conn->close();

        function getRequestInfo() {
                return json_decode(file_get_contents('php://input'), true);
        }

        function sendResultInfoAsJson( $obj ) {
                header('Content-type: application/json');
                echo $obj;
        }

        function returnWithError( $err ) {
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $login, $password ) {
                $retValue = '{"login":"' . $login . '","password":"' . $password . '","error":""}';
                sendResultInfoAsJson( $retValue );
        }

?>
