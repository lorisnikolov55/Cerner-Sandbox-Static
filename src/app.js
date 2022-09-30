async function makeRequests(){
    var patient = await fetch(myApp.smart.state.serverURL+"/Patient/"+myApp.smart.patient.id, {
        headers: {
            Accept: "application/json+fhir",
            Authorization: "Bearer "+myApp.smart.state.tokenResponse.access_token
        }
    }).then(function(data){
        return data
    })

    var response = await patient.json()
    console.log(response)
    $("#patient").text(JSON.stringify(response, null, '\t'))
}